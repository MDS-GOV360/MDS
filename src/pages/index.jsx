'use client'; // ← PRIMEIRA LINHA, sempre no topo

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthRedirect from '../hooks/useAuthRedirect';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useAuthRedirect();

  // Registrar o service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado!'))
        .catch(err => console.error('Falha ao registrar SW:', err));
    }
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 6) {
        validarPin(newPin);
      }
    }
  };

  const validarPin = (valor) => {
    if (valor !== '638700') {
      setError('PIN incorreto.');
      setSuccess('');
      setTimeout(() => setError(''), 1500);
      setPin('');
      return;
    }

    setLoading(true);
    setSuccess('Acesso liberado!');

    setTimeout(() => {
      localStorage.setItem('token', 'teste-token');
      localStorage.setItem('usuario', JSON.stringify({ nome: 'Acesso PIN' }));
      router.push('/Home');
    }, 800);
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <>
      <Head>
        <title>MDS - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1D1D1D" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="icon-192x192.png" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1D1D1D] text-white px-4 relative overflow-hidden">
        {/* Fundo com leve brilho */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1d] to-[#2a2a2a] opacity-90" />

        <div className="relative w-full max-w-[340px] bg-[#2a2a2a]/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col gap-5 border border-[#3a3a3a] z-10">
          <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-wide">
            Digite seu PIN
          </h2>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {success && <p className="text-green-400 text-center text-sm">{success}</p>}

          <div className="flex justify-center">
            <input
              type="password"
              value={pin}
              readOnly
              placeholder="••••••"
              className="w-40 text-center text-3xl tracking-[10px] px-3 py-2 rounded-xl bg-[#333] border border-[#555] text-white focus:outline-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 justify-center mt-4">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num.toString())}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[#3b3b3b] hover:bg-[#555] text-xl font-semibold transition-all duration-150 active:scale-95 shadow-md"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-[#3b3b3b] hover:bg-[#555] text-xl font-semibold transition-all duration-150 active:scale-95 shadow-md"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-xl font-semibold transition-all duration-150 active:scale-95 shadow-md"
            >
              ⌫
            </button>
          </div>

          {loading && (
            <p className="text-center text-gray-400 text-sm mt-2 animate-pulse">
              Carregando...
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-6">© 2025 MDS</p>
      </div>
    </>
  );
}
