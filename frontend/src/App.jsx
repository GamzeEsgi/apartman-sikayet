import React, { useState, useEffect } from 'react';
import './App.css';
import Giris from './Giris';
import Kayit from './Kayit';
import SikayetOlustur from './SikayetOlustur';
import YoneticiPanel from './YoneticiPanel';
import PersonelPanel from './PersonelPanel';
import Profil from './Profil';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [goruntu, setGorunti] = useState('giris');

  useEffect(() => {
    if (token && rol) {
      if (rol === 'yonetici') {
        setGorunti('yonetici');
      } else if (rol === 'personel') {
        setGorunti('personel');
      } else {
        setGorunti('sikayet');
      }
    }
  }, [token, rol]);

  const handleCikis = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setToken(null);
    setRol(null);
    setGorunti('giris');
  };

  if (!token) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1>Apartman Şikayet Sistemi</h1>
          <div className="nav-buttons">
            <button
              className={goruntu === 'giris' ? 'active' : ''}
              onClick={() => setGorunti('giris')}
            >
              Giriş
            </button>
            <button
              className={goruntu === 'kayit' ? 'active' : ''}
              onClick={() => setGorunti('kayit')}
            >
              Kayıt
            </button>
          </div>
        </nav>

        {goruntu === 'giris' && <Giris setToken={setToken} setRol={setRol} />}
        {goruntu === 'kayit' && <Kayit setToken={setToken} setRol={setRol} />}
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Apartman Şikayet Sistemi</h1>
        <div className="nav-buttons">
          {rol === 'sakin' && (
            <>
              <button
                className={goruntu === 'sikayet' ? 'active' : ''}
                onClick={() => setGorunti('sikayet')}
              >
                Şikayet Oluştur
              </button>
              <button
                className={goruntu === 'sikayetlerim' ? 'active' : ''}
                onClick={() => setGorunti('sikayetlerim')}
              >
                Şikayetlerim
              </button>
            </>
          )}
          {rol === 'yonetici' && (
            <button
              className={goruntu === 'yonetici' ? 'active' : ''}
              onClick={() => setGorunti('yonetici')}
            >
              Yönetici Paneli
            </button>
          )}
          {rol === 'personel' && (
            <button
              className={goruntu === 'personel' ? 'active' : ''}
              onClick={() => setGorunti('personel')}
            >
              Personel Paneli
            </button>
          )}
          <button
            className={goruntu === 'profil' ? 'active' : ''}
            onClick={() => setGorunti('profil')}
          >
            Profilim
          </button>
          <button className="logout" onClick={handleCikis}>Çıkış</button>
        </div>
      </nav>

      {rol === 'sakin' && goruntu === 'sikayet' && <SikayetOlustur token={token} />}
      {rol === 'yonetici' && goruntu === 'yonetici' && <YoneticiPanel token={token} />}
      {rol === 'personel' && goruntu === 'personel' && <PersonelPanel token={token} />}
      {goruntu === 'profil' && <Profil token={token} />}
    </div>
  );
}

export default App;
