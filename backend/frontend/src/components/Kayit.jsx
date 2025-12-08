import React, { useState } from 'react';
import API_URL from '../config';

/**
 * Kayit Bileşeni
 * Yeni kullanıcıların sisteme kayıt olmasını sağlar
 * Sakin veya Personel olarak kayıt olunabilir
 * @param {Function} onKayitBasarili - Kayıt başarılı olduğunda çağrılacak callback fonksiyonu
 */
export default function Kayit({ onKayitBasarili }) {
  // Form state değişkenleri
  const [ad, setAd] = useState('');              // Kullanıcı adı soyadı
  const [email, setEmail] = useState('');        // Email adresi
  const [sifre, setSifre] = useState('');        // Şifre
  const [blok, setBlok] = useState('A');         // Blok (A, B, C vb.)
  const [kat, setKat] = useState('1');           // Kat numarası
  const [daire, setDaire] = useState('');        // Daire numarası
  const [telefon, setTelefon] = useState('');    // Telefon numarası (opsiyonel)
  const [rol, setRol] = useState('sakin');       // Kullanıcı rolü (sakin/personel)
  const [hata, setHata] = useState('');          // Hata mesajı
  const [loading, setLoading] = useState(false); // Yükleniyor durumu

  /**
   * Kayıt formunu submit ettiğinde çalışan fonksiyon
   * Backend API'ye POST isteği gönderir
   */
  const handleKayit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHata('');

    try {
      // Backend API'ye kayıt isteği gönder
      const response = await fetch(`${API_URL}/api/auth/kayit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad, email, sifre, blok, kat, daire, telefon, rol })
      });

      const data = await response.json();

      if (response.ok) {
        // Kayıt başarılı - token ve kullanıcı rolünü üst bileşene gönder
        // DÜZELTME: data.rol -> data.kullanici.rol olarak değiştirildi
        onKayitBasarili(data.token, data.kullanici.rol);
      } else {
        // Backend'den gelen hata mesajını göster
        setHata(data.mesaj || 'Kayıt başarısız');
      }
    } catch (err) {
      // Ağ hatası veya sunucu erişim sorunu
      setHata('Sunucuya bağlanılamadı. Backend sunucusunun çalıştığından emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleKayit}>
        <h2>Kayıt Ol</h2>
        {hata && <p className="error-message">{hata}</p>}
        <input
          type="text"
          placeholder="Adınız"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          required
        />
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Blok (A, B...)"
            value={blok}
            onChange={(e) => setBlok(e.target.value)}
          />
          <input
            type="text"
            placeholder="Kat"
            value={kat}
            onChange={(e) => setKat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Daire No"
            value={daire}
            onChange={(e) => setDaire(e.target.value)}
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Telefon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="sakin">Apartman Sakini</option>
          <option value="personel">Teknik Personel</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
}
