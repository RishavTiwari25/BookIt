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
      title: "Jaipur Heritage Walk",
      description: "Explore Pink City’s iconic Hawa Mahal, City Palace lanes, and hidden bazaars with a local guide.",
      location: "Jaipur, Rajasthan",
      pricePerPerson: 799,
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Varanasi Ghat Aarti & Boat Ride",
      description: "Witness the mesmerizing Ganga Aarti and glide along the ghats at sunrise in a wooden boat.",
      location: "Varanasi, Uttar Pradesh",
      pricePerPerson: 999,
      imageUrl: "https://images.unsplash.com/photo-1585515764311-81a6509e0b7c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Mumbai Street Food Trail",
      description: "Taste legendary vada pav, pav bhaji, and kulfi while strolling through iconic neighbourhoods.",
      location: "Mumbai, Maharashtra",
      pricePerPerson: 699,
      imageUrl: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Goa Kayaking in Backwaters",
      description: "Paddle through serene mangroves and spot vibrant birdlife in Goa’s calm backwaters.",
      location: "Baga, Goa",
      pricePerPerson: 1499,
      imageUrl: "https://images.unsplash.com/photo-1593697821310-d8f2e5b1b7e1?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Rishikesh River Rafting",
      description: "Ride the rapids on the Ganges with certified instructors; perfect blend of thrill and views.",
      location: "Rishikesh, Uttarakhand",
      pricePerPerson: 1299,
      imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Kerala Houseboat Day Cruise",
      description: "Glide through Alleppey’s palm-lined canals on a traditional kettuvallam with local lunch.",
      location: "Alleppey, Kerala",
      pricePerPerson: 1999,
      imageUrl: "https://images.unsplash.com/photo-1568809349938-c11c1e2f5c3b?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Delhi India Gate Evening Walk",
      description: "Stroll around India Gate lawns and Rajpath with stories of New Delhi’s grand design.",
      location: "New Delhi, Delhi",
      pricePerPerson: 599,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?india-gate,delhi",
    },
    {
      title: "Agra Taj Sunrise Viewpoint",
      description: "Catch the Taj Mahal glowing at dawn from a quiet riverside spot with chai.",
      location: "Agra, Uttar Pradesh",
      pricePerPerson: 899,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?taj-mahal",
    },
    {
      title: "Udaipur Lake Pichola Sunset Boat",
      description: "Golden-hour cruise past city palace façades and island palaces.",
      location: "Udaipur, Rajasthan",
      pricePerPerson: 1099,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?udaipur,city-palace,lake-pichola",
    },
    {
      title: "Amritsar Golden Temple & Langar",
      description: "Experience shabad kirtan and volunteer at the world’s largest community kitchen.",
      location: "Amritsar, Punjab",
      pricePerPerson: 799,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?golden-temple,amritsar",
    },
    {
      title: "Hyderabad Charminar Bazaar Walk",
      description: "Savor Irani chai and explore Laad Bazaar’s bangles and pearls.",
      location: "Hyderabad, Telangana",
      pricePerPerson: 649,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?charminar,hyderabad",
    },
    {
      title: "Kolkata Heritage Tram & Adda",
      description: "Ride a vintage tram and unwind with mishti and coffee-house adda.",
      location: "Kolkata, West Bengal",
      pricePerPerson: 699,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?kolkata,tram",
    },
    {
      title: "Hampi Ruins Cycling Tour",
      description: "Cycle through boulder-strewn landscapes and temple ruins at sunrise.",
      location: "Hampi, Karnataka",
      pricePerPerson: 1199,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?hampi,stone-chariot",
    },
    {
      title: "Darjeeling Toy Train & Tea",
      description: "Short joyride on the Himalayan Railway and a tasting at a tea garden.",
      location: "Darjeeling, West Bengal",
      pricePerPerson: 999,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?darjeeling,toy-train",
    },
    {
      title: "Munnar Tea Estate Trek",
      description: "Walk through misty tea plantations and rolling hills with a local guide.",
      location: "Munnar, Kerala",
      pricePerPerson: 899,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?munnar,tea-plantations",
    },
    {
      title: "Shimla Colonial Trail",
      description: "Mall Road, Viceregal Lodge, and tales of the British summer capital.",
      location: "Shimla, Himachal Pradesh",
      pricePerPerson: 799,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?shimla,viceregal-lodge",
    },
    {
      title: "Pondicherry French Quarter Ride",
      description: "Cycle past pastel villas, seaside promenade, and hidden cafés.",
      location: "Puducherry",
      pricePerPerson: 749,
      imageUrl: "https://source.unsplash.com/featured/1600x900/?pondicherry,white-town",
    },
    {
      title: "Andaman Snorkeling Intro",
      description: "Crystal-clear waters, vibrant reefs, and a safe beginner session.",
      location: "Havelock, Andaman",
      pricePerPerson: 2199,
      imageUrl: "https://imgs.search.brave.com/MIUAc-nBu_lJ_aPdxTqYVG8GYPvx181xPOfNL8zH8WQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi84LzgwL0Fu/ZGFtYW4uanBnLzUx/MnB4LUFuZGFtYW4u/anBn",
    },
  ];

  const created = [] as { id: number }[];
  for (const exp of experiences) {
    const e = await prisma.experience.create({
      data: exp,
      select: { id: true },
    });
    created.push(e);
  }

  const now = new Date();
  const addDays = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  function slotWindow(dayOffset: number, startHour: number, durationHrs: number) {
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
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    throw e; // ensure non-zero exit code in CI/CLI
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
