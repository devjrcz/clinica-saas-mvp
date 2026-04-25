'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">Total Atendimentos: 0</div>
        <div className="bg-white p-4 rounded shadow">Faturamento: R$ 0</div>
        <div className="bg-white p-4 rounded shadow">Pacientes sem Retorno: 0</div>
        <div className="bg-white p-4 rounded shadow">Taxa Comparecimento: 0%</div>
      </div>
      <div className="mt-8">
        <button onClick={() => router.push('/pacientes')} className="bg-blue-500 text-white p-2 rounded mr-4">Pacientes</button>
        <button onClick={() => router.push('/agenda')} className="bg-blue-500 text-white p-2 rounded">Agenda</button>
      </div>
    </div>
  );
}