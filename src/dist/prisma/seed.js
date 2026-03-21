"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash("Hosanna@90", 10);
    await prisma.user.upsert({
        where: { email: "info@hosannaglobal.com" },
        update: {},
        create: {
            firstName: "Hosanna_Admin",
            lastName: "Ogar",
            email: "info@hosannaglobal.com",
            phone: "0000000000",
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    console.log("Admin account seeded");
    await prisma.service.deleteMany();
    await prisma.service.createMany({
        data: [
            {
                name: "Domestic / Residential Cleaning",
                description: "Cleaning for houses and apartments",
                price: 13,
            },
            {
                name: "Office / Commercial Cleaning",
                description: "Cleaning for offices and commercial spaces",
                price: 13,
            },
            {
                name: "Airbnb & Rental Cleaning",
                description: "Cleaning for Airbnb and rental properties",
                price: 13,
            },
            {
                name: "Move-In / Move-Out Cleaning",
                description: "Deep cleaning when moving in or out",
                price: 13,
            },
            {
                name: "End of Tenancy Cleaning",
                description: "Complete cleaning before tenancy ends",
                price: 13,
            },
            {
                name: "Backyard & Street Cleaning",
                description: "Outdoor cleaning services",
                price: 13,
            }
        ],
        skipDuplicates: true,
    });
    console.log("Services seeded successfully");
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map