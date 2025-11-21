
# AgriAssist: AI-Powered Farming Assistant

AgriAssist is a comprehensive, AI-powered web application designed for modern farmers in India. It integrates a wide array of tools and data sources to provide actionable insights, improve decision-making, and connect farmers with resources and each other.

## Key Features

- **AI-Powered Dashboard**: The home page provides a personalized dashboard with real-time weather data, AI-driven crop suggestions based on local conditions, and a plant health diagnosis tool.
- **Market Price Tracker**: Fetches and displays current commodity prices from various markets (mandis) across India, filterable by location and commodity.
- **Advanced Farming Tools**: A suite of utilities including:
    - **AI Pesticide Calculator**: Get recommendations for pesticide type and dosage.
    - **AI Carbon Sequestration Calculator**: Estimate your farm's climate impact and carbon capture potential.
    - **Live Field Monitor**: View simulated real-time data from IoT soil sensors.
- **ISRO Satellite Center**: Provides direct links to powerful ISRO platforms like Bhoonidhi, VEDAS, and MOSDAC for accessing advanced satellite imagery and meteorological data.
- **Farm Machinery Rental**: A searchable database of farm equipment available for rent, allowing farmers to find tractors, harvesters, and more from local providers.
- **Product Traceability**: A system for farmers to create a digital, shareable log for their produce from "farm to fork," complete with timestamps and geolocations for each step, enhancing transparency and building consumer trust.
- **AI Assistant & Learning Hub**: An interactive AI chatbot (powered by Gemini) to answer farming questions and a learning center with AI-generated quizzes and links to external educational videos.
- **Community Forum**: A space for farmers to post questions, share knowledge, and connect with a community of peers.
- **Finance Manager**: A simple yet powerful tool for tracking farm-related income and expenses, complete with a cash flow chart.
- **Offline-First Capabilities**: Includes an offline guide for essential farming tips and clear status indicators for the application's connection state, ensuring reliability in areas with poor connectivity.
- **User Profile Management**: Users can create accounts, log in, and manage their profile, including location and preferred language for AI interactions.

## Technical Framework & Stack

The application is built using a modern, robust, and scalable tech stack:

- **Core Framework**: **Next.js 15** using the **App Router** for performant server-side rendering, static site generation, and optimized page loads.
- **Language**: **TypeScript** is used throughout the project for type safety, better developer experience, and more maintainable code.
- **UI Component Library**: **ShadCN UI** provides a set of high-quality, accessible, and themeable React components that form the building blocks of the user interface.
- **Styling**: **Tailwind CSS** is used for a utility-first approach to styling, allowing for rapid and consistent UI development.
- **Backend & Database**: **Firebase** serves as the backend, utilizing:
    - **Firestore**: A NoSQL, cloud-native database for storing all application data, including user profiles, forum posts, and financial transactions.
    - **Firebase Authentication**: For secure user account creation and management.
- **Generative AI**: **Google Genkit** is used as the framework to define, manage, and orchestrate calls to the **Gemini** family of models, which power all AI features in the app.
- **Deployment**: The application is configured for seamless deployment on **Firebase App Hosting**, a managed, serverless platform optimized for Next.js applications.

## Project Structure

The project follows a standard Next.js `src` directory structure:
- `src/app/`: Contains all the application routes and pages.
- `src/components/`: Contains all reusable React components.
- `src/ai/`: Contains all Genkit flows and AI-related logic.
- `src/firebase/`: Contains Firebase configuration, custom hooks, and utility functions.
- `src/lib/`: Contains shared libraries, utilities, and static data.
- `src/hooks/`: Contains custom React hooks.
- `firestore.rules`: Defines the security rules for the Firestore database.
- `apphosting.yaml`: Configuration file for Firebase App Hosting.
- `next.config.ts`: Configuration file for the Next.js framework.
