"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// basic security middleware
app.use((0, helmet_1.default)());
// limit repeated requests
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
}));
// CORS – restrict to frontend origin if provided
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({ origin: allowedOrigin }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CSRF protection (requires cookie parser or session; here we just demonstrate)
const csrfProtection = (0, csurf_1.default)({ cookie: true });
const accounts = [
    { id: 1, username: 'admin', email: 'admin@frostmourne.com', balance: 5000, createdAt: '2024-01-01T00:00:00Z', lastLogin: new Date().toISOString(), status: 'active', role: 'admin', emailConfirmed: true, hashedPassword: bcrypt_1.default.hashSync('admin123', 10) },
    { id: 2, username: 'testuser', email: 'test@example.com', balance: 1500, createdAt: '2024-06-15T00:00:00Z', lastLogin: new Date().toISOString(), status: 'active', role: 'user', emailConfirmed: true, hashedPassword: bcrypt_1.default.hashSync('test123', 10) }
];
let news = [
    { id: 1, title: 'Server Launched', content: 'Welcome to Frostmourne!', excerpt: 'Launch', author: 'Admin', createdAt: new Date().toISOString(), category: 'announcement', featured: true },
];
let contentItems = [
    { id: '1', title: 'Заголовок головної сторінки', category: 'Homepage', key: 'home.title', content: 'Welcome to Frostmourne' },
    { id: '2', title: 'Підзаголовок головної сторінки', category: 'Homepage', key: 'home.subtitle', content: 'Experience WotLK 3.3.5a on our server.' }
];
const pvp = [];
const pve = [];
const guilds = [];
// Auth utilities
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
// simple store for email confirmation codes (registration)
const emailConfirmationCodes = new Map();
// simple store for password change codes
const passwordResetCodes = new Map();
let transactions = [];
function signToken(account) {
    return jsonwebtoken_1.default.sign({ sub: account.id, username: account.username, role: account.role }, JWT_SECRET, { expiresIn: '1h' });
}
// simple authentication middleware
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Missing token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: payload.sub, username: payload.username, role: payload.role };
        const user = accounts.find(a => a.id === req.user.id);
        if (!user || !user.emailConfirmed) {
            return res.status(403).json({ success: false, error: 'Email not confirmed' });
        }
        next();
    }
    catch (e) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}
app.post('/auth/login', (0, express_validator_1.body)('username').isString().notEmpty(), (0, express_validator_1.body)('password').isString().notEmpty(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    const { username, password } = req.body;
    const user = accounts.find(a => a.username === username);
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const match = await bcrypt_1.default.compare(password, user.hashedPassword || '');
    if (!match) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    if (!user.emailConfirmed) {
        return res.status(403).json({ success: false, error: 'Email not confirmed' });
    }
    const token = signToken(user);
    const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, JWT_SECRET + '_refresh', { expiresIn: '7d' });
    res.json({ success: true, data: { token, refreshToken, account: user } });
});
app.post('/auth/register', (0, express_validator_1.body)('username').isString().isLength({ min: 3 }), (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: 'Invalid input' });
    }
    const { username, email, password } = req.body;
    if (accounts.find(a => a.username === username)) {
        return res.status(400).json({ success: false, error: 'Username exists' });
    }
    if (accounts.find(a => a.email === email)) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const id = accounts.length + 1;
    const hashed = await bcrypt_1.default.hash(password, 10);
    const newAcc = { id, username, email, balance: 0, createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), status: 'active', role: 'user', emailConfirmed: false };
    newAcc.hashedPassword = hashed;
    accounts.push(newAcc);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailConfirmationCodes.set(username, code);
    console.log(`Confirmation code for ${email}: ${code}`);
    const token = signToken(newAcc);
    const refreshToken = jsonwebtoken_1.default.sign({ sub: newAcc.id }, JWT_SECRET + '_refresh', { expiresIn: '7d' });
    res.json({ success: true, data: { token, refreshToken, account: newAcc } });
});
app.post('/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token missing' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET + '_refresh');
        const user = accounts.find(a => a.id === payload.sub);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        const token = signToken(user);
        res.json({ success: true, data: { token } });
    }
    catch (e) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
});
// Endpoint to confirm email
app.post('/auth/confirm-email', (req, res) => {
    const { username, code } = req.body;
    const stored = emailConfirmationCodes.get(username);
    if (!stored) {
        return res.status(400).json({ success: false, error: 'No confirmation requested' });
    }
    if (stored !== code) {
        return res.status(400).json({ success: false, error: 'Invalid code' });
    }
    const user = accounts.find(a => a.username === username);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    user.emailConfirmed = true;
    emailConfirmationCodes.delete(username);
    res.json({ success: true, data: user });
});
// Endpoint to resend confirmation code
app.post('/auth/resend-code', (req, res) => {
    const { username } = req.body;
    const user = accounts.find(a => a.username === username);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    emailConfirmationCodes.set(username, newCode);
    console.log(`Resent code to ${user.email}: ${newCode}`);
    res.json({ success: true });
});
// Request password change - sends code to email (logged)
app.post('/account/request-password-change', authenticate, (req, res) => {
    const username = req.user?.username;
    if (!username)
        return res.status(401).json({ success: false, error: 'Unauthenticated' });
    const user = accounts.find(a => a.username === username);
    if (!user)
        return res.status(404).json({ success: false, error: 'User not found' });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    passwordResetCodes.set(username, code);
    console.log(`Password change code for ${user.email}: ${code}`);
    res.json({ success: true });
});
// Confirm password change
app.post('/account/confirm-password-change', authenticate, async (req, res) => {
    const username = req.user?.username;
    if (!username)
        return res.status(401).json({ success: false, error: 'Unauthenticated' });
    const { code, newPassword } = req.body;
    if (!code || !newPassword) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const stored = passwordResetCodes.get(username);
    if (stored !== code) {
        return res.status(400).json({ success: false, error: 'Invalid code' });
    }
    const user = accounts.find(a => a.username === username);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 10);
    user.hashedPassword = hashed;
    passwordResetCodes.delete(username);
    res.json({ success: true });
});
// Stats (requires auth)
app.get('/stats', authenticate, (req, res) => {
    res.json({ success: true, data: { totalUsers: accounts.length, activeUsers: accounts.length, bannedUsers: 0, totalRevenue: 0, revenueThisMonth: 0, totalTransactions: transactions.length, pendingTransactions: 0, onlinePlayers: 0 } });
});
// transactions (user-specific)
app.get('/transactions/:accountId', authenticate, (req, res) => {
    const accId = Number(req.params.accountId);
    const list = transactions.filter(t => t.accountId === accId);
    res.json({ success: true, data: list });
});
// deposit endpoint
app.post('/transactions/deposit', authenticate, (req, res) => {
    const { amount, paymentMethod } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    if (!userId || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid request' });
    }
    const account = accounts.find(a => a.id === userId);
    if (!account)
        return res.status(404).json({ success: false, error: 'Account not found' });
    account.balance += amount;
    const tx = {
        id: `TXN-${Date.now()}`,
        accountId: userId,
        amount,
        type: 'deposit',
        status: 'completed',
        paymentMethod: paymentMethod || 'manual',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
    };
    transactions.push(tx);
    res.json({ success: true, data: tx });
});
// Rankings
app.get('/rankings/pvp', (req, res) => {
    res.json({ success: true, data: pvp });
});
app.get('/rankings/pve', (req, res) => {
    res.json({ success: true, data: pve });
});
app.get('/rankings/guilds', (req, res) => {
    res.json({ success: true, data: guilds });
});
app.get('/rankings/search', (req, res) => {
    const { name } = req.query;
    const entry = [...pvp, ...pve].find(e => e.characterName.toLowerCase() === String(name).toLowerCase());
    res.json({ success: true, data: entry || null });
});
// News
app.get('/news', (req, res) => {
    res.json({ success: true, data: news });
});
app.post('/news', authenticate, requireAdmin, (req, res) => {
    const article = { id: news.length + 1, ...req.body };
    news.push(article);
    res.json({ success: true, data: article });
});
app.put('/news/:id', authenticate, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const idx = news.findIndex(n => n.id === id);
    if (idx === -1)
        return res.status(404).json({ success: false, error: 'Not found' });
    news[idx] = { ...news[idx], ...req.body };
    res.json({ success: true, data: news[idx] });
});
app.delete('/news/:id', authenticate, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    news = news.filter(n => n.id !== id);
    res.json({ success: true });
});
// Content
// list all content pieces
app.get('/content', (req, res) => {
    res.json({ success: true, data: contentItems });
});
// require admin role to modify content
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin only' });
    }
    next();
}
// create new content
app.post('/content', authenticate, requireAdmin, (req, res) => {
    const { title, category, key, content } = req.body;
    if (!title || !category || !key || typeof content !== 'string') {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    if (contentItems.find(c => c.key === key)) {
        return res.status(400).json({ success: false, error: 'Key already exists' });
    }
    const id = (contentItems.length + 1).toString();
    const item = { id, title, category, key, content };
    contentItems.push(item);
    res.json({ success: true, data: item });
});
// update existing piece
app.put('/content/:id', authenticate, requireAdmin, (req, res) => {
    const id = req.params.id;
    const idx = contentItems.findIndex(c => c.id === id);
    if (idx === -1)
        return res.status(404).json({ success: false, error: 'Not found' });
    const { title, category, key, content } = req.body;
    if (title !== undefined)
        contentItems[idx].title = title;
    if (category !== undefined)
        contentItems[idx].category = category;
    if (key !== undefined)
        contentItems[idx].key = key;
    if (content !== undefined)
        contentItems[idx].content = content;
    res.json({ success: true, data: contentItems[idx] });
});
// delete
app.delete('/content/:id', authenticate, requireAdmin, (req, res) => {
    const id = req.params.id;
    const prevLen = contentItems.length;
    contentItems = contentItems.filter(c => c.id !== id);
    res.json({ success: true, removed: prevLen - contentItems.length });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
