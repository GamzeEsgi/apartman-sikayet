/**
 * Personel Panel Bileşeni
 * Personel dashboard'u, atanan şikayetler ve durum güncelleme
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function PersonelPanel({ token, aktifSayfa = 'personel' }) {
  // State tanımlamaları
  const [sikayetler, setSikayetler] = useState([]);
  const [bildirimler, setBildirimler] = useState([]);
  const [seciliSikayet, setSeciliSikayet] = useState(null);
  const [yeniDurum, setYeniDurum] = useState('');
  const [not, setNot] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * Personele atanan şikayetleri getir
   */
  const getSikayetler = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/personel/sikayetlerim`, {
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
   * Bildirimleri getir
   */
  const getBildirimler = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/personel/bildirimler`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBildirimler(data);
      }
    } catch (err) {
      console.error('Bildirimler yüklenirken hata:', err);
    }
  }, [token]);

  // Verileri yükle
  useEffect(() => {
    const yukle = async () => {
      setLoading(true);
      await Promise.all([getSikayetler(), getBildirimler()]);
      setLoading(false);
    };
    yukle();
  }, [getSikayetler, getBildirimler]);

  /**
   * Şikayet durumunu güncelle
   */
  const handleDurumGuncelle = async () => {
    if (!yeniDurum) {
      alert('Lütfen bir durum seçin');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/personel/durum-guncelle/${seciliSikayet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          durum: yeniDurum,
          not: not
        })
      });

      if (response.ok) {
        setSeciliSikayet(null);
        setYeniDurum('');
        setNot('');
        getSikayetler();
        getBildirimler();
        alert('Durum başarıyla güncellendi!');
      }
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
      alert('Güncelleme sırasında hata oluştu');
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
    if (aktifSayfa === 'tamamlanan') {
      return sikayetler.filter(s => s.durum === 'cozuldu' || s.durum === 'reddedildi');
    }
    if (aktifSayfa === 'gelen-sikayetler') {
      return sikayetler.filter(s => s.durum !== 'cozuldu' && s.durum !== 'reddedildi');
    }
    return sikayetler;
  };

  // İstatistikler
  const stats = {
    toplam: sikayetler.length,
    bekleyen: sikayetler.filter(s => s.durum === 'atandi' || s.durum === 'cozuluyor').length,
    tamamlanan: sikayetler.filter(s => s.durum === 'cozuldu').length,
    okunmamis: bildirimler.filter(b => !b.okunanmis).length
  };

  if (loading) {
    return (
      <div className="panel-loading">
        <div className="spinner"></div>
        <p>Personel paneli yükleniyor...</p>
      </div>
    );
  }

  // Dashboard görünümü
  if (aktifSayfa === 'personel') {
    return (
      <div className="personel-dashboard">
        <h2>📊 Personel Dashboard</h2>

        {/* İstatistik Kartları */}
        <div className="dashboard-stats">
          <div className="stat-kart toplam">
            <div className="stat-icon">📋</div>
            <div className="stat-icerik">
              <span className="stat-sayi">{stats.toplam}</span>
              <span className="stat-etiket">Toplam Atanan</span>
            </div>
          </div>
          <div className="stat-kart bekleyen">
            <div className="stat-icon">⏳</div>
            <div className="stat-icerik">
              <span className="stat-sayi">{stats.bekleyen}</span>
              <span className="stat-etiket">Bekleyen</span>
            </div>
          </div>
          <div className="stat-kart cozuldu">
            <div className="stat-icon">✅</div>
            <div className="stat-icerik">
              <span className="stat-sayi">{stats.tamamlanan}</span>
              <span className="stat-etiket">Tamamlanan</span>
            </div>
          </div>
          <div className="stat-kart bildirim">
            <div className="stat-icon">🔔</div>
            <div className="stat-icerik">
              <span className="stat-sayi">{stats.okunmamis}</span>
              <span className="stat-etiket">Yeni Bildirim</span>
            </div>
          </div>
        </div>

        {/* Son Atanan Şikayetler */}
        <div className="son-sikayetler-panel">
          <h3>📥 Son Atanan Şikayetler</h3>
          {sikayetler.length === 0 ? (
            <p className="bos-mesaj">Henüz size atanmış şikayet bulunmuyor.</p>
          ) : (
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
          )}
        </div>

        {/* Son Bildirimler */}
        {bildirimler.length > 0 && (
          <div className="son-bildirimler">
            <h3>🔔 Son Bildirimler</h3>
            <div className="bildirim-liste">
              {bildirimler.slice(0, 3).map((b) => (
                <div key={b.id} className={`bildirim-item ${!b.okunanmis ? 'okunmamis' : ''}`}>
                  <span className="bildirim-icon">{!b.okunanmis ? '🔵' : '⚪'}</span>
                  <div className="bildirim-icerik">
                    <strong>{b.baslik}</strong>
                    <p>{b.mesaj}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Bildirimler sayfası
  if (aktifSayfa === 'bildirimler') {
    return (
      <div className="bildirimler-panel">
        <h2>🔔 Bildirimler</h2>
        {bildirimler.length === 0 ? (
          <div className="bos-liste">
            <span className="bos-icon">🔕</span>
            <p>Henüz bildiriminiz bulunmuyor.</p>
          </div>
        ) : (
          <div className="bildirim-listesi-tam">
            {bildirimler.map((b) => (
              <div key={b.id} className={`bildirim-kart ${!b.okunanmis ? 'okunmamis' : ''}`}>
                <div className="bildirim-icon">{!b.okunanmis ? '🔵' : '⚪'}</div>
                <div className="bildirim-icerik">
                  <h4>{b.baslik}</h4>
                  <p>{b.mesaj}</p>
                  <span className="bildirim-tarih">
                    {new Date(b.olusturma_tarihi).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Şikayet Listesi (Gelen veya Tamamlanan)
  return (
    <div className="sikayet-yonetimi">
      <h2>
        {aktifSayfa === 'tamamlanan' ? '✅ Tamamlanan Şikayetler' : '📥 Gelen Şikayetler'}
      </h2>

      {getFiltrelenmis().length === 0 ? (
        <div className="bos-liste">
          <span className="bos-icon">📭</span>
          <p>
            {aktifSayfa === 'tamamlanan' 
              ? 'Tamamlanmış şikayet bulunmuyor.' 
              : 'Size atanmış şikayet bulunmuyor.'}
          </p>
        </div>
      ) : (
        <table className="sikayet-tablo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
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
                    onClick={() => {
                      setSeciliSikayet(s);
                      setYeniDurum(s.durum);
                      setNot(s.not || '');
                    }}
                  >
                    {aktifSayfa === 'tamamlanan' ? 'Görüntüle' : 'Güncelle'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Şikayet Detay/Güncelleme Modal */}
      {seciliSikayet && (
        <div className="modal-overlay" onClick={() => setSeciliSikayet(null)}>
          <div className="modal personel-modal" onClick={(e) => e.stopPropagation()}>
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
                <p><strong>Birim:</strong> {seciliSikayet.atanan_birim || '-'}</p>
                <p>
                  <strong>Mevcut Durum:</strong>{' '}
                  <span style={{ color: getDurumRengi(seciliSikayet.durum) }}>
                    {seciliSikayet.durum}
                  </span>
                </p>
              </div>

              {/* Fotoğraf */}
              {seciliSikayet.fotoğraf && (
                <div className="detay-section">
                  <h4>📷 Fotoğraf</h4>
                  <img src={seciliSikayet.fotoğraf} alt="Şikayet" className="modal-foto" />
                </div>
              )}

              {/* Durum Güncelleme (Sadece tamamlanmamış şikayetler için) */}
              {seciliSikayet.durum !== 'cozuldu' && seciliSikayet.durum !== 'reddedildi' && (
                <div className="guncelleme-section">
                  <h4>🔄 Durumu Güncelle</h4>
                  <div className="guncelleme-form">
                    <select 
                      value={yeniDurum} 
                      onChange={(e) => setYeniDurum(e.target.value)}
                    >
                      <option value="atandi">Atandı</option>
                      <option value="cozuluyor">Çözülüyor</option>
                      <option value="cozuldu">Çözüldü</option>
                      <option value="reddedildi">Reddedildi</option>
                    </select>

                    <textarea
                      placeholder="Çözüm notu veya açıklama ekleyin..."
                      value={not}
                      onChange={(e) => setNot(e.target.value)}
                      rows={4}
                    />

                    <button onClick={handleDurumGuncelle} className="guncelle-btn">
                      Durumu Güncelle
                    </button>
                  </div>
                </div>
              )}

              {/* Mevcut Not */}
              {seciliSikayet.not && (
                <div className="detay-section">
                  <h4>💬 Çözüm Notu</h4>
                  <div className="mevcut-not">
                    {seciliSikayet.not}
                  </div>
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
