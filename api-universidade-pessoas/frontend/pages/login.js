import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao fazer login';
      setError(message);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Entrar na SeguraNet</h2>
      <p>Acesse com suas credenciais para ver o painel.</p>
      {error && <div className="feedback error">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <button type="submit">Entrar</button>
        <p>
          Não tem conta? <a href="/register">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}
