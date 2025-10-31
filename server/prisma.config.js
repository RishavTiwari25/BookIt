import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    datasource: {
        url: "file:./prisma/dev.db",
    },
});
//# sourceMappingURL=prisma.config.js.map