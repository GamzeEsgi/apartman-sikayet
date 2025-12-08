import React, { useState, useEffect } from 'react';
import '../styles/PersonelPanel.css';

export default function PersonelPanel({ token }) {
  const [sikayetler, setSikayetler] = useState([]);
  const [bildirimler, setBildirimler] = useState([]);
  const [seciliSikayet, setSeciliSikayet] = useState(null);
  const [durum, setDurum] = useState('');
  const [not, setNot] = useState('');

  useEffect(() => {
    fetchSikayetler();
    fetchBildirimler();
  }, []);

  const fetchSikayetler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/personel/sikayetlerim', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSikayetler(data);
    } catch (err) {
      console.error('Şikayetler yüklenemedi');
    }
  };

  const fetchBildirimler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/personel/bildirimler', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBildirimler(data);
    } catch (err) {
      console.error('Bildirimler yüklenemedi');
    }
  };

  const handleDurumGuncelle = async () => {
    if (!seciliSikayet || !durum) {
      alert('Lütfen durum seçin');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/personel/durum-guncelle/${seciliSikayet._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ durum, not })
        }
      );

      if (response.ok) {
        alert('Durum başarıyla güncellendi');
        fetchSikayetler();
        setSeciliSikayet(null);
      }
    } catch (err) {
      alert('Güncelleme sırasında hata oluştu');
    }
  };

  return (
    <div className="personel-panel">
      <h1>Personel Paneli</h1>

      {/* Bildirimler */}
      <div className="bildirimler-section">
        <h2>Bildirimler ({bildirimler.filter(b => !b.okunanmis).length})</h2>
        <div className="bildirimler-list">
          {bildirimler.map(b => (
            <div key={b._id} className={`bildirim ${b.okunanmis ? 'okundu' : 'okunmamis'}`}>
              <h4>{b.baslik}</h4>
              <p>{b.mesaj}</p>
              <small>{new Date(b.olusturma_tarihi).toLocaleDateString('tr-TR')}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Şikayet Listesi */}
      <div className="sikayetler-section">
        <h2>Atanan Şikayetler</h2>
        <table className="sikayet-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Şikayetçi</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th>Tarih</th>
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
                <td>{new Date(sikayet.olusturma_tarihi).toLocaleDateString('tr-TR')}</td>
                <td>
                  <button onClick={() => {
                    setSeciliSikayet(sikayet);
                    setDurum(sikayet.durum);
                    setNot(sikayet.not || '');
                  }}>
                    Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Şikayet Detay ve Durum Güncelle */}
      {seciliSikayet && (
        <div className="modal-overlay" onClick={() => setSeciliSikayet(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{seciliSikayet.baslik}</h3>
            <p><strong>Şikayetçi:</strong> {seciliSikayet.sakin_id?.ad}</p>
            <p><strong>Daire:</strong> {seciliSikayet.sakin_id?.daire}</p>
            <p><strong>Telefon:</strong> {seciliSikayet.sakin_id?.telefon}</p>
            <p><strong>Açıklama:</strong> {seciliSikayet.aciklama}</p>
            {seciliSikayet.fotoğraf && (
              <img src={seciliSikayet.fotoğraf} alt="Şikayet" style={{ maxWidth: '200px' }} />
            )}

            <div className="durum-guncelle">
              <h4>Durum Güncelle</h4>
              <select value={durum} onChange={(e) => setDurum(e.target.value)}>
                <option value="atandi">Atandı</option>
                <option value="cozuluyor">Çözülüyor</option>
                <option value="cozuldu">Çözüldü</option>
                <option value="reddedildi">Reddedildi</option>
              </select>

              <textarea
                value={not}
                onChange={(e) => setNot(e.target.value)}
                placeholder="Çözüm notu veya gerekçe yazın"
                rows="4"
              />

              <button onClick={handleDurumGuncelle}>Güncelle</button>
            </div>

            <button onClick={() => setSeciliSikayet(null)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
