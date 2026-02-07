const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const shopCount = await prisma.barbershop.count();
    const userCount = await prisma.user.count();
    console.log(`Barbershops: ${shopCount}`);
    console.log(`Users: ${userCount}`);

    if (shopCount > 0) {
        const shops = await prisma.barbershop.findMany();
        console.log('Shops:', shops);
    }
    if (userCount > 0) {
        const users = await prisma.user.findMany();
        console.log('Users:', users);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
