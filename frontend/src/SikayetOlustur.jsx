import React, { useState, useEffect } from 'react';
import '../styles/SikayetOlustur.css';

export default function SikayetOlustur({ token }) {
  const [kategoriler, setKategoriler] = useState([]);
  const [formData, setFormData] = useState({
    kategori_id: '',
    baslik: '',
    aciklama: '',
    oncelik: 'orta',
    fotoğraf: ''
  });
  const [yukluyor, setYukluyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basarı, setBasarı] = useState('');

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sikayet/kategoriler');
      const data = await response.json();
      setKategoriler(data);
    } catch (err) {
      setHata('Kategoriler yüklenemedi');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          fotoğraf: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setYukluyor(true);
    setHata('');
    setBasarı('');

    try {
      const response = await fetch('http://localhost:5000/api/sikayet/olustur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setHata(data.mesaj);
        return;
      }

      setBasarı('Şikayet başarıyla oluşturuldu!');
      setFormData({
        kategori_id: '',
        baslik: '',
        aciklama: '',
        oncelik: 'orta',
        fotoğraf: ''
      });
    } catch (err) {
      setHata('Şikayet gönderililemedi');
    } finally {
      setYukluyor(false);
    }
  };

  return (
    <div className="sikayet-container">
      <h2>Yeni Şikayet Oluştur</h2>
      {hata && <div className="error-message">{hata}</div>}
      {basarı && <div className="success-message">{basarı}</div>}

      <form onSubmit={handleSubmit} className="sikayet-form">
        <div className="form-group">
          <label>Kategori *</label>
          <select
            name="kategori_id"
            value={formData.kategori_id}
            onChange={handleChange}
            required
          >
            <option value="">Kategori Seçin</option>
            {kategoriler.map(kat => (
              <option key={kat._id} value={kat._id}>{kat.ad}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Başlık *</label>
          <input
            type="text"
            name="baslik"
            value={formData.baslik}
            onChange={handleChange}
            placeholder="Şikayet başlığı"
            required
          />
        </div>

        <div className="form-group">
          <label>Açıklama *</label>
          <textarea
            name="aciklama"
            value={formData.aciklama}
            onChange={handleChange}
            placeholder="Sorunun detaylı açıklaması"
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Öncelik</label>
          <select name="oncelik" value={formData.oncelik} onChange={handleChange}>
            <option value="dusuk">Düşük</option>
            <option value="orta">Orta</option>
            <option value="yuksek">Yüksek</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fotoğraf</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.fotoğraf && (
            <img src={formData.fotoğraf} alt="preview" className="image-preview" />
          )}
        </div>

        <button type="submit" disabled={yukluyor}>
          {yukluyor ? 'Gönderiliyor...' : 'Şikayet Gönder'}
        </button>
      </form>
    </div>
  );
}
