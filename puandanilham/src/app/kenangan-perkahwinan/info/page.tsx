'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';

export default function InfoPage() {
  const router = useRouter();
  const { senderName, setSenderName } = usePhotobooth();
  const [name, setName] = useState(senderName);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (name.trim().length < 2) {
      setError('Nama harus minimal 2 karakter.');
      return;
    }
    setSenderName(name.trim());
    router.push('/kenangan-perkahwinan/pilih-bingkai');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-serif text-center mb-6">Siapa Nama Anda?</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <label className="block text-sm font-medium mb-2" htmlFor="name">Nama Panggilan</label>
        <input 
          id="name"
          type="text" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }} 
          placeholder="Tulis nama anda..." 
          className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button 
          onClick={handleNext}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-lg transition-colors mt-4"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
