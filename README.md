# CoHustle - AI-Powered Side Hustle Discovery Platform

CoHustle is a modern web application that helps users find personalized side hustle opportunities using AI. Built for the Ethiopian Cursor Community Live Hackathon, this platform matches users with side hustles based on their location, interests, and available time.

## 🚀 Features

### Core Features
- **AI-Powered Recommendations**: Personalized side hustle suggestions using OpenAI
- **Multi-Provider Authentication**: Sign in with Google, GitHub, or email/password
- **Location-Based Matching**: Find opportunities suitable for your country and city
- **Interest-Based Filtering**: Match opportunities to your skills and interests
- **Time Commitment Flexibility**: Filter by available hours per week
- **Community Insights**: View side hustles shared by other users
- **Multi-Language Support**: Available in multiple languages including Amharic

### User Experience
- **Beautiful Modern UI**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and loading states
- **Interactive Elements**: Like, share, and save side hustles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **Database**: Prisma ORM with SQLite
- **AI Integration**: OpenAI GPT-4
- **Deployment**: Ready for Vercel deployment

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cohustle
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# OpenAI (Required)
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Set Up Database
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Usage

### For Users

1. **Sign Up/Login**: Use Google, GitHub, or email/password
2. **Set Preferences**: 
   - Enter your country and city
   - Select your interests and skills
   - Choose your preferred language
   - Set available hours per week
3. **Get Recommendations**: AI generates personalized side hustle opportunities
4. **Explore Community**: View side hustles shared by other users
5. **Generate More**: Request new recommendations anytime

### For Developers

The application follows a clean architecture with:

- **Components**: Reusable UI components in `/components`
- **API Routes**: Backend endpoints in `/app/api`
- **Database**: Prisma schema in `/prisma`
- **AI Service**: OpenAI integration in `/lib/ai.ts`

## 🔧 API Endpoints

- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save user preferences
- `GET /api/recommendations` - Get user's side hustle recommendations
- `POST /api/recommendations/generate` - Generate new AI recommendation
- `GET /api/community-hustles` - Get community side hustles

## 🎨 Customization

### Adding New Languages
Edit the `LANGUAGES` array in `components/preference-setup.tsx`:

```typescript
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "am", name: "Amharic" },
  // Add more languages here
]
```

### Adding New Interests
Edit the `INTERESTS` array in `components/preference-setup.tsx`:

```typescript
const INTERESTS = [
  "Technology", "Writing", "Design",
  // Add more interests here
]
```

### Customizing AI Prompts
Modify the AI prompts in `lib/ai.ts` to change how recommendations are generated.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - A secure random string
- `OPENAI_API_KEY` - Your OpenAI API key
- OAuth credentials for Google/GitHub

## 🤝 Contributing

This project was built for the Ethiopian Cursor Community Hackathon. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the Ethiopian Cursor Community Hackathon
- Powered by OpenAI GPT-4
- UI components from Radix UI
- Styling with Tailwind CSS

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Happy Hustling! 💪**
