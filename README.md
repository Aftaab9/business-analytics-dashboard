# 🚀 Business Analytics Dashboard

A comprehensive AI-powered business analytics dashboard built with Next.js, Firebase, and Google AI. This application provides role-based dashboards, financial forecasting, strategic analysis, and intelligent business insights.

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Dashboards**: Customized views for CEO, CFO, CMO, Sales Manager, Admin, and General Users
- **AI-Powered Analysis**: Google AI integration for intelligent business insights
- **Financial Forecasting**: Advanced forecasting models and predictions
- **Strategic Pricing**: AI-driven pricing strategy recommendations
- **Business Intelligence**: Comprehensive analytics and reporting tools

### 📊 Dashboard Components
- **Executive Summary**: High-level business overview
- **Financial Analysis**: Revenue, expenses, and profitability insights
- **Market Analysis**: Demand-supply charts and market trends
- **Economic Indicators**: Phillips Curve, AD-AS models, and economic analysis
- **Forecasting Tools**: Multiple forecasting methods and predictions
- **Meeting Scheduler**: AI-powered meeting coordination
- **Anomaly Detection**: Automated expense and data anomaly identification

### 🛠️ Technical Features
- **Next.js 15.3.3** with Turbopack for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for modern, responsive design
- **Firebase Integration** for backend services
- **Google AI (Gemini)** for intelligent features
- **Role-based Authentication** system
- **Responsive Design** for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aftaab9/business-analytics-dashboard.git
   cd business-analytics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📁 Project Structure

```
src/
├── ai/                          # AI flows and configurations
│   ├── flows/                   # AI-powered business flows
│   │   ├── business-analysis-flow.ts
│   │   ├── executive-summary.ts
│   │   ├── financial-forecasting.ts
│   │   ├── pricing-strategy-flow.ts
│   │   └── ...
│   └── genkit.ts               # Google AI Genkit configuration
├── app/                        # Next.js app router
│   ├── (app)/                  # Protected app routes
│   │   ├── dashboard/          # Main dashboard
│   │   ├── business-analysis/  # Business analysis tools
│   │   ├── forecasting/        # Forecasting tools
│   │   ├── strategic-pricing/  # Pricing strategy
│   │   └── ...
│   ├── login/                  # Authentication
│   └── layout.tsx              # Root layout
├── components/                 # Reusable components
│   ├── charts/                 # Data visualization components
│   ├── role-dashboards/        # Role-specific dashboards
│   ├── auth/                   # Authentication components
│   └── ui/                     # UI component library
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
└── types/                      # TypeScript type definitions
```

## 🎨 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

## 🔧 Configuration

### Google AI Setup
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file as `GOOGLE_GENAI_API_KEY`

### Firebase Setup
1. Create a Firebase project
2. Configure Firebase services as needed
3. Update Firebase configuration in your app

## 🎯 Role-Based Access

The application supports multiple user roles with customized dashboards:

- **CEO**: Executive overview and strategic insights
- **CFO**: Financial analysis and forecasting
- **CMO**: Marketing analytics and campaign insights
- **Sales Manager**: Sales performance and pipeline analysis
- **Admin**: System administration and user management
- **General User**: Basic analytics and reporting

## 📊 AI Features

### Business Analysis Flows
- **Executive Summary Generation**: AI-powered executive reports
- **Financial Forecasting**: Predictive financial modeling
- **Pricing Strategy**: AI-driven pricing recommendations
- **Anomaly Detection**: Automated detection of unusual patterns
- **Meeting Scheduler**: Intelligent meeting coordination
- **Product Demand Forecast**: Market demand predictions

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy to Firebase
firebase deploy
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Google AI](https://ai.google.dev/) for AI capabilities
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ using Next.js, Firebase, and Google AI**