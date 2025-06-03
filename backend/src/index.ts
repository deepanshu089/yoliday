import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectsRouter } from './routes/projects.js';
import { cartRouter } from './routes/cart.js';
import { initializeDatabase } from './db/init.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    // Register routes
    app.use('/projects', projectsRouter);
    app.use('/cart', cartRouter);

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });