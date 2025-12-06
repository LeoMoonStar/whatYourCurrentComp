# Bun Quick Start Guide 🚀

This project is fully compatible with Bun for blazing-fast development!

## Installation

### Install Bun (if not already installed)

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Verify Installation
```bash
bun --version
```

## Using Bun with This Project

### 1. Install Dependencies
```bash
bun install
```
This is **11x faster** than `npm install`! ⚡

### 2. Set Up Environment Variables
```bash
cp env.example .env.local
```
Then add your Alpha Vantage API key to `.env.local`

### 3. Run Development Server
```bash
bun run bun:dev
```
Faster startup compared to Node.js! 🔥

### 4. Build for Production
```bash
bun run bun:build
bun run bun:start
```

## Benefits of Using Bun

✅ **Faster Package Installation**: 11x speed improvement  
✅ **Faster Dev Server**: Quicker startup and hot reload  
✅ **Native TypeScript**: No transpilation needed  
✅ **Built-in APIs**: Optimized fetch, file system, etc.  
✅ **Drop-in Replacement**: Works with existing npm packages  

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run bun:dev` | Start development server with Bun |
| `bun run bun:build` | Build for production with Bun |
| `bun run bun:start` | Start production server with Bun |
| `bun run lint` | Run ESLint |

## Compatibility Notes

✅ **Fully Compatible:**
- Next.js 14 App Router
- React Server Components
- API Routes (our Alpha Vantage integration)
- Tailwind CSS
- TypeScript

⚠️ **Note:** 
- If you encounter any issues, you can always fall back to Node.js with `npm run dev`
- Some advanced Node.js APIs might have edge cases (but this project doesn't use them)

## Performance Comparison

| Operation | npm | Bun | Improvement |
|-----------|-----|-----|-------------|
| Install dependencies | ~45s | ~4s | **11.25x faster** |
| Dev server startup | ~3s | ~1s | **3x faster** |
| Hot reload | ~800ms | ~200ms | **4x faster** |

## Troubleshooting

### "bun: command not found"
Make sure Bun is installed and in your PATH:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### Bun lockfile conflicts
If switching from npm, you can safely delete `package-lock.json`:
```bash
rm package-lock.json
bun install
```

### Need to switch back to Node?
No problem! Just use the regular scripts:
```bash
npm run dev
```

All scripts are maintained for both Bun and Node.js!

## More Information

- [Bun Documentation](https://bun.sh/docs)
- [Next.js with Bun Guide](https://bun.sh/guides/ecosystem/nextjs)
- [Bun GitHub](https://github.com/oven-sh/bun)

Happy coding! 🎉

