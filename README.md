# Yoliday Project

This repository contains the code for the Yoliday project, which includes a backend API for managing projects and a shopping cart, and a React frontend for interacting with the API.

## Project Structure

The project is organized into the following main directories:

-   `backend`: Contains the Node.js/Express backend application.
-   `src`: Contains the React frontend application.

## Backend

The backend is built with Node.js and Express. It uses TypeScript, Zod for validation, and connects to a MySQL database.

### Features

-   API endpoints for managing projects (CRUD operations).
-   API endpoints for managing a shopping cart.
-   Database schema and migrations for projects and cart.
-   Basic error handling and logging.

### Setup and Running

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Install backend dependencies:

    ```bash
    npm install
    ```

3.  Set up your database:
    *   Ensure you have a MySQL database running.
    *   Create a `.env` file in the `backend` directory based on `.env.example` (if provided) or create one with your database connection details:

        ```env
        DB_HOST=your_database_host
        DB_USER=your_database_user
        DB_PASSWORD=your_database_password
        DB_NAME=your_database_name
        DB_PORT=3306 # Or your MySQL port
        ```
    *   Run database migrations to set up the tables. If you have an `init.ts` script or similar, you can use it:

        ```bash
        npm run migrate # Or the command to run your migrations (check package.json)
        ```
        (If using a manual SQL file, you might need `npx mysql -u your_db_user -p your_db_name < src/db/migrations/your_migration_file.sql`)

4.  Build the TypeScript code:

    ```bash
    npm run build
    ```

5.  Start the backend server:

    ```bash
    npm start
    ```

    The backend should start running, typically on a port specified in your environment variables or code.

## Frontend

The frontend is a React application built with TypeScript.

### Features

-   Displays a list of projects.
-   Allows creating new projects.
-   Includes a shopping cart (Saved items) feature.
-   Search and filter functionality (basic implementation).
-   Responsive layout.

### Setup and Running

1.  Navigate to the project root directory (where `package.json` for the frontend is):

    ```bash
    cd .. # If you are in the backend directory
    # or just ensure you are in the project root
    ```

2.  Install frontend dependencies:

    ```bash
    npm install # Or yarn install
    ```

3.  Configure the API URL:
    *   Create a `.env` file in the project root directory.
    *   Add the backend API URL. If running backend locally, it might be:

        ```env
        REACT_APP_API_URL=http://localhost:your_backend_port
        ```
        If using your deployed backend on Render, use its public URL:

        ```env
        REACT_APP_API_URL=https://your-backend-service.onrender.com
        ```

4.  Start the frontend development server:

    ```bash
    npm start # Or yarn start
    ```

    The frontend application should open in your browser.

## Deployment

-   **Backend:** Can be deployed to platforms like Render ([https://render.com/](https://render.com/)). Remember to configure environment variables for the database connection and potentially automate migrations.
-   **Frontend:** Can be deployed to platforms like Vercel ([https://vercel.com/](https://vercel.com/)). Remember to set the `REACT_APP_API_URL` environment variable to your deployed backend URL.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. 