import React, { useState } from 'react';
import '../styles/Auth.css';

export default function Giris({ setToken, setRol }) {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [yukluyor, setYukluyor] = useState(false);

  const handleGiris = async (e) => {
    e.preventDefault();
    setYukluyor(true);
    setHata('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sifre })
      });

      const data = await response.json();

      if (!response.ok) {
        setHata(data.mesaj);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.kullanici.rol);
      setToken(data.token);
      setRol(data.kullanici.rol);
    } catch (err) {
      setHata('Bağlantı hatası');
    } finally {
      setYukluyor(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Giriş Yap</h2>
        {hata && <div className="error-message">{hata}</div>}
        <form onSubmit={handleGiris}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
          />
          <button type="submit" disabled={yukluyor}>
            {yukluyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
