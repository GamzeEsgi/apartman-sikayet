import React, { useState, useEffect } from 'react';
import '../styles/YoneticiPanel.css';

export default function YoneticiPanel({ token }) {
  const [sikayetler, setSikayetler] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const [analiz, setAnaliz] = useState(null);
  const [seciliSikayet, setSeciliSikayet] = useState(null);
  const [durum, setDurum] = useState('');
  const [birim, setBirim] = useState('');
  const [personel, setPersonel] = useState('');

  useEffect(() => {
    fetchSikayetler();
    fetchPersoneller();
    fetchAnaliz();
  }, []);

  const fetchSikayetler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/yonetici/sikayetler', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSikayetler(data);
    } catch (err) {
      console.error('Şikayetler yüklenemedi');
    }
  };

  const fetchPersoneller = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/yonetici/personeller', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPersoneller(data);
    } catch (err) {
      console.error('Personeller yüklenemedi');
    }
  };

  const fetchAnaliz = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/yonetici/analiz', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnaliz(data);
    } catch (err) {
      console.error('Analiz yüklenemedi');
    }
  };

  const handleAta = async () => {
    if (!seciliSikayet || !personel || !birim) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/yonetici/ata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sikayet_id: seciliSikayet._id,
          personel_id: personel,
          birim: birim
        })
      });

      if (response.ok) {
        alert('Şikayet başarıyla atandı');
        fetchSikayetler();
        setSeciliSikayet(null);
      }
    } catch (err) {
      alert('Atanırken hata oluştu');
    }
  };

  return (
    <div className="yonetici-panel">
      <h1>Yönetici Paneli</h1>

      {/* Analiz Dashboard */}
      {analiz && (
        <div className="dashboard">
          <div className="stat-card">
            <h3>Toplam Şikayet</h3>
            <p className="stat-value">{analiz.istatistik.toplam}</p>
          </div>
          <div className="stat-card">
            <h3>Çözülen</h3>
            <p className="stat-value">{analiz.istatistik.cozulen}</p>
          </div>
          <div className="stat-card">
            <h3>Çözülüyor</h3>
            <p className="stat-value">{analiz.istatistik.cozuluyor}</p>
          </div>
          <div className="stat-card">
            <h3>Yeni</h3>
            <p className="stat-value">{analiz.istatistik.yeni}</p>
          </div>
          <div className="stat-card">
            <h3>Çözülme Oranı</h3>
            <p className="stat-value">{analiz.istatistik.cozulmeOrani}</p>
          </div>
        </div>
      )}

      {/* Şikayet Listesi */}
      <div className="sikayetler-section">
        <h2>Şikayet Yönetimi</h2>
        <table className="sikayet-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Şikayetçi</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th>Öncelik</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {sikayetler.map(sikayet => (
              <tr key={sikayet._id}>
                <td>{sikayet.baslik}</td>
                <td>{sikayet.sakin_id?.ad}</td>
                <td>{sikayet.kategori_id?.ad}</td>
                <td>
                  <span className={`status ${sikayet.durum}`}>
                    {sikayet.durum}
                  </span>
                </td>
                <td>{sikayet.oncelik}</td>
                <td>
                  <button onClick={() => setSeciliSikayet(sikayet)}>
                    Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Şikayet Detay ve Atama */}
      {seciliSikayet && (
        <div className="modal-overlay" onClick={() => setSeciliSikayet(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{seciliSikayet.baslik}</h3>
            <p><strong>Şikayetçi:</strong> {seciliSikayet.sakin_id?.ad}</p>
            <p><strong>Daire:</strong> {seciliSikayet.sakin_id?.daire}</p>
            <p><strong>Telefon:</strong> {seciliSikayet.sakin_id?.telefon}</p>
            <p><strong>Açıklama:</strong> {seciliSikayet.aciklama}</p>
            {seciliSikayet.fotoğraf && (
              <img src={seciliSikayet.fotoğraf} alt="Şikayet fotoğrafı" style={{ maxWidth: '200px' }} />
            )}

            {seciliSikayet.durum === 'yeni' && (
              <div className="atama-form">
                <h4>Şikayet Ata</h4>
                <select value={birim} onChange={(e) => setBirim(e.target.value)}>
                  <option value="">Birim Seçin</option>
                  <option value="Bakım">Bakım</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Su">Su</option>
                  <option value="Güvenlik">Güvenlik</option>
                </select>

                <select value={personel} onChange={(e) => setPersonel(e.target.value)}>
                  <option value="">Personel Seçin</option>
                  {personeller.map(p => (
                    <option key={p._id} value={p._id}>{p.ad} ({p.email})</option>
                  ))}
                </select>

                <button onClick={handleAta}>Ata</button>
              </div>
            )}

            <button onClick={() => setSeciliSikayet(null)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
