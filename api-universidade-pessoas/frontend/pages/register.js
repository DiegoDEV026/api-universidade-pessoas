import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      localStorage.setItem('token', response.data.token);
      setSuccess('Cadastro concluído! Redirecionando...');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao cadastrar';
      setError(message);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Criar conta</h2>
      <p>Cadastre-se para acessar o painel SeguraNet.</p>
      {error && <div className="feedback error">{error}</div>}
      {success && <div className="feedback success">{success}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria Souza"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@exemplo.com"
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
        <button type="submit">Criar conta e acessar</button>
        <p>
          Já tem acesso? <a href="/login">Entre</a>
        </p>
      </form>
    </div>
  );
}
