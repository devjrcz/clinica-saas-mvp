'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  ultimaConsulta: string;
  observacoes: string;
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadPacientes(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadPacientes = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, 'clinicas', uid, 'pacientes'));
    const list: Paciente[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Paciente);
    });
    setPacientes(list);
  };

  const addPaciente = async () => {
    if (!user) return;
    await addDoc(collection(db, 'clinicas', user.uid, 'pacientes'), {
      nome,
      telefone,
      ultimaConsulta: new Date().toISOString(),
      observacoes,
    });
    setNome('');
    setTelefone('');
    setObservacoes('');
    loadPacientes(user.uid);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl mb-4">Pacientes</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <button onClick={addPaciente} className="bg-green-500 text-white p-2 rounded">Adicionar Paciente</button>
      </div>
      <ul>
        {pacientes.map((p) => (
          <li key={p.id} className="bg-white p-4 rounded shadow mb-2">
            <p>Nome: {p.nome}</p>
            <p>Telefone: {p.telefone}</p>
            <p>Última Consulta: {new Date(p.ultimaConsulta).toLocaleDateString()}</p>
            <p>Observações: {p.observacoes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}