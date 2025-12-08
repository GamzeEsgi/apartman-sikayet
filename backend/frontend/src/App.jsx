/**
 * Apartman Şikayet Yönetim Sistemi - Ana Uygulama Bileşeni
 * 
 * Sidebar entegreli panel yönetimi
 * Rol bazlı görünüm kontrolü
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// Bileşen importları
import Giris from './components/Giris';
import Kayit from './components/Kayit';
import Sidebar from './components/Sidebar';
import AnaSayfa from './components/AnaSayfa';
import SikayetOlustur from './components/SikayetOlustur';
import Sikayetlerim from './components/Sikayetlerim';
import Bildirimler from './components/Bildirimler';
import Profil from './components/Profil';
import YoneticiPanel from './components/YoneticiPanel';
import PersonelPanel from './components/PersonelPanel';

function App() {
  // State yönetimi
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [aktifSayfa, setAktifSayfa] = useState('giris');

  // Token/rol değiştiğinde uygun sayfaya yönlendir
  useEffect(() => {
    if (token && rol) {
      if (rol === 'yonetici') {
        setAktifSayfa('yonetici');
      } else if (rol === 'personel') {
        setAktifSayfa('personel');
      } else {
        setAktifSayfa('anasayfa');
      }
    }
  }, [token, rol]);

  /**
   * Giriş/Kayıt başarılı callback
   */
  const handleGirisBasarili = (tk, r) => {
    localStorage.setItem('token', tk);
    localStorage.setItem('rol', r);
    setToken(tk);
    setRol(r);
  };

  /**
   * Çıkış yapma
   */
  const handleCikis = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setToken(null);
    setRol(null);
    setAktifSayfa('giris');
  };

  /**
   * Sayfa değiştirme
   */
  const sayfaDegistir = (sayfa) => {
    setAktifSayfa(sayfa);
  };

  /**
   * Aktif sayfayı render et
   */
  const renderSayfa = () => {
    // Sakin sayfaları
    if (rol === 'sakin') {
      switch (aktifSayfa) {
        case 'anasayfa':
          return <AnaSayfa token={token} />;
        case 'sikayet':
          return <SikayetOlustur token={token} />;
        case 'sikayetlerim':
          return <Sikayetlerim token={token} />;
        case 'bildirimler':
          return <Bildirimler token={token} />;
        case 'profil':
          return <Profil token={token} />;
        default:
          return <AnaSayfa token={token} />;
      }
    }

    // Personel sayfaları
    if (rol === 'personel') {
      switch (aktifSayfa) {
        case 'personel':
          return <PersonelPanel token={token} aktifSayfa="personel" />;
        case 'gelen-sikayetler':
          return <PersonelPanel token={token} aktifSayfa="gelen-sikayetler" />;
        case 'tamamlanan':
          return <PersonelPanel token={token} aktifSayfa="tamamlanan" />;
        case 'bildirimler':
          return <PersonelPanel token={token} aktifSayfa="bildirimler" />;
        case 'profil':
          return <Profil token={token} />;
        default:
          return <PersonelPanel token={token} aktifSayfa="personel" />;
      }
    }

    // Yönetici sayfaları
    if (rol === 'yonetici') {
      switch (aktifSayfa) {
        case 'yonetici':
          return <YoneticiPanel token={token} aktifSayfa="yonetici" />;
        case 'tum-sikayetler':
          return <YoneticiPanel token={token} aktifSayfa="tum-sikayetler" />;
        case 'bekleyen':
          return <YoneticiPanel token={token} aktifSayfa="bekleyen" />;
        case 'tamamlanan':
          return <YoneticiPanel token={token} aktifSayfa="tamamlanan" />;
        case 'kullanici-yonetimi':
          return <YoneticiPanel token={token} aktifSayfa="kullanici-yonetimi" />;
        case 'personel-yonetimi':
          return <YoneticiPanel token={token} aktifSayfa="personel-yonetimi" />;
        case 'profil':
          return <Profil token={token} />;
        default:
          return <YoneticiPanel token={token} aktifSayfa="yonetici" />;
      }
    }

    return <AnaSayfa token={token} />;
  };

  // Giriş yapmamış kullanıcılar için
  if (!token) {
    return (
      <div className="auth-sayfa">
        <div className="auth-container">
          <div className="auth-logo">
            <span className="logo-icon">🏢</span>
            <h1>Apartman Şikayet Sistemi</h1>
            <p>Sorunlarınızı kolayca bildirin, takip edin</p>
          </div>
          
          {aktifSayfa === 'giris' ? (
            <>
              <Giris onGirisBasarili={handleGirisBasarili} />
              <p className="auth-switch">
                Hesabınız yok mu?{' '}
                <button onClick={() => setAktifSayfa('kayit')}>
                  Kayıt Ol
                </button>
              </p>
            </>
          ) : (
            <>
              <Kayit onKayitBasarili={handleGirisBasarili} />
              <p className="auth-switch">
                Zaten hesabınız var mı?{' '}
                <button onClick={() => setAktifSayfa('giris')}>
                  Giriş Yap
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Giriş yapmış kullanıcılar için dashboard
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar 
        rol={rol}
        aktifSayfa={aktifSayfa}
        sayfaDegistir={sayfaDegistir}
        onCikis={handleCikis}
      />

      {/* Ana İçerik */}
      <main className="dashboard-content">
        {renderSayfa()}
      </main>
    </div>
  );
}

export default App;
