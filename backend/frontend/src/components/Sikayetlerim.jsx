/**
 * Şikayetlerim Bileşeni
 * Kullanıcının kendi oluşturduğu şikayetleri listeler
 * Şikayet durumu, yönetici açıklaması ve personel notlarını gösterir
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function Sikayetlerim({ token }) {
  // State tanımlamaları
  const [sikayetler, setSikayetler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seciliSikayet, setSeciliSikayet] = useState(null);
  const [filtre, setFiltre] = useState('hepsi');

  /**
   * Kullanıcının şikayetlerini API'den çek
   */
  const getSikayetler = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sikayet/benim-sikayetlerim`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSikayetler(data);
      }
    } catch (err) {
      console.error('Şikayetler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Bileşen yüklendiğinde şikayetleri getir
  useEffect(() => {
    getSikayetler();
  }, [getSikayetler]);

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
   * Durum etiketini döndür
   */
  const getDurumEtiketi = (durum) => {
    const etiketler = {
      'yeni': 'Yeni',
      'atandi': 'Atandı',
      'cozuluyor': 'Çözülüyor',
      'cozuldu': 'Çözüldü',
      'reddedildi': 'Reddedildi'
    };
    return etiketler[durum] || durum;
  };

  /**
   * Öncelik rengini döndür
   */
  const getOncelikRengi = (oncelik) => {
    const renkler = {
      'dusuk': '#27ae60',
      'orta': '#f39c12',
      'yuksek': '#e74c3c'
    };
    return renkler[oncelik] || '#333';
  };

  // Filtrelenmiş şikayetler
  const filtrelenmis = sikayetler.filter(s => {
    if (filtre === 'hepsi') return true;
    return s.durum === filtre;
  });

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="sikayetlerim-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Şikayetler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sikayetlerim-container">
      <div className="sikayetlerim-header">
        <h2>📋 Şikayetlerim</h2>
        <p className="sikayetlerim-aciklama">
          Oluşturduğunuz tüm şikayetleri buradan takip edebilirsiniz.
        </p>
      </div>

      {/* Filtre Butonları */}
      <div className="filtre-container">
        <button 
          className={`filtre-btn ${filtre === 'hepsi' ? 'aktif' : ''}`}
          onClick={() => setFiltre('hepsi')}
        >
          Tümü ({sikayetler.length})
        </button>
        <button 
          className={`filtre-btn ${filtre === 'yeni' ? 'aktif' : ''}`}
          onClick={() => setFiltre('yeni')}
        >
          Yeni ({sikayetler.filter(s => s.durum === 'yeni').length})
        </button>
        <button 
          className={`filtre-btn ${filtre === 'cozuluyor' ? 'aktif' : ''}`}
          onClick={() => setFiltre('cozuluyor')}
        >
          Çözülüyor ({sikayetler.filter(s => s.durum === 'cozuluyor').length})
        </button>
        <button 
          className={`filtre-btn ${filtre === 'cozuldu' ? 'aktif' : ''}`}
          onClick={() => setFiltre('cozuldu')}
        >
          Çözüldü ({sikayetler.filter(s => s.durum === 'cozuldu').length})
        </button>
      </div>

      {/* Şikayet Listesi */}
      {filtrelenmis.length === 0 ? (
        <div className="bos-liste">
          <span className="bos-icon">📭</span>
          <p>Henüz şikayetiniz bulunmuyor.</p>
          <small>Yeni şikayet oluşturmak için menüden "Şikayet Oluştur" seçeneğini kullanın.</small>
        </div>
      ) : (
        <div className="sikayetler-grid">
          {filtrelenmis.map((sikayet) => (
            <div key={sikayet.id} className="sikayet-kart">
              <div className="sikayet-kart-header">
                <span 
                  className="durum-badge"
                  style={{ backgroundColor: getDurumRengi(sikayet.durum) }}
                >
                  {getDurumEtiketi(sikayet.durum)}
                </span>
                <span 
                  className="oncelik-badge"
                  style={{ backgroundColor: getOncelikRengi(sikayet.oncelik) }}
                >
                  {sikayet.oncelik}
                </span>
              </div>
              
              <h3 className="sikayet-baslik">{sikayet.baslik}</h3>
              
              <p className="sikayet-aciklama">
                {sikayet.aciklama.length > 100 
                  ? sikayet.aciklama.substring(0, 100) + '...' 
                  : sikayet.aciklama}
              </p>

              <div className="sikayet-meta">
                <span className="meta-item">
                  📁 {sikayet.kategori?.ad || 'Kategori Yok'}
                </span>
                <span className="meta-item">
                  📅 {new Date(sikayet.olusturma_tarihi).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {/* Atanan Personel Bilgisi */}
              {sikayet.atananPersonel && (
                <div className="atanan-bilgi">
                  <span>🔧 Atanan: {sikayet.atananPersonel.ad}</span>
                </div>
              )}

              {/* Yönetici/Personel Notu */}
              {sikayet.not && (
                <div className="yonetici-notu">
                  <strong>📝 Not:</strong> {sikayet.not}
                </div>
              )}

              <button 
                className="detay-btn"
                onClick={() => setSeciliSikayet(sikayet)}
              >
                Detayları Gör
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detay Modal */}
      {seciliSikayet && (
        <div className="modal-overlay" onClick={() => setSeciliSikayet(null)}>
          <div className="modal sikayet-detay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{seciliSikayet.baslik}</h3>
              <button className="modal-kapat" onClick={() => setSeciliSikayet(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Durum ve Öncelik */}
              <div className="detay-badges">
                <span 
                  className="durum-badge large"
                  style={{ backgroundColor: getDurumRengi(seciliSikayet.durum) }}
                >
                  {getDurumEtiketi(seciliSikayet.durum)}
                </span>
                <span 
                  className="oncelik-badge large"
                  style={{ backgroundColor: getOncelikRengi(seciliSikayet.oncelik) }}
                >
                  Öncelik: {seciliSikayet.oncelik}
                </span>
              </div>

              {/* Açıklama */}
              <div className="detay-section">
                <h4>📝 Açıklama</h4>
                <p>{seciliSikayet.aciklama}</p>
              </div>

              {/* Kategori ve Tarih */}
              <div className="detay-section">
                <h4>📊 Bilgiler</h4>
                <div className="bilgi-grid">
                  <div className="bilgi-item">
                    <span className="bilgi-label">Kategori:</span>
                    <span className="bilgi-value">{seciliSikayet.kategori?.ad || 'Belirtilmedi'}</span>
                  </div>
                  <div className="bilgi-item">
                    <span className="bilgi-label">Oluşturma Tarihi:</span>
                    <span className="bilgi-value">
                      {new Date(seciliSikayet.olusturma_tarihi).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  {seciliSikayet.guncelleme_tarihi && (
                    <div className="bilgi-item">
                      <span className="bilgi-label">Son Güncelleme:</span>
                      <span className="bilgi-value">
                        {new Date(seciliSikayet.guncelleme_tarihi).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {seciliSikayet.cozum_tarihi && (
                    <div className="bilgi-item">
                      <span className="bilgi-label">Çözüm Tarihi:</span>
                      <span className="bilgi-value">
                        {new Date(seciliSikayet.cozum_tarihi).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Atanan Birim ve Personel */}
              {(seciliSikayet.atanan_birim || seciliSikayet.atananPersonel) && (
                <div className="detay-section">
                  <h4>👷 Atama Bilgileri</h4>
                  <div className="bilgi-grid">
                    {seciliSikayet.atanan_birim && (
                      <div className="bilgi-item">
                        <span className="bilgi-label">Birim:</span>
                        <span className="bilgi-value">{seciliSikayet.atanan_birim}</span>
                      </div>
                    )}
                    {seciliSikayet.atananPersonel && (
                      <div className="bilgi-item">
                        <span className="bilgi-label">Personel:</span>
                        <span className="bilgi-value">{seciliSikayet.atananPersonel.ad}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Yönetici/Personel Notu */}
              {seciliSikayet.not && (
                <div className="detay-section not-section">
                  <h4>💬 Yönetici/Personel Notu</h4>
                  <div className="not-kutusu">
                    {seciliSikayet.not}
                  </div>
                </div>
              )}

              {/* Fotoğraf */}
              {seciliSikayet.fotoğraf && (
                <div className="detay-section">
                  <h4>📷 Eklenen Fotoğraf</h4>
                  <img 
                    src={seciliSikayet.fotoğraf} 
                    alt="Şikayet fotoğrafı" 
                    className="detay-foto"
                  />
                </div>
              )}
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




