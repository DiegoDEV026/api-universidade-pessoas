import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

async function ensureUserTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'changeme', {
    expiresIn: '7d'
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    await ensureUserTable();

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    const user = { id: result.insertId, name, email };
    const token = generateToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('Erro no registro', err);
    return res.status(500).json({ message: 'Erro interno ao registrar' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    await ensureUserTable();
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro no login', err);
    return res.status(500).json({ message: 'Erro interno ao fazer login' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro ao obter usuário', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
});

export default router;
