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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pin) {
      setError('Digite o PIN.');
      setSuccess('');
      return;
    }

    if (pin !== '638700') {
      setError('PIN incorreto. Tente novamente.');
      setSuccess('');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('token', 'teste-token');
      localStorage.setItem('usuario', JSON.stringify({ nome: 'Acesso PIN' }));
      setError('');
      setSuccess('Login bem-sucedido!');
      setLoading(false);
      router.push('/Home');
    }, 1000);
  };

  const handleNumberClick = (num) => {
    if (pin.length < 6) setPin(pin + num);
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

      <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white p-4">
        <div className="w-full max-w-sm sm:max-w-md bg-[#2a2a2a] rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 z-10 border border-[#444]">
          <h2 className="text-3xl font-bold text-center text-white">Digite seu PIN</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-400 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <input
              type="password"
              value={pin}
              readOnly
              placeholder="••••••"
              className="w-40 sm:w-52 text-center text-2xl sm:text-3xl tracking-[10px] px-4 py-3 rounded-xl bg-[#333] border border-[#555] text-white focus:outline-none"
            />

            <div className="grid grid-cols-3 gap-4 mt-4">
              {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumberClick(num.toString())}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#444] hover:bg-[#555] text-xl sm:text-2xl font-bold transition"
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                type="button"
                onClick={() => handleNumberClick('0')}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#444] hover:bg-[#555] text-xl sm:text-2xl font-bold transition"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-xl sm:text-2xl font-bold transition"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 rounded-xl font-semibold bg-[#444] hover:bg-[#555] transition text-lg sm:text-xl"
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
