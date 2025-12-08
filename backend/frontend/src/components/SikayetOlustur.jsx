import React, { useState } from 'react';
import API_URL from '../config';

export default function SikayetOlustur({ token }) {
  const [kategoriler, setKategoriler] = useState([]);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori_id, setKategori_id] = useState('');
  const [oncelik, setOncelik] = useState('orta');
  const [foto, setFoto] = useState('');
  const [fotoPreview, setFotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [mesaj, setMesaj] = useState('');

  React.useEffect(() => {
    fetch(`${API_URL}/api/sikayet/kategoriler`)
      .then(r => r.json())
      .then(data => setKategoriler(data))
      .catch(err => console.error(err));
  }, []);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOlustur = async (e) => {
    e.preventDefault();
    if (!baslik || !aciklama || !kategori_id) {
      setMesaj('Tüm alanlar zorunludur');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sikayet/olustur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          baslik,
          aciklama,
          kategori_id: parseInt(kategori_id),
          oncelik,
          fotoğraf: foto
        })
      });

      if (response.ok) {
        setMesaj('Şikayet başarıyla oluşturuldu!');
        setBaslik('');
        setAciklama('');
        setKategori_id('');
        setOncelik('orta');
        setFoto('');
        setFotoPreview('');
      } else {
        setMesaj('Şikayet oluşturulurken hata oluştu');
      }
    } catch (err) {
      setMesaj('Sunucuya bağlanılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sikayet-form">
      <h2 className="form-baslik">📝 Yeni Şikayet Oluştur</h2>
      {mesaj && <p className={mesaj.includes('başarıyla') ? 'success-message' : 'error-message'}>{mesaj}</p>}
      <form onSubmit={handleOlustur}>
        <div className="form-group">
          <label>📁 Kategori</label>
          <select value={kategori_id} onChange={(e) => setKategori_id(e.target.value)} required>
            <option value="">Kategori Seç</option>
            {kategoriler.map(k => <option key={k.id} value={k.id}>{k.ad}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>✏️ Başlık</label>
          <input
            type="text"
            placeholder="Şikayet başlığını girin"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>📄 Açıklama</label>
          <textarea
            placeholder="Şikayetinizi detaylı açıklayın..."
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div className="form-group">
          <label>⚡ Öncelik</label>
          <select value={oncelik} onChange={(e) => setOncelik(e.target.value)}>
            <option value="dusuk">🟢 Düşük</option>
            <option value="orta">🟡 Orta</option>
            <option value="yuksek">🔴 Yüksek</option>
          </select>
        </div>
        <div className="form-group">
          <label>📷 Fotoğraf (Opsiyonel)</label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          {fotoPreview && <img src={fotoPreview} alt="preview" className="image-preview" />}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '⏳ Gönderiliyor...' : '📤 Şikayet Oluştur'}
        </button>
      </form>
    </div>
  );
}
