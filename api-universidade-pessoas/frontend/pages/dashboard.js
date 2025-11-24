import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    axios
      .get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        router.replace('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="header">
        <div>
          <h2>Dashboard</h2>
          <p>Bem-vindo de volta, {user?.name || 'carregando...'}.</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {error && <div className="feedback error">{error}</div>}
      <div className="card-grid">
        <div className="card">
          <h3>Segurança em dia</h3>
          <p>Monitoramento ativo das suas rotas protegidas.</p>
        </div>
        <div className="card">
          <h3>Token salvo</h3>
          <p>Seu token JWT está persistido no navegador enquanto estiver autenticado.</p>
        </div>
        <div className="card">
          <h3>Autenticação</h3>
          <p>Validação automática ao entrar no dashboard garante acesso seguro.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
