
import { db } from './lib/db';

async function main() {
    console.log("Testing DB connection...");
    try {
        const users = await db.getUsers();
        console.log("Users:", users);
        const shop = await db.getBarbershop();
        console.log("Shop:", shop);
    } catch (e) {
        console.error("DB Error:", e);
    }
}

main();
