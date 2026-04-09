import 'dotenv/config'; // Загрузка переменных из .env
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { calculateSrp6Verifier } from './srp6';

const app = express();

// --- КОНФИГУРАЦИЯ ИЗ .ENV ---
const JWT_SECRET = process.env.JWT_SECRET || 'frostmourne_secret_2026';
const PORT = process.env.PORT || 8000;

// Подключение к БД через переменные окружения
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // Здесь должна быть acore_auth
    waitForConnections: true,
    connectionLimit: 10
});

// Настройка почты
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

interface ReqWithUser extends express.Request {
    user?: { id: number; username: string; role: string };
}

// --- MIDDLEWARE ---
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function signToken(user: any) {
    return jwt.sign(
        { sub: user.id, username: user.username, role: user.role || 'user' }, 
        JWT_SECRET, 
        { expiresIn: '2h' }
    );
}

// --- РОУТЫ АВТОРИЗАЦИИ ---

app.post('/auth/register',
    body('username').isString().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Invalid input' });

        const { username, email, password } = req.body;

        try {
            // Ищем в базе аккаунтов (acore_auth)
            const [exists]: any = await pool.execute('SELECT id FROM account WHERE username = ? OR email = ?', [username, email]);
            if (exists.length > 0) return res.status(400).json({ success: false, error: 'User or Email exists' });

            const salt = crypto.randomBytes(32);
            const verifier = calculateSrp6Verifier(username, password, salt);
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await pool.execute(
                'INSERT INTO account (username, salt, verifier, email, reg_mail, vcode) VALUES (?, ?, ?, ?, ?, ?)',
                [username.toUpperCase(), salt, verifier, email, email, code]
            );

            await transporter.sendMail({
                from: `"Frostmourne" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Confirmation Code",
                html: `<h1>Welcome!</h1><p>Your confirmation code: <b>${code}</b></p>`
            });

            res.json({ success: true, message: 'Confirmation code sent to email' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'DB Error' });
        }
    }
);

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows]: any = await pool.execute('SELECT id, username, salt, verifier FROM account WHERE username = ?', [username.toUpperCase()]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const checkVerifier = calculateSrp6Verifier(username, password, user.salt);

        if (Buffer.compare(user.verifier, checkVerifier) !== 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken(user);
        res.json({ success: true, data: { token, account: { id: user.id, username: user.username } } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- РОУТЫ КОНТЕНТА И РАНГОВ (С ИСПРАВЛЕННЫМИ БАЗАМИ) ---

app.get('/news', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM website_news ORDER BY createdAt DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.json({ success: true, data: [] });
    }
});

// PVP Топ (база acore_characters)
app.get('/rankings/pvp', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT name AS characterName, race, class, level, totalKills AS score, gender
            FROM acore_characters.characters 
            WHERE deleteDate IS NULL 
            ORDER BY totalKills DESC LIMIT 20
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('PVP Error:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// PVE Топ (база acore_characters)
app.get('/rankings/pve', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT name AS characterName, race, class, level, logout_time AS score 
            FROM acore_characters.characters 
            WHERE deleteDate IS NULL 
            ORDER BY level DESC, logout_time DESC LIMIT 20
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Топ Гильдий (база acore_characters)
app.get('/rankings/guilds', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT g.guildid AS id, g.name, c.name AS leaderName, 
            (SELECT COUNT(*) FROM acore_characters.guild_member WHERE guildid = g.guildid) AS memberCount
            FROM acore_characters.guild g
            JOIN acore_characters.characters c ON g.leaderguid = c.guid
            ORDER BY memberCount DESC LIMIT 10
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.get('/content', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM website_content');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.json({ success: true, data: [] });
    }
});

app.get('/rankings/search', async (req, res) => {
    const { name } = req.query;
    try {
        const [rows]: any = await pool.execute(
            'SELECT name AS characterName, race, class, level FROM acore_characters.characters WHERE name LIKE ? LIMIT 1',
            [`%${name}%`]
        );
        res.json({ success: true, data: rows[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Search error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});