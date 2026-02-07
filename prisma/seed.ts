const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_FILE = path.join(process.cwd(), 'data.json');

async function main() {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // Seed Users
    for (const user of data.users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: "$2a$10$cw/7jS5s5.9.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5", // hash of 'password' (placeholder)
                role: user.role,
            },
        });
    }

    // Seed Barbershops
    console.log(`Seeding ${data.barbershops.length} barbershops...`);
    for (const shop of data.barbershops) {
        console.log(`Creating shop: ${shop.name}`);
        try {
            await prisma.barbershop.upsert({
                where: { id: shop.id },
                update: {},
                create: {
                    id: shop.id,
                    name: shop.name,
                    address: shop.address,
                    phone: shop.phone,
                    hours: shop.hours,
                },
            });
        } catch (error) {
            console.error(`Failed to create shop ${shop.name}:`, error);
        }
    }

    // Seed Services
    for (const service of data.services) {
        await prisma.service.upsert({
            where: { id: service.id },
            update: {},
            create: {
                id: service.id,
                name: service.name,
                duration: service.duration,
                price: service.price,
                barbershopId: service.barbershopId,
            },
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
