/**
 * Yönetici Panel Bileşeni
 * Yönetici dashboard'u, şikayet yönetimi ve analiz gösterimi
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function YoneticiPanel({ token, aktifSayfa = 'yonetici' }) {
  // State tanımlamaları
  const [sikayetler, setSikayetler] = useState([]);
  const [stats, setStats] = useState(null);
  const [seciliSikayet, setSeciliSikayet] = useState(null);
  const [personeller, setPersoneller] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [atananBirim, setAtananBirim] = useState('');
  const [atananPersonel, setAtananPersonel] = useState('');
  const [yoneticiNotu, setYoneticiNotu] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('hepsi');

  /**
   * Tüm şikayetleri getir
   */
  const getSikayetler = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/yonetici/sikayetler`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSikayetler(data);
      }
    } catch (err) {
      console.error('Şikayetler yüklenirken hata:', err);
    }
  }, [token]);

  /**
   * İstatistikleri getir
   */
  const getStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/yonetici/analiz`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.istatistik);
      }
    } catch (err) {
      console.error('İstatistikler yüklenirken hata:', err);
    }
  }, [token]);

  /**
   * Personelleri getir
   */
  const getPersoneller = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/yonetici/personeller`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPersoneller(data);
      }
    } catch (err) {
      console.error('Personeller yüklenirken hata:', err);
    }
  }, [token]);

  /**
   * Tüm kullanıcıları getir
   */
  const getKullanicilar = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/yonetici/kullanicilar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setKullanicilar(data);
      }
    } catch (err) {
      console.error('Kullanıcılar yüklenirken hata:', err);
    }
  }, [token]);

  // Verileri yükle
  useEffect(() => {
    const yukle = async () => {
      setLoading(true);
      await Promise.all([getSikayetler(), getStats(), getPersoneller(), getKullanicilar()]);
      setLoading(false);
    };
    yukle();
  }, [getSikayetler, getStats, getPersoneller, getKullanicilar]);

  /**
   * Şikayeti personele ata
   */
  const handleAta = async () => {
    if (!atananBirim || !atananPersonel) {
      alert('Lütfen birim ve personel seçin');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/yonetici/ata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sikayet_id: seciliSikayet.id,
          personel_id: parseInt(atananPersonel),
          birim: atananBirim
        })
      });

      if (response.ok) {
        setSeciliSikayet(null);
        setAtananBirim('');
        setAtananPersonel('');
        getSikayetler();
        getStats();
        alert('Şikayet başarıyla atandı!');
      }
    } catch (err) {
      console.error('Atama hatası:', err);
      alert('Atama sırasında bir hata oluştu');
    }
  };

  /**
   * Yönetici notu ekle
   */
  const handleNotEkle = async () => {
    if (!yoneticiNotu.trim()) {
      alert('Lütfen bir not girin');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/yonetici/not-ekle/${seciliSikayet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ not: yoneticiNotu })
      });

      if (response.ok) {
        setYoneticiNotu('');
        getSikayetler();
        alert('Not başarıyla eklendi!');
      }
    } catch (err) {
      console.error('Not ekleme hatası:', err);
    }
  };

  /**
   * Durum rengini döndür
   */
  const getDurumRengi = (durum) => {
    const renkler = {
      'yeni': '#e74c3c',
      'atandi': '#f39c12',
      'cozuluyor': '#3498db',
      'cozuldu': '#27ae60',
      'reddedildi': '#95a5a6'
    };
    return renkler[durum] || '#333';
  };

  /**
   * Filtrelenmiş şikayetleri getir
   */
  const getFiltrelenmis = () => {
    let liste = [...sikayetler];
    
    if (aktifSayfa === 'bekleyen') {
      liste = liste.filter(s => s.durum === 'yeni');
    } else if (aktifSayfa === 'tamamlanan') {
      liste = liste.filter(s => s.durum === 'cozuldu' || s.durum === 'reddedildi');
    }
    
    if (filtre !== 'hepsi') {
      liste = liste.filter(s => s.durum === filtre);
    }
    
    return liste;
  };

  // Birim seçenekleri
  const birimler = [
    'Teknik Servis',
    'Temizlik',
    'Güvenlik',
    'Bahçe Bakım',
    'Elektrik',
    'Su Tesisatı',
    'Asansör',
    'Diğer'
  ];

  if (loading) {
    return (
      <div className="panel-loading">
        <div className="spinner"></div>
        <p>Yönetici paneli yükleniyor...</p>
      </div>
    );
  }

  // Dashboard görünümü
  if (aktifSayfa === 'yonetici') {
    return (
      <div className="yonetici-dashboard">
        <h2>📊 Yönetici Dashboard</h2>

        {/* İstatistik Kartları */}
        {stats && (
          <div className="dashboard-stats">
            <div className="stat-kart toplam">
              <div className="stat-icon">📊</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.toplam}</span>
                <span className="stat-etiket">Toplam Şikayet</span>
              </div>
            </div>
            <div className="stat-kart yeni">
              <div className="stat-icon">🆕</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.yeni}</span>
                <span className="stat-etiket">Yeni</span>
              </div>
            </div>
            <div className="stat-kart atandi">
              <div className="stat-icon">📤</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.atandi || 0}</span>
                <span className="stat-etiket">Atandı</span>
              </div>
            </div>
            <div className="stat-kart cozuluyor">
              <div className="stat-icon">⏳</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.cozuluyor}</span>
                <span className="stat-etiket">Çözülüyor</span>
              </div>
            </div>
            <div className="stat-kart cozuldu">
              <div className="stat-icon">✅</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.cozulen}</span>
                <span className="stat-etiket">Çözüldü</span>
              </div>
            </div>
            <div className="stat-kart oran">
              <div className="stat-icon">📈</div>
              <div className="stat-icerik">
                <span className="stat-sayi">{stats.cozulmeOrani}</span>
                <span className="stat-etiket">Çözülme Oranı</span>
              </div>
            </div>
          </div>
        )}

        {/* Son Şikayetler Özet */}
        <div className="son-sikayetler-panel">
          <h3>🆕 Son Gelen Şikayetler</h3>
          <div className="sikayet-ozet-liste">
            {sikayetler.slice(0, 5).map((s) => (
              <div key={s.id} className="sikayet-ozet-kart">
                <div className="ozet-sol">
                  <span className="ozet-baslik">{s.baslik}</span>
                  <span className="ozet-tarih">
                    {new Date(s.olusturma_tarihi).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span 
                  className="durum-badge"
                  style={{ backgroundColor: getDurumRengi(s.durum) }}
                >
                  {s.durum}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Kullanıcı Yönetimi
  if (aktifSayfa === 'kullanici-yonetimi') {
    return (
      <div className="yonetim-panel">
        <h2>👥 Kullanıcı Yönetimi</h2>
        <table className="yonetim-tablo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Daire</th>
              <th>Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {kullanicilar.filter(k => k.rol === 'sakin').map((k) => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td>{k.ad}</td>
                <td>{k.email}</td>
                <td>
                  <span className="rol-badge sakin">Sakin</span>
                </td>
                <td>{k.blok || 'A'}-{k.kat || '1'}/{k.daire}</td>
                <td>{new Date(k.olusturma_tarihi).toLocaleDateString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Personel Yönetimi
  if (aktifSayfa === 'personel-yonetimi') {
    return (
      <div className="yonetim-panel">
        <h2>🔧 Personel Yönetimi</h2>
        <table className="yonetim-tablo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Atanan Şikayet</th>
            </tr>
          </thead>
          <tbody>
            {personeller.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.ad}</td>
                <td>{p.email}</td>
                <td>{p.telefon || '-'}</td>
                <td>{sikayetler.filter(s => s.atanan_personel_id === p.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Şikayet Listesi (Tüm, Bekleyen, Tamamlanan)
  return (
    <div className="sikayet-yonetimi">
      <h2>
        {aktifSayfa === 'bekleyen' ? '⏳ Bekleyen Şikayetler' : 
         aktifSayfa === 'tamamlanan' ? '✅ Tamamlanan Şikayetler' : 
         '📋 Tüm Şikayetler'}
      </h2>

      {/* Filtre */}
      {aktifSayfa === 'tum-sikayetler' && (
        <div className="filtre-bar">
          <select value={filtre} onChange={(e) => setFiltre(e.target.value)}>
            <option value="hepsi">Tüm Durumlar</option>
            <option value="yeni">Yeni</option>
            <option value="atandi">Atandı</option>
            <option value="cozuluyor">Çözülüyor</option>
            <option value="cozuldu">Çözüldü</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
        </div>
      )}

      {/* Şikayet Tablosu */}
      <table className="sikayet-tablo">
        <thead>
          <tr>
            <th>ID</th>
            <th>Başlık</th>
            <th>Sakin</th>
            <th>Kategori</th>
            <th>Durum</th>
            <th>Öncelik</th>
            <th>Tarih</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {getFiltrelenmis().map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.baslik}</td>
              <td>
                {s.sakin?.ad || 'Bilinmiyor'}
                <br />
                <small>{s.sakin?.daire || ''}</small>
              </td>
              <td>{s.kategori?.ad || '-'}</td>
              <td>
                <span 
                  className="durum-badge"
                  style={{ backgroundColor: getDurumRengi(s.durum) }}
                >
                  {s.durum}
                </span>
              </td>
              <td>{s.oncelik}</td>
              <td>{new Date(s.olusturma_tarihi).toLocaleDateString('tr-TR')}</td>
              <td>
                <button 
                  className="detay-btn"
                  onClick={() => setSeciliSikayet(s)}
                >
                  Detay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Şikayet Detay Modal */}
      {seciliSikayet && (
        <div className="modal-overlay" onClick={() => setSeciliSikayet(null)}>
          <div className="modal yonetici-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{seciliSikayet.baslik}</h3>
              <button className="modal-kapat" onClick={() => setSeciliSikayet(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Şikayet Bilgileri */}
              <div className="detay-section">
                <h4>📝 Şikayet Detayları</h4>
                <p><strong>Açıklama:</strong> {seciliSikayet.aciklama}</p>
                <p><strong>Kategori:</strong> {seciliSikayet.kategori?.ad || '-'}</p>
                <p><strong>Öncelik:</strong> {seciliSikayet.oncelik}</p>
                <p>
                  <strong>Durum:</strong>{' '}
                  <span style={{ color: getDurumRengi(seciliSikayet.durum) }}>
                    {seciliSikayet.durum}
                  </span>
                </p>
              </div>

              {/* Sakin Bilgileri */}
              <div className="detay-section">
                <h4>👤 Şikayet Eden</h4>
                <p><strong>Ad:</strong> {seciliSikayet.sakin?.ad || '-'}</p>
                <p><strong>Email:</strong> {seciliSikayet.sakin?.email || '-'}</p>
                <p><strong>Daire:</strong> {seciliSikayet.sakin?.daire || '-'}</p>
                <p><strong>Telefon:</strong> {seciliSikayet.sakin?.telefon || '-'}</p>
              </div>

              {/* Fotoğraf */}
              {seciliSikayet.fotoğraf && (
                <div className="detay-section">
                  <h4>📷 Fotoğraf</h4>
                  <img src={seciliSikayet.fotoğraf} alt="Şikayet" className="modal-foto" />
                </div>
              )}

              {/* Personele Atama Formu */}
              {(seciliSikayet.durum === 'yeni') && (
                <div className="atama-section">
                  <h4>📤 Personele Ata</h4>
                  <div className="atama-form">
                    <select 
                      value={atananBirim} 
                      onChange={(e) => setAtananBirim(e.target.value)}
                    >
                      <option value="">Birim Seç</option>
                      {birimler.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    <select 
                      value={atananPersonel} 
                      onChange={(e) => setAtananPersonel(e.target.value)}
                    >
                      <option value="">Personel Seç</option>
                      {personeller.map((p) => (
                        <option key={p.id} value={p.id}>{p.ad}</option>
                      ))}
                    </select>

                    <button onClick={handleAta} className="ata-btn">
                      Personele Ata
                    </button>
                  </div>
                </div>
              )}

              {/* Mevcut Atama Bilgisi */}
              {seciliSikayet.atanan_personel_id && (
                <div className="detay-section">
                  <h4>👷 Atama Bilgisi</h4>
                  <p><strong>Birim:</strong> {seciliSikayet.atanan_birim || '-'}</p>
                  <p><strong>Personel:</strong> {seciliSikayet.atananPersonel?.ad || '-'}</p>
                </div>
              )}

              {/* Yönetici Notu */}
              <div className="not-section">
                <h4>💬 Yönetici Notu</h4>
                {seciliSikayet.not && (
                  <div className="mevcut-not">
                    <p>{seciliSikayet.not}</p>
                  </div>
                )}
                <textarea
                  placeholder="Not ekle..."
                  value={yoneticiNotu}
                  onChange={(e) => setYoneticiNotu(e.target.value)}
                  rows={3}
                />
                <button onClick={handleNotEkle} className="not-btn">
                  Not Ekle/Güncelle
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSeciliSikayet(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
