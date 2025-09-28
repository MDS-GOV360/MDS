'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/router';
import useAuthRedirect from '../hooks/useAuthRedirect';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('24250@Ln');
  const [showPassword, setShowPassword] = useState(false);
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
    if (!email || !password) {
      setError('Preencha todos os campos obrigatórios.');
      setSuccess('');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('token', 'teste-token');
      localStorage.setItem('usuario', JSON.stringify({ nome: email }));
      setError('');
      setSuccess('Login bem-sucedido!');
      setLoading(false);
      router.push('/Home');
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>MDS - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2c2c2c" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="icon-192x192.png
" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-[#2c2c2c] text-white p-4">
        <div className="w-full max-w-md bg-[#3a3a3a] rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 z-10 border border-[#555]">
          <h2 className="text-3xl font-bold text-center text-white">Bem-vinda ao MDS</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-400 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-200 text-sm mb-1 block">Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full px-4 py-3 rounded-xl bg-[#4a4a4a] border border-[#666] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-200 text-sm mb-1 block">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 rounded-xl bg-[#4a4a4a] border border-[#666] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-[#555555] hover:bg-[#666666] transition"
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-gray-300 text-sm text-center">Novo por aqui?</p>
            <a
              href="/cadastro"
              className="w-full text-center py-3 rounded-xl font-semibold bg-[#555555] hover:bg-[#666666] transition"
            >
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
