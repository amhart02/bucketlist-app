# Bucket List Application

A full-stack web application enabling users to create, manage, and track personal bucket lists with authentication, custom item management, and a pre-built ideas library.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Credentials Provider
- **Styling**: Tailwind CSS + shadcn/ui components
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E)

## Quick Start

See the comprehensive quickstart guide: [specs/001-bucketlist-app/quickstart.md](/specs/001-bucketlist-app/quickstart.md)

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier) or local MongoDB instance
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.template .env.local

# Edit .env.local with your MongoDB URI and NextAuth secret
# Generate NextAuth secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   ├── dashboard/            # User dashboard
│   ├── lists/[id]/           # Bucket list detail
│   ├── library/              # Ideas library
│   └── api/                  # API routes
├── components/               # React components
├── lib/                      # Utilities and configs
├── models/                   # Mongoose models
└── types/                    # TypeScript types
```

## Available Scripts

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Run production build
npm run lint             # ESLint
npm run format           # Prettier
npm run db:seed          # Seed database with categories and library ideas
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-hex-32>

# Optional: Node Environment
NODE_ENV=development
```

### Generating Secrets

```bash
# Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using openssl
openssl rand -hex 32
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `MONGODB_URI`
     - `NEXTAUTH_URL` (use your Vercel domain, e.g., `https://your-app.vercel.app`)
     - `NEXTAUTH_SECRET`
   - Deploy!

3. **Seed Production Database**:
   ```bash
   # After first deployment
   vercel env pull .env.local
   npm run db:seed
   ```

### Other Platforms

#### Railway / Render / DigitalOcean

1. Connect your GitHub repository
2. Set environment variables in platform dashboard
3. Deploy command: `npm run build && npm run start`
4. Port: Auto-detected (Next.js uses `process.env.PORT` or 3000)

#### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t bucketlist-app .
docker run -p 3000:3000 --env-file .env.local bucketlist-app
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB instance (not development cluster)
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Enable MongoDB Atlas IP whitelist or use 0.0.0.0/0 for cloud platforms
- [ ] Seed production database with library ideas: `npm run db:seed`
- [ ] Test all user flows in production
- [ ] Monitor logs for errors
- [ ] Set up database backups

## Features

### Implemented (MVP + Enhancements)

✅ **Authentication** (Phase 3)
- User registration and login
- 7-day session persistence
- Password hashing with bcrypt

✅ **Bucket Lists** (Phase 4)
- Create, view, rename, delete lists
- Multiple lists per user
- Activity tracking

✅ **Custom Items** (Phase 5)
- Add, edit, complete, delete items
- Checkbox toggle for completion
- Visual strikethrough for completed items

✅ **Library of Ideas** (Phase 6)
- 100+ pre-built ideas across 5 categories
- Search and filter by category
- Add library ideas to your lists
- Usage count tracking

✅ **Progress Tracking** (Phase 7)
- Color-coded progress bars
- Overall progress dashboard widget
- Completion statistics

✅ **Activity Reminders** (Phase 7)
- Smart reminders for inactive lists (>14 days)
- Dismissible notifications
- User settings to enable/disable reminders

✅ **Polish & Production** (Phase 9)
- Loading skeletons for better UX
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- SEO metadata and favicon
- Optimized MongoDB queries with .lean()
- API response caching (24h for library)
- Structured logging for critical operations
- Security audited (authentication + authorization)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout (NextAuth)

### Bucket Lists
- `GET /api/lists` - Get all user's lists
- `POST /api/lists` - Create new list
- `GET /api/lists/[id]` - Get single list with items
- `PATCH /api/lists/[id]` - Update list name
- `DELETE /api/lists/[id]` - Delete list

### Items
- `POST /api/lists/[id]/items` - Add item to list
- `PATCH /api/items/[id]` - Update item (text or completion)
- `DELETE /api/items/[id]` - Delete item

### Library
- `GET /api/library/categories` - Get all categories
- `GET /api/library/categories/[id]/ideas` - Get ideas by category
- `GET /api/library/search?q=keyword` - Search library ideas

### User Settings
- `GET /api/user/settings` - Get user settings
- `PATCH /api/user/settings` - Update settings

## Performance

- **API Response Time**: <200ms p95 (optimized with .lean())
- **Page Load**: <2s initial load (with SSR)
- **Caching**: 24h cache for library content
- **Database**: Indexed queries for fast lookups

## Security

- ✅ Password hashing with bcrypt
- ✅ JWT session tokens (7-day expiry)
- ✅ API authentication on all protected routes
- ✅ Authorization checks for resource ownership
- ✅ Password hash never exposed in API responses
- ✅ Input validation with Zod schemas
- ✅ CORS configured via Next.js defaults

## Documentation

- **Specification**: `/specs/001-bucketlist-app/spec.md`
- **Implementation Plan**: `/specs/001-bucketlist-app/plan.md`
- **Data Model**: `/specs/001-bucketlist-app/data-model.md`
- **API Contracts**: `/specs/001-bucketlist-app/contracts/api-spec.yaml`
- **Tasks**: `/specs/001-bucketlist-app/tasks.md`

## License

MIT

