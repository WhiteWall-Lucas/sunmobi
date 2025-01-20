# API Server Template

This repository serves as a template for developing and deploying services at White Wall. It provides a standardized structure and tooling to ensure consistency, scalability, and maintainability across all service projects. This template is designed to integrate seamlessly with your existing infrastructure and development workflows.

## Overview

This template includes configurations and best practices for:

- **TypeScript**: Ensuring type safety and modern JavaScript features.
- **Firebase Functions**: For serverless functions that scale automatically.
- **Blip SDK**: Integration with Blip platform services.
- **Biome**: A unified tool for code formatting, linting, and more.
- **Continuous Integration/Continuous Deployment (CI/CD)**: Preconfigured with GitHub Actions.

## Project Structure

The project structure is organized to facilitate development and deployment:

```
.
├── .github
│   └── workflows
│       └── pr.yml               # CI/CD pipeline configuration for pull requests
├── .vscode                      # Editor-specific settings for consistency
│   ├── extensions.json          # Recommended extensions
│   ├── launch.json              # Debugger configurations
│   └── settings.json            # Workspace settings
├── lib                          # Compiled JavaScript files
├── node_modules                 # Dependencies managed by npm
├── src                          # Source code
│   ├── controllers
│   │   └── user.ts              # Example controller for user operations
│   ├── middlewares              # Custom middlewares
│   └── utils
│       └── route                # Utility functions for routing
├── .env                         # Environment variable definitions
├── .firebaserc                  # Firebase project settings
├── .gitignore                   # Files and directories to be ignored
├── biome.json                   # Biome configuration for linting and formatting
├── firebase.json                # Firebase service configuration
├── package-lock.json            # Exact versions of installed dependencies
├── package.json                 # Project metadata and scripts
├── README.md                    # Project documentation
├── tsconfig.json                # TypeScript compiler options
└── index.ts                     # Main entry point for the service
```

## Getting Started

### Prerequisites

Ensure that your development environment includes:

- **Node.js v22.x.x** or later
- **npm v8.x.x** or later
- **Firebase CLI**
- **TypeScript**

### Installation

1. **Clone this template:**

   ```sh
   git clone https://github.com/whitewall-clients/server-template.git
   cd server-template
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Environment Setup:**

    Use `.env` to configure the necessary environment variables for Blip SDK, etc.

4. **Apply customizations**

### Customization

1. **Update Service Name:**

   - Replace all instances of `example-client` with the actual service name in the code.

2. **Configure Firebase:**

   - Update `.firebaserc` and `firebase.json` to point to the correct Firebase project.

3. **Modify Business Logic:**

   - Use the `src/controllers` directory to create your API-facing controllers and `src/middlewares` for middlewares.
   - Feel free to also create utility functions, services, etc. Depending on what kind of architecture is more suitable for the project.

4. **Update Dependencies:**

   - If needed, add or remove dependencies in `package.json` and ensure to run `npm install` after changes.

## Usage

### Development

Use the following command to start the development environment:

```sh
npm start
```

This will:

- Kill any processes occupying critical ports.
- Compile TypeScript files in watch mode.
- Start the Firebase emulators for functions and hosting with debugging enabled. Use the port `3000` to send the requests.

### Build

To generate the production-ready build:

```sh
npm run build
```

### Deployment

Deploy the service to Firebase:

```sh
npm run deploy
```

### Logs

Monitor the service logs using:

```sh
npm run logs
```

### Code Quality

- **Linting:** Ensure code quality and consistency by running:

  ```sh
  npm run lint
  ```