import { Router } from 'express';
import { pool } from '../db.js';
import { z } from 'zod';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const cartRouter = Router();

const CartItemSchema = z.object({
  project_id: z.number().int().positive(),
});

interface CartItem extends RowDataPacket {
  id: number;
  project_id: number;
  created_at: Date;
}

// Add project to cart
cartRouter.post('/', async (req, res) => {
  try {
    const cartItem = CartItemSchema.parse(req.body);
    
    // Check if project exists
    const [projects] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM projects WHERE id = ?',
      [cartItem.project_id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add to cart
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO cart (project_id) VALUES (?)',
      [cartItem.project_id]
    );

    const [newCartItem] = await pool.execute<CartItem[]>(
      'SELECT * FROM cart WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newCartItem[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get cart items with project details
cartRouter.get('/', async (req, res) => {
  try {
    const [cartItems] = await pool.execute<RowDataPacket[]>(
      `SELECT c.*, p.title, p.description, p.category, p.author, p.image_url 
       FROM cart c 
       JOIN projects p ON c.project_id = p.id 
       ORDER BY c.created_at DESC`
    );

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Remove item from cart
cartRouter.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM cart WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});