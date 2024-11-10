# BudgetN - Smart Money Management App 👋

BudgetN is a comprehensive expense tracking and budget management application built with Expo and React Native, designed to help users manage their finances effectively.

## Features

- Multi-currency support with real-time conversion
- Transaction tracking with categories
- Income and expense management
- Visual analytics and charts
- Customizable themes
- Recurring transactions
- Smart filtering and search

## Project Structure

budgetn/
├── app/
│   ├── (tabs)/                 # Tab-based navigation screens
│   │   ├── home.tsx           # Main dashboard
│   │   ├── transactions.tsx   # Transaction list and management
│   │   └── settings.tsx       # App settings and preferences
│   ├── splash.tsx             # Splash screen
│   └── _layout.tsx            # Root layout with providers
├── components/                 # Reusable UI components
├── constants/                  # App constants and configurations
├── contexts/                   # React Context providers
│   ├── ThemeContext.tsx       # Theme management
│   ├── TransactionContext.tsx # Transaction state management
│   └── CurrencyContext.tsx    # Currency management
├── services/                   # Backend services
├── assets/                     # Static assets and images
└── types/                     # TypeScript type definitions

## Getting Started

1. Install dependencies

bash
npm install


## Development Options

You can run the app on:
- iOS Simulator
- Android Emulator
- Physical device using Expo Go
- Development build

## Key Technologies

- Expo Router for navigation
- React Native Reanimated for animations
- SQLite for local data storage
- Victory Native for charts
- React Native Paper for UI components

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## Support

Join our community:
- GitHub Issues
- Discord Community
- Documentation Wiki

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version

Current Version: 1.0.0

---

Built with ❤️ using Expo and React Native