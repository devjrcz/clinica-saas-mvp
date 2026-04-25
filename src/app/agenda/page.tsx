'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Consulta {
  id: string;
  pacienteId: string;
  data: string;
  hora: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
}

export default function Agenda() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadConsultas(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadConsultas = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, 'clinicas', uid, 'consultas'));
    const list: Consulta[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Consulta);
    });
    setConsultas(list);
  };

  const addConsulta = async () => {
    if (!user) return;
    await addDoc(collection(db, 'clinicas', user.uid, 'consultas'), {
      pacienteId,
      data,
      hora,
      status: 'pendente',
    });
    setPacienteId('');
    setData('');
    setHora('');
    loadConsultas(user.uid);
  };

  const confirmarConsulta = async (id: string) => {
    if (!user) return;
    const docRef = doc(db, 'clinicas', user.uid, 'consultas', id);
    await updateDoc(docRef, { status: 'confirmado' });
    loadConsultas(user.uid);
    // Simulação de envio WhatsApp
    alert('Mensagem WhatsApp enviada: "Olá, você tem consulta amanhã às 14h. Confirma presença?"');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl mb-4">Agenda</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="text"
          placeholder="ID do Paciente"
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <button onClick={addConsulta} className="bg-green-500 text-white p-2 rounded">Agendar Consulta</button>
      </div>
      <ul>
        {consultas.map((c) => (
          <li key={c.id} className="bg-white p-4 rounded shadow mb-2">
            <p>Paciente ID: {c.pacienteId}</p>
            <p>Data: {c.data} Hora: {c.hora}</p>
            <p>Status: {c.status}</p>
            {c.status === 'pendente' && (
              <button onClick={() => confirmarConsulta(c.id)} className="bg-blue-500 text-white p-2 rounded">Confirmar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}