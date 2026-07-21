# Nauli

A fast, focused matatu fare tracking app for Kenya. 

**Answers one question:** "How much am I most likely to pay if I board a matatu RIGHT NOW?"

Nauli reports what commuters are **actually paying in real time**, based on community intelligence (like Waze for matatu fares).

## 🚀 Features

- **Real-time fare estimates** - Based on actual community reports
- **Confidence scoring** - Shows reliability of the current estimate
- **Fast reporting** - Submit a fare in under 5 seconds
- **Weather & traffic context** - Optional details help explain fare changes
- **Community intelligence** - Like Waze, but for matatu fares in Kenya
- **Simple, focused UI** - Get the fare you need in 3 seconds

## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
nextjs/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 📖 How It Works

**Home Screen**
- Enter FROM and TO locations
- Press "Find Fare"
- See Popular Routes and Recent Fare Updates

**Results Screen**
- View estimated current fare
- See confidence level based on community reports
- Check lowest/highest fare for today
- Read recent reports from other commuters
- Submit your own fare report

**Reporting Flow**
- Required: From, To, Operator, Fare Paid
- Optional: Traffic level, Weather, Notes
- Takes under 5 seconds

## 🎨 Design

This project uses Tailwind CSS for styling with the following features:
- Simple, focused UI (no dashboards or hero sections)
- Mobile-first responsive design
- Minimal but functional interface
- Fast load times

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:

  ```bash
  npm run build
  ```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by Next.js and React
- Styled with Tailwind CSS

## 🤖 AI Assistance

This project was developed with substantial assistance from Codex 5.6 (Luna).
While the overall product design, feature set, and UX direction were defined by the project's designer, Codex 5.6 (Lunar) was used extensively during implementation to:

- Scaffold the Next.js application and project structure
- Generate UI components and pages from design notes
- Implement server-side routes and database access patterns
- Help diagnose and fix build and schema issues (Prisma, Next.js)
- Prototype local fallbacks (localStorage) for offline testing
- Suggest refinements to UX, accessibility, and error handling

The code produced by Codex was reviewed, adapted, and integrated by the project team. This acknowledgment reflects the role of the AI as a development assistant that accelerated implementation and debugging while the designer directed the product.

**AI Assistant:** Codex 5.6 (Lunar)

Built with Codex