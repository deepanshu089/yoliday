# Yoliday Project
![image](https://github.com/user-attachments/assets/bd68409c-6901-4984-baf2-869e68e7fbe9)


This repository contains the code for the Yoliday project.

## Features

-   Backend API for managing projects (CRUD operations).
-   Backend API for managing a shopping cart.
-   MySQL database schema with migrations.
-   Basic backend error handling and logging.
-   React frontend for displaying and creating projects.
-   Frontend shopping cart (Saved items) feature.
-   Basic frontend search and filter functionality.
-   Responsive frontend layout.

## Project Structure

The project is organized into the following main directories:

-   `backend`: Contains the Node.js/Express backend application.
-   `src`: Contains the React frontend application.

## Steps to Reproduce (Setup and Running)

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/deepanshu089/yoliday.git
    cd yoliday
    ```

2.  **Backend Setup:**

    a.  Navigate to the `backend` directory:

        ```bash
        cd backend
        ```

    b.  Install backend dependencies:

        ```bash
        npm install
        ```

    c.  Set up your database:
        *   Ensure you have a MySQL database running.
        *   Create a `.env` file in the `backend` directory with your database connection details:

            ```env
            DB_HOST=your_database_host
            DB_USER=your_database_user
            DB_PASSWORD=your_database_password
            DB_NAME=your_database_name
            DB_PORT=3306 # Or your MySQL port
            ```
        *   Run database migrations to set up the tables:

            ```bash
            npm run migrate # Or the command to run your migrations (check package.json)
            ```

    d.  Build the TypeScript code:

        ```bash
        npm run build
        ```

    e.  Start the backend server:

        ```bash
        npm start
        ```

        The backend should start running, typically on port 3000 (or specified in your .env).

3.  **Frontend Setup:**

    a.  Navigate back to the project root directory:

        ```bash
        cd ..
        ```

    b.  Install frontend dependencies:

        ```bash
        npm install
        ```

    c.  Configure the API URL:
        *   Create a `.env` file in the project root directory.
        *   Add the backend API URL. If running backend locally:

            ```env
            VITE_API_URL=http://localhost:your_backend_port
            ```

4.  **Start the Frontend:**

    ```bash
    npm start
    ```

    The frontend application should open in your browser.

## Hosted On

This project can be deployed to various hosting platforms:

-   **Backend:** Can be deployed to platforms like Render ([https://render.com/](https://render.com/)) or Heroku ([https://www.heroku.com/](https://www.heroku.com/)). Ensure environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT) are configured and migrations are run on the hosting platform.
-   **Frontend:** Can be deployed to platforms like Vercel ([https://vercel.com/](https://vercel.com/)). Configure the `VITE_API_URL` environment variable on Vercel to point to your deployed backend URL.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. 
