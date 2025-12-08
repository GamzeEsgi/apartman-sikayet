import React, { useState, useEffect } from 'react';
import '../styles/Profil.css';

export default function Profil({ token }) {
  const [profil, setProfil] = useState(null);
  const [yukluyor, setYukluyor] = useState(true);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProfil(data);
    } catch (err) {
      console.error('Profil yüklenemedi');
    } finally {
      setYukluyor(false);
    }
  };

  if (yukluyor) return <div>Yükleniyor...</div>;
  if (!profil) return <div>Profil bulunamadı</div>;

  return (
    <div className="profil-container">
      <h2>Profil Bilgileri</h2>
      <div className="profil-card">
        <p><strong>Ad:</strong> {profil.ad}</p>
        <p><strong>Email:</strong> {profil.email}</p>
        <p><strong>Rol:</strong> {profil.rol}</p>
        <p><strong>Daire:</strong> {profil.daire}</p>
        <p><strong>Telefon:</strong> {profil.telefon}</p>
        <p><strong>Kayıt Tarihi:</strong> {new Date(profil.olusturma_tarihi).toLocaleDateString('tr-TR')}</p>
        {profil.son_giris && (
          <p><strong>Son Giriş:</strong> {new Date(profil.son_giris).toLocaleDateString('tr-TR')}</p>
        )}
      </div>
    </div>
  );
}
