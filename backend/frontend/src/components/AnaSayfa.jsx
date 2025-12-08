/**
 * Ana Sayfa Bileşeni
 * Kullanıcı için hoş geldin sayfası ve özet bilgiler
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function AnaSayfa({ token }) {
  const [stats, setStats] = useState({
    toplam: 0,
    yeni: 0,
    cozuluyor: 0,
    cozuldu: 0
  });
  const [sonSikayetler, setSonSikayetler] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Kullanıcı istatistiklerini ve son şikayetleri getir
   */
  const getVeriler = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/sikayet/benim-sikayetlerim`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // İstatistikleri hesapla
        setStats({
          toplam: data.length,
          yeni: data.filter(s => s.durum === 'yeni').length,
          cozuluyor: data.filter(s => s.durum === 'cozuluyor' || s.durum === 'atandi').length,
          cozuldu: data.filter(s => s.durum === 'cozuldu').length
        });

        // Son 5 şikayeti al
        setSonSikayetler(data.slice(0, 5));
      }
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getVeriler();
  }, [getVeriler]);

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

  if (loading) {
    return (
      <div className="anasayfa-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="anasayfa-container">
      {/* Hoş Geldin Kartı */}
      <div className="hosgeldin-kart">
        <div className="hosgeldin-icon">🏠</div>
        <div className="hosgeldin-icerik">
          <h2>Hoş Geldiniz!</h2>
          <p>Apartman Şikayet Yönetim Sistemi'ne hoş geldiniz. 
             Buradan şikayetlerinizi oluşturabilir ve takip edebilirsiniz.</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="stats-grid">
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
            <span className="stat-etiket">Yeni Şikayet</span>
          </div>
        </div>

        <div className="stat-kart isleniyor">
          <div className="stat-icon">⏳</div>
          <div className="stat-icerik">
            <span className="stat-sayi">{stats.cozuluyor}</span>
            <span className="stat-etiket">İşleniyor</span>
          </div>
        </div>

        <div className="stat-kart cozuldu">
          <div className="stat-icon">✅</div>
          <div className="stat-icerik">
            <span className="stat-sayi">{stats.cozuldu}</span>
            <span className="stat-etiket">Çözüldü</span>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="hizli-islemler">
        <h3>🚀 Hızlı İşlemler</h3>
        <div className="islem-butonlari">
          <div className="islem-kart">
            <span className="islem-icon">📝</span>
            <span className="islem-baslik">Yeni Şikayet Oluştur</span>
            <p>Apartmanla ilgili sorunlarınızı bildirin</p>
          </div>
          <div className="islem-kart">
            <span className="islem-icon">📋</span>
            <span className="islem-baslik">Şikayetlerimi Gör</span>
            <p>Mevcut şikayetlerinizi takip edin</p>
          </div>
          <div className="islem-kart">
            <span className="islem-icon">🔔</span>
            <span className="islem-baslik">Bildirimler</span>
            <p>Güncellemelerden haberdar olun</p>
          </div>
        </div>
      </div>

      {/* Son Şikayetler */}
      {sonSikayetler.length > 0 && (
        <div className="son-sikayetler">
          <h3>📋 Son Şikayetlerim</h3>
          <div className="sikayet-listesi">
            {sonSikayetler.map((sikayet) => (
              <div key={sikayet.id} className="sikayet-ozet">
                <div className="sikayet-ozet-sol">
                  <span className="sikayet-baslik">{sikayet.baslik}</span>
                  <span className="sikayet-tarih">
                    {new Date(sikayet.olusturma_tarihi).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span 
                  className="durum-badge"
                  style={{ backgroundColor: getDurumRengi(sikayet.durum) }}
                >
                  {sikayet.durum}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




