import { Router } from 'express';
import { pool } from '../db.js';
import { z } from 'zod';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

export const projectsRouter = Router();

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  image_url: z.string().url().optional().transform(val => val === '' ? null : val),
});

interface Project extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

// CREATE - Add a new project
projectsRouter.post('/', async (req, res) => {
  try {
    console.log('Received project data:', req.body);
    const project = ProjectSchema.parse(req.body);
    console.log('Validated project data:', project);
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO projects (title, description, category, author, image_url) VALUES (?, ?, ?, ?, ?)',
      [project.title, project.description, project.category, project.author, project.image_url || null]
    );

    const [newProject] = await pool.execute<Project[]>(
      'SELECT * FROM projects WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newProject[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// READ - Get all projects with pagination
projectsRouter.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [projects] = await pool.execute<Project[]>(
      `SELECT * FROM projects ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    // Get total count for pagination
    const [countResult] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM projects'
    );
    const total = countResult[0].total;

    res.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ - Get a single project by ID
projectsRouter.get('/:id', async (req, res) => {
  try {
    const [projects] = await pool.execute<Project[]>(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(projects[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE - Update a project
projectsRouter.put('/:id', async (req, res) => {
  try {
    const project = ProjectSchema.parse(req.body);
    
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE projects SET title = ?, description = ?, category = ?, author = ?, image_url = ? WHERE id = ?',
      [project.title, project.description, project.category, project.author, project.image_url, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [updatedProject] = await pool.execute<Project[]>(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedProject[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// DELETE - Delete a project
projectsRouter.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM projects WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});