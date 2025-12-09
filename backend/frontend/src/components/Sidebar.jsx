/**
 * Sidebar Bileşeni
 * Tüm paneller için sol tarafta sabit menü
 * Rol bazlı menü öğeleri gösterir
 */

import React, { useState } from 'react';

export default function Sidebar({ rol, aktifSayfa, sayfaDegistir, onCikis }) {
  // Mobil menü durumu
  const [menuAcik, setMenuAcik] = useState(false);

  // Rol bazlı menü öğeleri
  const menuOgeleri = {
    sakin: [
      { id: 'anasayfa', icon: '🏠', label: 'Ana Sayfa', sayfa: 'anasayfa' },
      { id: 'profil', icon: '👤', label: 'Profilim', sayfa: 'profil' },
      { id: 'sikayet-olustur', icon: '📝', label: 'Şikayet Oluştur', sayfa: 'sikayet' },
      { id: 'sikayetlerim', icon: '📋', label: 'Şikayetlerim', sayfa: 'sikayetlerim' },
      { id: 'bildirimler', icon: '🔔', label: 'Bildirimler', sayfa: 'bildirimler' },
    ],
    personel: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', sayfa: 'personel' },
      { id: 'gelen-sikayetler', icon: '📥', label: 'Gelen Şikayetler', sayfa: 'gelen-sikayetler' },
      { id: 'tamamlanan', icon: '✅', label: 'Tamamlanan Şikayetler', sayfa: 'tamamlanan' },
      { id: 'bildirimler', icon: '🔔', label: 'Bildirimler', sayfa: 'bildirimler' },
      { id: 'profil', icon: '👤', label: 'Profilim', sayfa: 'profil' },
    ],
    yonetici: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', sayfa: 'yonetici' },
      { id: 'tum-sikayetler', icon: '📋', label: 'Tüm Şikayetler', sayfa: 'tum-sikayetler' },
      { id: 'bekleyen', icon: '⏳', label: 'Bekleyen Şikayetler', sayfa: 'bekleyen' },
      { id: 'tamamlanan', icon: '✅', label: 'Tamamlanan Şikayetler', sayfa: 'tamamlanan' },
      { id: 'kullanici-yonetimi', icon: '👥', label: 'Kullanıcı Yönetimi', sayfa: 'kullanici-yonetimi' },
      { id: 'personel-yonetimi', icon: '🔧', label: 'Personel Yönetimi', sayfa: 'personel-yonetimi' },
      { id: 'profil', icon: '👤', label: 'Profilim', sayfa: 'profil' },
    ]
  };

  // Rol başlığı
  const rolBasliklari = {
    sakin: 'Kullanıcı Paneli',
    personel: 'Personel Paneli',
    yonetici: 'Yönetici Paneli'
  };

  const mevcutMenu = menuOgeleri[rol] || menuOgeleri.sakin;

  return (
    <>
      {/* Mobil Menü Butonu */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMenuAcik(!menuAcik)}
      >
        {menuAcik ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${menuAcik ? 'acik' : ''}`}>
        {/* Logo ve Başlık */}
        <div className="sidebar-header">
          <div className="sidebar-logo">🏢</div>
          <h2>Apartman Şikayet</h2>
          <span className="sidebar-rol">{rolBasliklari[rol]}</span>
        </div>

        {/* Menü Öğeleri */}
        <nav className="sidebar-nav">
          <ul>
            {mevcutMenu.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-link ${aktifSayfa === item.sayfa ? 'aktif' : ''}`}
                  onClick={() => {
                    sayfaDegistir(item.sayfa);
                    setMenuAcik(false);
                  }}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Çıkış Butonu */}
        <div className="sidebar-footer">
          <button className="sidebar-cikis" onClick={onCikis}>
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobil Overlay */}
      {menuAcik && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMenuAcik(false)}
        />
      )}
    </>
  );
}








