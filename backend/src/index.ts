import "dotenv/config";
import express from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());

app.get("/health", async (_req, res) => {
    try {
        await db.execute(sql`select 1`);
        res.json({ ok: true, message: "Backend is working" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Database connection failed",
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
