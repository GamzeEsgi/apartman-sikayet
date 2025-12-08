/**
 * Profil Bileşeni
 * Kullanıcı profil bilgilerini görüntüler ve düzenleme imkanı sağlar
 * Blok, kat ve daire bilgilerini içerir
 */

import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

export default function Profil({ token }) {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duzenleModu, setDuzenleModu] = useState(false);
  const [form, setForm] = useState({});
  const [mesaj, setMesaj] = useState({ tip: '', metin: '' });

  /**
   * Profil bilgilerini API'den çek
   */
  const getProfil = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfil(data);
        setForm({
          ad: data.ad || '',
          telefon: data.telefon || '',
          blok: data.blok || '',
          kat: data.kat || '',
          daire: data.daire || ''
        });
      }
    } catch (err) {
      console.error('Profil yüklenirken hata:', err);
      setMesaj({ tip: 'hata', metin: 'Profil bilgileri yüklenemedi' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getProfil();
  }, [getProfil]);

  /**
   * Profil güncelleme
   */
  const handleGuncelle = async (e) => {
    e.preventDefault();
    setMesaj({ tip: '', metin: '' });

    try {
      const response = await fetch(`${API_URL}/api/auth/profil-guncelle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        setProfil(data.kullanici);
        setDuzenleModu(false);
        setMesaj({ tip: 'basari', metin: 'Profil başarıyla güncellendi!' });
      } else {
        const error = await response.json();
        setMesaj({ tip: 'hata', metin: error.mesaj || 'Güncelleme başarısız' });
      }
    } catch (err) {
      setMesaj({ tip: 'hata', metin: 'Sunucuya bağlanılamadı' });
    }
  };

  /**
   * Rol etiketini döndür
   */
  const getRolEtiketi = (rol) => {
    const etiketler = {
      'sakin': { icon: '👤', label: 'Apartman Sakini', renk: '#3498db' },
      'personel': { icon: '🔧', label: 'Teknik Personel', renk: '#27ae60' },
      'yonetici': { icon: '👔', label: 'Yönetici', renk: '#9b59b6' }
    };
    return etiketler[rol] || { icon: '👤', label: rol, renk: '#333' };
  };

  if (loading) {
    return (
      <div className="profil-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="profil-container">
        <div className="hata-mesaj">
          <span>❌</span>
          <p>Profil bilgileri yüklenemedi.</p>
        </div>
      </div>
    );
  }

  const rolBilgi = getRolEtiketi(profil.rol);

  return (
    <div className="profil-container">
      {/* Mesaj Gösterimi */}
      {mesaj.metin && (
        <div className={`profil-mesaj ${mesaj.tip}`}>
          {mesaj.tip === 'basari' ? '✅' : '❌'} {mesaj.metin}
        </div>
      )}

      {/* Profil Kartı */}
      <div className="profil-kart">
        {/* Profil Başlığı */}
        <div className="profil-header">
          <div className="profil-avatar">
            <span>{profil.ad?.charAt(0).toUpperCase() || '?'}</span>
          </div>
          <div className="profil-baslik-bilgi">
            <h2>{profil.ad}</h2>
            <span 
              className="rol-badge"
              style={{ backgroundColor: rolBilgi.renk }}
            >
              {rolBilgi.icon} {rolBilgi.label}
            </span>
          </div>
        </div>

        {/* Profil İçeriği */}
        {!duzenleModu ? (
          <div className="profil-detay">
            {/* İletişim Bilgileri */}
            <div className="bilgi-bolumu">
              <h3>📧 İletişim Bilgileri</h3>
              <div className="bilgi-satir">
                <span className="bilgi-etiket">Email:</span>
                <span className="bilgi-deger">{profil.email}</span>
              </div>
              <div className="bilgi-satir">
                <span className="bilgi-etiket">Telefon:</span>
                <span className="bilgi-deger">{profil.telefon || 'Belirtilmedi'}</span>
              </div>
            </div>

            {/* Konum Bilgileri */}
            <div className="bilgi-bolumu">
              <h3>🏠 Konum Bilgileri</h3>
              <div className="konum-grid">
                <div className="konum-kart">
                  <span className="konum-icon">🏢</span>
                  <span className="konum-etiket">Blok</span>
                  <span className="konum-deger">{profil.blok || 'A'}</span>
                </div>
                <div className="konum-kart">
                  <span className="konum-icon">📶</span>
                  <span className="konum-etiket">Kat</span>
                  <span className="konum-deger">{profil.kat || '1'}</span>
                </div>
                <div className="konum-kart">
                  <span className="konum-icon">🚪</span>
                  <span className="konum-etiket">Daire</span>
                  <span className="konum-deger">{profil.daire}</span>
                </div>
              </div>
            </div>

            {/* Hesap Bilgileri */}
            <div className="bilgi-bolumu">
              <h3>📅 Hesap Bilgileri</h3>
              <div className="bilgi-satir">
                <span className="bilgi-etiket">Kayıt Tarihi:</span>
                <span className="bilgi-deger">
                  {profil.olusturma_tarihi 
                    ? new Date(profil.olusturma_tarihi).toLocaleDateString('tr-TR')
                    : 'Belirtilmedi'}
                </span>
              </div>
              {profil.son_giris && (
                <div className="bilgi-satir">
                  <span className="bilgi-etiket">Son Giriş:</span>
                  <span className="bilgi-deger">
                    {new Date(profil.son_giris).toLocaleString('tr-TR')}
                  </span>
                </div>
              )}
            </div>

            {/* Düzenle Butonu */}
            <button 
              className="profil-duzenle-btn"
              onClick={() => setDuzenleModu(true)}
            >
              ✏️ Profili Düzenle
            </button>
          </div>
        ) : (
          /* Düzenleme Formu */
          <form className="profil-form" onSubmit={handleGuncelle}>
            <div className="form-grup">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                required
              />
            </div>

            <div className="form-grup">
              <label>Telefon</label>
              <input
                type="tel"
                value={form.telefon}
                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div className="form-row">
              <div className="form-grup">
                <label>Blok</label>
                <input
                  type="text"
                  value={form.blok}
                  onChange={(e) => setForm({ ...form, blok: e.target.value })}
                  placeholder="A"
                />
              </div>

              <div className="form-grup">
                <label>Kat</label>
                <input
                  type="text"
                  value={form.kat}
                  onChange={(e) => setForm({ ...form, kat: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div className="form-grup">
                <label>Daire</label>
                <input
                  type="text"
                  value={form.daire}
                  onChange={(e) => setForm({ ...form, daire: e.target.value })}
                  placeholder="1"
                  required
                />
              </div>
            </div>

            <div className="form-butonlar">
              <button type="submit" className="kaydet-btn">
                💾 Kaydet
              </button>
              <button 
                type="button" 
                className="iptal-btn"
                onClick={() => {
                  setDuzenleModu(false);
                  setForm({
                    ad: profil.ad || '',
                    telefon: profil.telefon || '',
                    blok: profil.blok || '',
                    kat: profil.kat || '',
                    daire: profil.daire || ''
                  });
                }}
              >
                ❌ İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
