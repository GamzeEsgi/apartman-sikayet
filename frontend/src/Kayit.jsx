import React, { useState } from 'react';
import '../styles/Auth.css';

export default function Kayit({ setToken, setRol }) {
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    sifre: '',
    daire: '',
    telefon: ''
  });
  const [hata, setHata] = useState('');
  const [yukluyor, setYukluyor] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKayit = async (e) => {
    e.preventDefault();
    setYukluyor(true);
    setHata('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
        <h2>Kayıt Ol</h2>
        {hata && <div className="error-message">{hata}</div>}
        <form onSubmit={handleKayit}>
          <input
            type="text"
            name="ad"
            placeholder="Ad Soyad"
            value={formData.ad}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="sifre"
            placeholder="Şifre"
            value={formData.sifre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="daire"
            placeholder="Daire Numarası (ör: A-101)"
            value={formData.daire}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefon"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
          <button type="submit" disabled={yukluyor}>
            {yukluyor ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}
