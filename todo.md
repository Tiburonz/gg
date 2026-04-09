# WoW 3.3.5a Server Website - Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **World of Warcraft: Wrath of the Lich King Official Site**: Dark fantasy, ice theme, runic elements
- **Battle.net**: Modern gaming portal design, clean layouts
- **Style**: Dark Fantasy + Ice/Frost Theme + Runic Elements + Gaming Portal

### Color Palette
- Primary: #0A0F1C (Deep Dark Blue - background)
- Secondary: #1A2332 (Dark Slate - cards/sections)
- Accent: #4A9FFF (Ice Blue - CTAs and highlights)
- Accent Secondary: #7DD3FC (Light Ice Blue - hover states)
- Danger: #DC2626 (Red - warnings/bans)
- Success: #10B981 (Green - success states)
- Gold: #FCD34D (Gold - premium/donation)
- Text Primary: #F9FAFB (White - main text)
- Text Secondary: #9CA3AF (Gray - secondary text)
- Border: #2D3748 (Dark Gray - borders)

### Typography
- Heading1: Inter font-weight 800 (48px) - uppercase for dramatic effect
- Heading2: Inter font-weight 700 (36px)
- Heading3: Inter font-weight 600 (24px)
- Body/Normal: Inter font-weight 400 (16px)
- Body/Emphasis: Inter font-weight 600 (16px)
- Navigation: Inter font-weight 600 (14px)
- Small: Inter font-weight 400 (12px)

### Key Component Styles
- **Buttons**: 
  - Primary: Ice blue gradient background, white text, 8px rounded, glow effect on hover
  - Secondary: Transparent with ice blue border, hover: filled
  - Danger: Red background, white text
- **Cards**: Dark slate background (#1A2332), 1px ice blue border (20% opacity), 12px rounded, subtle frost texture
- **Forms**: Dark inputs with bottom ice blue border, focus: full border glow
- **Navigation**: Sticky header with backdrop blur, ice blue accent on active items
- **Modals**: Dark overlay with frost effect, centered card with glow border

### Layout & Spacing
- Hero section: Full viewport height with animated frost particles background
- Content sections: Max-width 1280px, 80px vertical padding
- Card grids: 3 columns desktop, 2 tablet, 1 mobile, 24px gaps
- Card hover: Lift 4px with ice blue glow shadow, 300ms transition
- Frost effects: Subtle animated gradients and particle effects

### Images to Generate
1. **hero-lich-king-throne.jpg** - Lich King on frozen throne, dramatic ice background, cinematic lighting (Style: photorealistic, dark fantasy, epic scale)
2. **bg-frost-texture.jpg** - Seamless ice/frost texture for backgrounds, blue tones, crystalline patterns (Style: texture, tileable)
3. **icon-sword-frost.png** - Frost-covered sword icon for items category (Style: game icon, transparent background)
4. **icon-mount-frost.png** - Frost wyrm or ice mount icon (Style: game icon, transparent background)
5. **icon-service-rune.png** - Glowing rune icon for services (Style: game icon, transparent background)
6. **character-placeholder.jpg** - WoW character silhouette with frost aura (Style: game art, dark background)
7. **admin-dashboard-bg.jpg** - Dark abstract tech pattern with ice blue accents (Style: abstract, tech)
8. **payment-success-icon.png** - Glowing checkmark with frost effect (Style: icon, transparent background)

---

## Project Structure

### Phase 1: Project Setup & Architecture
- [x] Template initialized
- [ ] Install additional dependencies (axios, zustand, react-hook-form, zod, date-fns)
- [ ] Configure environment variables (.env.example)
- [ ] Setup folder structure (services, types, stores, hooks, utils)
- [ ] Create TypeScript interfaces for all entities
- [ ] Setup mock API service layer with interceptors

### Phase 2: Core Infrastructure
- [ ] Create authentication service with JWT simulation
- [ ] Setup global state management (Zustand stores)
- [ ] Create API service base class with error handling
- [ ] Implement protected route wrapper
- [ ] Create layout components (Header, Footer, Sidebar)
- [ ] Setup routing structure

### Phase 3: Design System & Theme
- [ ] Generate all 8 images using ImageCreator
- [ ] Update Tailwind config with WoW theme colors
- [ ] Create custom CSS for frost effects and animations
- [ ] Build reusable UI components (StatCard, CharacterCard, ItemCard, etc.)
- [ ] Implement loading states and skeletons
- [ ] Create toast notification system

### Phase 4: Authentication Pages
- [ ] Login page with form validation
- [ ] Register page with terms acceptance
- [ ] Password recovery flow (UI only)
- [ ] Implement JWT token storage and refresh simulation
- [ ] Create auth context/store
- [ ] Add form error handling

### Phase 5: Main Public Pages
- [ ] Homepage with hero section, server status, latest news
- [ ] Server status page with real-time mock data
- [ ] News listing and detail pages
- [ ] Server rates and information page
- [ ] Support/FAQ page
- [ ] Footer with links and social media

### Phase 6: Personal Account
- [ ] Account dashboard with overview stats
- [ ] Characters list with WoW 3.3.5a character data structure
- [ ] Character detail page (gear, stats, achievements)
- [ ] Donation balance display
- [ ] Purchase history table with filters
- [ ] Account settings (password change, email)
- [ ] Ban/mute status display

### Phase 7: Donation System
- [ ] Shop main page with categories (Items, Mounts, Services)
- [ ] Item listing with filters and search
- [ ] Item detail modal with character selection
- [ ] Shopping cart functionality
- [ ] Checkout flow with payment method selection
- [ ] Payment simulation (PayPal, Stripe, Crypto UI)
- [ ] Success/failure payment states
- [ ] Transaction history

### Phase 8: Rankings & Community
- [ ] PvP leaderboard (Arena, Battlegrounds)
- [ ] PvE leaderboard (Raid progression, Achievements)
- [ ] Guild rankings with member count
- [ ] Player search functionality
- [ ] Character profile public page

### Phase 9: Admin Panel
- [ ] Admin login and role-based access
- [ ] Dashboard with statistics (revenue, users, online)
- [ ] User management (list, search, ban/unban)
- [ ] Shop items management (CRUD operations)
- [ ] Manual item delivery interface
- [ ] Transaction logs viewer
- [ ] System settings page

### Phase 10: Polish & Optimization
- [ ] Add loading states for all async operations
- [ ] Implement error boundaries
- [ ] Add animations and transitions
- [ ] Optimize images and assets
- [ ] Add meta tags for SEO
- [ ] Create 404 and error pages
- [ ] Mobile responsive testing
- [ ] Cross-browser testing

### Phase 11: Documentation
- [ ] Update README with project overview
- [ ] Document API service structure
- [ ] Create BACKEND_INTEGRATION.md guide
- [ ] Document environment variables
- [ ] Add code comments
- [ ] Create deployment guide

---

## Mock Data Structure

### User/Account
```typescript
interface Account {
  id: number;
  username: string;
  email: string;
  balance: number; // Donation coins
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'banned' | 'suspended';
  banReason?: string;
  role: 'user' | 'admin' | 'moderator';
}
```

### Character (WoW 3.3.5a structure)
```typescript
interface Character {
  guid: number;
  name: string;
  race: number; // 1=Human, 2=Orc, etc.
  class: number; // 1=Warrior, 2=Paladin, etc.
  gender: number; // 0=Male, 1=Female
  level: number;
  money: number; // Copper
  totaltime: number; // Seconds played
  account: number;
  online: boolean;
  zone: number;
  map: number;
  equipmentCache?: string; // Item IDs
}
```

### Shop Item
```typescript
interface ShopItem {
  id: number;
  name: string;
  description: string;
  category: 'item' | 'mount' | 'service';
  itemId?: number; // WoW item ID
  price: number; // In donation coins
  image: string;
  stock?: number;
  featured: boolean;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  accountId: number;
  amount: number;
  type: 'purchase' | 'deposit' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  itemName?: string;
  characterName?: string;
  createdAt: string;
  paymentMethod?: string;
}
```

---

## API Service Architecture

All API calls will go through a service layer that can be easily replaced:

```
src/services/
├── api.service.ts          # Base API class with axios
├── auth.service.ts         # Login, register, logout
├── account.service.ts      # Account info, balance
├── character.service.ts    # Character list, details
├── shop.service.ts         # Shop items, categories
├── donation.service.ts     # Purchases, transactions
├── payment.service.ts      # Payment processing
├── ranking.service.ts      # Leaderboards
└── admin.service.ts        # Admin operations
```

Each service will have mock implementations that return promises with simulated delays.

---

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_API=true
VITE_JWT_SECRET=mock_secret_key
VITE_PAYMENT_SANDBOX=true
```

---

## Key Features Implementation Notes

1. **JWT Simulation**: Store tokens in localStorage, implement expiration checking, auto-refresh logic
2. **Character Selection**: Dropdown with character avatars (race/class icons), level, and online status
3. **Payment Flow**: Multi-step wizard with method selection, confirmation, and result screens
4. **Real-time Status**: Use intervals to simulate server status updates (online count, uptime)
5. **Admin Panel**: Separate route with role checking, different layout
6. **Responsive Design**: Mobile-first approach, hamburger menu, touch-friendly controls
7. **Loading States**: Skeleton loaders for all data-heavy components
8. **Error Handling**: Global error boundary, toast notifications, retry mechanisms

---

## Backend Integration Guide (to be created)

The BACKEND_INTEGRATION.md will include:
- How to replace mock services with real API calls
- Environment variable configuration
- Authentication flow with real JWT
- Database schema mapping
- SOAP/CLI integration points for item delivery
- WebSocket setup for real-time features