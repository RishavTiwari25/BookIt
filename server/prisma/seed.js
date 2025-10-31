import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding database...");
    // Clear existing data (dev only)
    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.promoCode.deleteMany();
    const experiences = [
        {
            title: "Old Town Walking Tour",
            description: "Discover the city's history with a guided walking tour through cobblestone streets and hidden courtyards.",
            location: "Prague, Czechia",
            pricePerPerson: 35.0,
            imageUrl: "https://images.unsplash.com/photo-1543342386-1f1350e84c33?q=80&w=1600&auto=format&fit=crop",
        },
        {
            title: "Sunrise Mountain Hike",
            description: "Catch breathtaking sunrise views on a gentle hike led by local guides.",
            location: "Banff, Canada",
            pricePerPerson: 49.0,
            imageUrl: "https://images.unsplash.com/photo-1508264165352-258a6c59a05a?q=80&w=1600&auto=format&fit=crop",
        },
        {
            title: "Street Food Safari",
            description: "Taste the city's best bites across markets and iconic stalls.",
            location: "Bangkok, Thailand",
            pricePerPerson: 29.0,
            imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1600&auto=format&fit=crop",
        },
        {
            title: "Kayak in Hidden Coves",
            description: "Paddle along turquoise waters and explore sea caves with an expert guide.",
            location: "Algarve, Portugal",
            pricePerPerson: 59.0,
            imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1600&auto=format&fit=crop",
        },
        {
            title: "Wine Tasting at Sunset",
            description: "Sample local wines with a sommelier as the sun dips over the vineyards.",
            location: "Tuscany, Italy",
            pricePerPerson: 72.0,
            imageUrl: "https://images.unsplash.com/photo-1514369118554-e20d93546b30?q=80&w=1600&auto=format&fit=crop",
        },
        {
            title: "Desert Dune Bashing",
            description: "Thrilling 4x4 desert drive ending with dinner under the stars.",
            location: "Dubai, UAE",
            pricePerPerson: 95.0,
            imageUrl: "https://images.unsplash.com/photo-1496568816309-51d7c20e3ad7?q=80&w=1600&auto=format&fit=crop",
        },
    ];
    const created = [];
    for (const exp of experiences) {
        const e = await prisma.experience.create({
            data: exp,
            select: { id: true },
        });
        created.push(e);
    }
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    function slotWindow(dayOffset, startHour, durationHrs) {
        const start = addDays(dayOffset);
        start.setHours(startHour, 0, 0, 0);
        const end = new Date(start.getTime() + durationHrs * 60 * 60 * 1000);
        return { start, end };
    }
    for (const e of created) {
        // Create 4 slots for each experience
        const windows = [
            slotWindow(1, 9, 2),
            slotWindow(2, 14, 2),
            slotWindow(3, 10, 3),
            slotWindow(5, 16, 2),
        ];
        for (const [i, w] of windows.entries()) {
            const total = 8 - i; // decreasing capacity for variety
            await prisma.slot.create({
                data: {
                    experienceId: e.id,
                    startTime: w.start,
                    endTime: w.end,
                    totalSpots: total,
                    availableSpots: Math.max(0, total - (i === 2 ? 7 : i)), // create a nearly sold-out slot
                },
            });
        }
    }
    await prisma.promoCode.createMany({
        data: [
            { code: "SAVE10", discountType: "PERCENT", value: 10, active: true },
            { code: "FLAT100", discountType: "FLAT", value: 100, active: true },
            { code: "OFF5", discountType: "PERCENT", value: 5, active: true },
        ],
        skipDuplicates: true,
    });
    console.log("Seed complete.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map