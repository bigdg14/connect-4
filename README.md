# Connect 4 Online

A modern Connect 4 game built with Next.js, TypeScript, and beautiful animations. Features AI opponents with minimax algorithm, game history tracking, and sound effects.

## Features

- 🎮 **Multiple Game Modes**
  - Local 2-Player
  - VS AI Easy (Random moves)
  - VS AI Hard (Minimax algorithm with alpha-beta pruning)

- 🎨 **Modern UI/UX**
  - Beautiful animations with Framer Motion
  - Responsive design for mobile, tablet, and desktop
  - Dark theme with gradient accents
  - Satisfying sound effects with mute toggle

- 📊 **Game History**
  - Track all games in PostgreSQL database
  - Filter by game mode
  - View past games with move count and duration
  - Statistics tracking ready for future features

- 🤖 **Smart AI**
  - Easy mode: Random valid moves
  - Hard mode: Minimax algorithm with alpha-beta pruning, depth 5 search
  - Position evaluation with scoring system
  - Hint system using hard AI logic

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **Database:** Neon.tech Serverless PostgreSQL with Prisma ORM
- **Sound:** Web Audio API with synthesized tones
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon.tech account (for database)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/bigdg14/connect-4.git
   cd connect-4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-neon-postgresql-connection-string"
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. Configure environment variables in Vercel:
   - Add `DATABASE_URL` with your Neon PostgreSQL connection string

4. Deploy:
   - Vercel will automatically build and deploy
   - The `postinstall` script will generate Prisma client
   - Build command runs Prisma generate before Next.js build

5. Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
connect-4/
├── app/
│   ├── api/              # API routes for game history & statistics
│   ├── game/             # Game page
│   ├── history/          # Game history page
│   └── page.tsx          # Home page (mode selection)
├── components/
│   ├── GameBoard.tsx     # Main game board with animations
│   ├── GameControls.tsx  # Control buttons
│   ├── GameHeader.tsx    # Game status display
│   ├── GameHistory.tsx   # History display component
│   ├── MenuButton.tsx    # Mode selection buttons
│   └── SoundToggle.tsx   # Sound mute/unmute button
├── hooks/
│   ├── useGameState.ts   # Game logic and state management
│   └── useSound.ts       # Sound effects system
├── lib/
│   ├── ai.ts             # AI minimax algorithm
│   ├── db.ts             # Prisma client instance
│   └── gameLogic.ts      # Core game rules
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
└── types/
    └── game.ts           # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma generation)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma client (runs automatically)

## License

MIT
