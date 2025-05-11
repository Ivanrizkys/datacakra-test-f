# Article Management Dashboard

## Overview
This is article management dashboard build with React - Typesctript and ShadcnUI. Created to follow the recruitment process at Datacakra.

![Application screenshot](https://res.cloudinary.com/draaoe7rc/image/upload/v1746935782/test/d6d5bc6a-0b6f-4b82-bcba-07000935227c.png)

<div align="center">
<a href="https://peaceful-naiad-36244f.netlify.app/">Live Preview</a>
</div>

## Features

- Login
- Register
- Article List
- Article Detail
- Delete Article (Single & Bulk)
- Update Article

## Requirements

- Biome [see installation guide](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- Node `20.11.1`
- Pnpm `9.12.1`
- \*If you have Prettier or EsLint installed in your code editor, please disable it

## Installation

### Step 1: Clone Repository

```bash
git clone http://codehub.gps.id/webapps/subscription/frontend-new-v2.git
cd frontend-new-v2
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configuration

1. Copy the `.env.example` file to `.env`
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file and adjust it to your environment configuration:
   ```
   VITE_BASE_API_URL=your-base-api-url
   ...
   ```

### Step 4: Run the Application

```bash
pnpm dev
```

The application will run at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # UI component in aplication
│   ├── ui/            # The most basic and reusable UI component installed from ShadcnUI
│   ├── common/        # A composite component made up of ui or other components
│   ├── layout/        # A component that manages the overall structure of the page UI
├── config/            # Library configuration
├── global/            # Global state
├── hooks/             # Custom hooks
├── libs/              # Utilities, functions, or modules
├── pages/             # Application page
├── providers/         # React context providers or third-party providers
├── routes/            # Application routing management
├── services/          # API service
├── test/              # Global testing configurations 
├── types/             # Type declarations
```

## Test

This project using vitest and RTL to testing purpose. You can run test file using `pnpm test` or `pnpm test:ui`
