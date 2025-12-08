/**
 * Personel Routes - Personel Panel İşlemleri
 * Atanan şikayetleri görme, durum güncelleme ve bildirimler
 */

const express = require('express');
const { Sikayet, Bildirim, Kategori } = require('../models');
const { auth, personelKontrol } = require('../middleware/auth');

const router = express.Router();

/**
 * Personele Atanan Şikayetleri Getir
 * GET /api/personel/sikayetlerim
 * Giriş yapmış personele atanan şikayetleri listeler
 */
router.get('/sikayetlerim', auth, personelKontrol, async (req, res) => {
  try {
    // Token'dan gelen kullanıcı ID'sine göre şikayetleri getir
    const sikayetler = await Sikayet.findAll({
      where: { atanan_personel_id: req.user.id },
      include: [
        { model: Kategori, as: 'kategori' }
      ],
      order: [['olusturma_tarihi', 'DESC']] // En yeni şikayetler üstte
    });
    res.json(sikayetler);
  } catch (err) {
    console.error('Şikayet listeleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Şikayet Durumunu Güncelle
 * PUT /api/personel/durum-guncelle/:id
 * Şikayetin durumunu ve çözüm notunu günceller
 * Durumlar: cozuluyor, cozuldu, reddedildi
 */
router.put('/durum-guncelle/:id', auth, personelKontrol, async (req, res) => {
  try {
    // Request body'den durum ve not bilgilerini al
    const { durum, not } = req.body;

    // Şikayeti bul
    const sikayet = await Sikayet.findByPk(req.params.id);
    
    if (!sikayet) {
      return res.status(404).json({ mesaj: 'Şikayet bulunamadı' });
    }

    // Şikayeti güncelle
    await sikayet.update({
      durum,
      not,
      guncelleme_tarihi: new Date(),
      // Çözüldü durumunda çözüm tarihini kaydet
      cozum_tarihi: durum === 'cozuldu' ? new Date() : undefined
    });

    // Sakine gönderilecek bildirim mesajını hazırla
    let mesaj = '';
    if (durum === 'cozuluyor') {
      mesaj = 'Şikayetiniz üzerinde çalışılmaya başlanmıştır.';
    } else if (durum === 'cozuldu') {
      mesaj = 'Şikayetiniz çözülmüştür. Çözüm notu: ' + (not || 'Belirtilmedi');
    } else if (durum === 'reddedildi') {
      mesaj = 'Şikayetiniz reddedilmiştir. Gerekçe: ' + (not || 'Belirtilmedi');
    }

    // Şikayeti açan sakine bildirim gönder
    await Bildirim.create({
      kullanic_id: sikayet.sakin_id,
      sikayet_id: req.params.id,
      baslik: 'Şikayet Durum Güncellemesi',
      mesaj
    });

    res.json({
      mesaj: 'Durum başarıyla güncellendi',
      sikayet
    });
  } catch (err) {
    console.error('Durum güncelleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Kullanıcı Bildirimlerini Getir
 * GET /api/personel/bildirimler
 * Giriş yapmış kullanıcının bildirimlerini listeler
 */
router.get('/bildirimler', auth, async (req, res) => {
  try {
    // Kullanıcının tüm bildirimlerini getir
    const bildirimler = await Bildirim.findAll({
      where: { kullanic_id: req.user.id },
      order: [['olusturma_tarihi', 'DESC']] // En yeni bildirimler üstte
    });
    res.json(bildirimler);
  } catch (err) {
    console.error('Bildirim listeleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Bildirimi Okundu İşaretle
 * PUT /api/personel/bildirim-oku/:id
 * Belirli bir bildirimi okundu olarak işaretler
 */
router.put('/bildirim-oku/:id', auth, async (req, res) => {
  try {
    // Bildirimi bul
    const bildirim = await Bildirim.findByPk(req.params.id);
    
    if (!bildirim) {
      return res.status(404).json({ mesaj: 'Bildirim bulunamadı' });
    }

    // Bildirimi okundu olarak işaretle
    await bildirim.update({ okunanmis: true });
    res.json(bildirim);
  } catch (err) {
    console.error('Bildirim güncelleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

module.exports = router;
