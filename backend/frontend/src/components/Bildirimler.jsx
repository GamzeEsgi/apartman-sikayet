/**
 * Bildirimler Bileşeni
 * Kullanıcıya gelen tüm bildirimleri listeler
 * Okunmamış bildirimleri vurgular
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function Bildirimler({ token }) {
  const [bildirimler, setBildirimler] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Bildirimleri API'den çek
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
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getBildirimler();
  }, [getBildirimler]);

  /**
   * Bildirimi okundu olarak işaretle
   */
  const bildirimOku = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/personel/bildirim-oku/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Bildirimi güncelle
        setBildirimler(prev => 
          prev.map(b => b.id === id ? { ...b, okunanmis: true } : b)
        );
      }
    } catch (err) {
      console.error('Bildirim güncellenirken hata:', err);
    }
  };

  /**
   * Tüm bildirimleri okundu işaretle
   */
  const tumunuOku = async () => {
    const okunmamislar = bildirimler.filter(b => !b.okunanmis);
    for (const bildirim of okunmamislar) {
      await bildirimOku(bildirim.id);
    }
  };

  const okunmamisSayisi = bildirimler.filter(b => !b.okunanmis).length;

  if (loading) {
    return (
      <div className="bildirimler-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Bildirimler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bildirimler-container">
      <div className="bildirimler-header">
        <div className="header-sol">
          <h2>🔔 Bildirimler</h2>
          {okunmamisSayisi > 0 && (
            <span className="okunmamis-badge">{okunmamisSayisi} yeni</span>
          )}
        </div>
        {okunmamisSayisi > 0 && (
          <button className="tumunu-oku-btn" onClick={tumunuOku}>
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {bildirimler.length === 0 ? (
        <div className="bos-bildirim">
          <span className="bos-icon">🔕</span>
          <p>Henüz bildiriminiz bulunmuyor.</p>
          <small>Şikayetleriniz hakkında güncellemeler burada görünecek.</small>
        </div>
      ) : (
        <div className="bildirim-listesi">
          {bildirimler.map((bildirim) => (
            <div 
              key={bildirim.id} 
              className={`bildirim-kart ${!bildirim.okunanmis ? 'okunmamis' : ''}`}
              onClick={() => !bildirim.okunanmis && bildirimOku(bildirim.id)}
            >
              <div className="bildirim-icon">
                {!bildirim.okunanmis ? '🔵' : '⚪'}
              </div>
              <div className="bildirim-icerik">
                <h4>{bildirim.baslik}</h4>
                <p>{bildirim.mesaj}</p>
                <span className="bildirim-tarih">
                  {new Date(bildirim.olusturma_tarihi).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




