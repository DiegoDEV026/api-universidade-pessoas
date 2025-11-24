import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardLayout({ children, onLogout }) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.replace('/login');
      });
  }, [router]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <h1>SeguraNet</h1>
          <p>Área do cliente</p>
        </div>
        <button onClick={onLogout}>Sair</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
