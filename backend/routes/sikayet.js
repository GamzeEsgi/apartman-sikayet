/**
 * Şikayet Routes - Şikayet İşlemleri
 * Şikayet oluşturma, listeleme ve detay görüntüleme
 */

const express = require('express');
const { Sikayet, Kategori, User, Bildirim } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * Kategorileri Getir
 * GET /api/sikayet/kategoriler
 * Tüm şikayet kategorilerini listeler (public endpoint)
 */
router.get('/kategoriler', async (req, res) => {
  try {
    const kategoriler = await Kategori.findAll();
    res.json(kategoriler);
  } catch (err) {
    console.error('Kategori getirme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Yeni Şikayet Oluştur
 * POST /api/sikayet/olustur
 * Giriş yapmış kullanıcı için yeni şikayet oluşturur
 */
router.post('/olustur', auth, async (req, res) => {
  try {
    // Request body'den şikayet bilgilerini al
    const { kategori_id, baslik, aciklama, fotoğraf, oncelik } = req.body;

    // Yeni şikayeti veritabanına kaydet
    const yeniSikayet = await Sikayet.create({
      sakin_id: req.user.id,  // Token'dan gelen kullanıcı ID'si
      kategori_id,
      baslik,
      aciklama,
      fotoğraf,               // Base64 formatında fotoğraf
      oncelik: oncelik || 'orta'
    });

    // Tüm yöneticilere bildirim gönder
    const yoneticiler = await User.findAll({ where: { rol: 'yonetici' } });
    for (let yonetici of yoneticiler) {
      await Bildirim.create({
        kullanic_id: yonetici.id,
        sikayet_id: yeniSikayet.id,
        baslik: 'Yeni Şikayet',
        mesaj: `Yeni bir şikayet açılmıştır: ${baslik}`
      });
    }

    res.status(201).json({
      mesaj: 'Şikayet başarıyla oluşturuldu',
      sikayet: yeniSikayet
    });
  } catch (err) {
    console.error('Şikayet oluşturma hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Kullanıcının Şikayetlerini Getir
 * GET /api/sikayet/benim-sikayetlerim
 * Giriş yapmış kullanıcının kendi şikayetlerini listeler
 */
router.get('/benim-sikayetlerim', auth, async (req, res) => {
  try {
    const sikayetler = await Sikayet.findAll({
      where: { sakin_id: req.user.id },
      include: [
        // Kategori bilgisini dahil et (düzeltilmiş alias)
        { model: Kategori, as: 'kategori' },
        // Atanan personel bilgisini dahil et (düzeltilmiş alias)
        { model: User, as: 'atananPersonel', attributes: ['ad', 'email'] }
      ],
      order: [['olusturma_tarihi', 'DESC']]
    });
    res.json(sikayetler);
  } catch (err) {
    console.error('Şikayet listeleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Şikayet Detayı Getir
 * GET /api/sikayet/:id
 * Belirli bir şikayetin detaylarını getirir
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const sikayet = await Sikayet.findByPk(req.params.id, {
      include: [
        // Şikayeti açan sakin bilgisi (düzeltilmiş alias)
        { model: User, as: 'sakin', attributes: ['ad', 'email', 'daire'] },
        // Kategori bilgisi (düzeltilmiş alias)
        { model: Kategori, as: 'kategori' },
        // Atanan personel bilgisi (düzeltilmiş alias)
        { model: User, as: 'atananPersonel', attributes: ['ad', 'email'] }
      ]
    });
    res.json(sikayet);
  } catch (err) {
    console.error('Şikayet detay hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

module.exports = router;
