/**
 * Yönetici Routes - Yönetici Panel İşlemleri
 * Tüm şikayetleri görme, personele atama ve analiz dashboard
 */

const express = require('express');
const { Sikayet, User, Bildirim, Kategori, sequelize } = require('../models');
const { auth, yoneticiKontrol } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * Tüm Şikayetleri Getir
 * GET /api/yonetici/sikayetler
 * Durum ve kategoriye göre filtrelenebilir
 */
router.get('/sikayetler', auth, yoneticiKontrol, async (req, res) => {
  try {
    // Query parametrelerinden filtre değerlerini al
    const { durum, kategori } = req.query;
    let query = {};

    // Filtreleri uygula (varsa)
    if (durum) query.durum = durum;
    if (kategori) query.kategori_id = kategori;

    // Şikayetleri ilişkili verilerle birlikte getir
    const sikayetler = await Sikayet.findAll({
      where: query,
      include: [
        // Şikayeti açan sakin bilgisi (düzeltilmiş alias)
        { model: User, as: 'sakin', attributes: ['ad', 'email', 'daire', 'telefon'] },
        // Kategori bilgisi (düzeltilmiş alias)
        { model: Kategori, as: 'kategori' },
        // Atanan personel bilgisi (düzeltilmiş alias)
        { model: User, as: 'atananPersonel', attributes: ['ad', 'email'] }
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
 * Personel Listesini Getir
 * GET /api/yonetici/personeller
 * Şikayet atamak için personel listesi
 */
router.get('/personeller', auth, yoneticiKontrol, async (req, res) => {
  try {
    // Sadece personel rolündeki kullanıcıları getir
    const personeller = await User.findAll({
      where: { rol: 'personel' },
      attributes: ['id', 'ad', 'email', 'telefon']
    });
    res.json(personeller);
  } catch (err) {
    console.error('Personel listeleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Şikayeti Personele Ata
 * POST /api/yonetici/ata
 * Belirli bir şikayeti seçilen personele atar
 */
router.post('/ata', auth, yoneticiKontrol, async (req, res) => {
  try {
    // Request body'den atama bilgilerini al
    const { sikayet_id, personel_id, birim } = req.body;

    // Şikayeti bul
    const sikayet = await Sikayet.findByPk(sikayet_id);
    
    if (!sikayet) {
      return res.status(404).json({ mesaj: 'Şikayet bulunamadı' });
    }

    // Şikayeti güncelle - personele ata
    await sikayet.update({
      durum: 'atandi',
      atanan_personel_id: personel_id,
      atanan_birim: birim,
      guncelleme_tarihi: new Date()
    });

    // Personele bildirim gönder
    await Bildirim.create({
      kullanic_id: personel_id,
      sikayet_id: sikayet_id,
      baslik: 'Yeni Atama',
      mesaj: `Size yeni bir şikayet atanmıştır: ${sikayet.baslik}`
    });

    // Şikayeti açan sakine bildirim gönder
    await Bildirim.create({
      kullanic_id: sikayet.sakin_id,
      sikayet_id: sikayet_id,
      baslik: 'Şikayet Alındı',
      mesaj: `Şikayetiniz ilgili birime atanmıştır. ${birim} birimine ait personel tarafından çözülecektir.`
    });

    res.json({
      mesaj: 'Şikayet başarıyla atandı',
      sikayet
    });
  } catch (err) {
    console.error('Şikayet atama hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Tüm Kullanıcıları Getir
 * GET /api/yonetici/kullanicilar
 * Tüm kullanıcıları listeler
 */
router.get('/kullanicilar', auth, yoneticiKontrol, async (req, res) => {
  try {
    const kullanicilar = await User.findAll({
      attributes: { exclude: ['sifre'] },
      order: [['olusturma_tarihi', 'DESC']]
    });
    res.json(kullanicilar);
  } catch (err) {
    console.error('Kullanıcı listeleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Şikayete Not Ekle
 * PUT /api/yonetici/not-ekle/:id
 * Yönetici notu ekler ve kullanıcıya bildirim gönderir
 */
router.put('/not-ekle/:id', auth, yoneticiKontrol, async (req, res) => {
  try {
    const { not } = req.body;
    const sikayet = await Sikayet.findByPk(req.params.id);
    
    if (!sikayet) {
      return res.status(404).json({ mesaj: 'Şikayet bulunamadı' });
    }

    // Şikayete notu ekle
    await sikayet.update({
      not: not,
      guncelleme_tarihi: new Date()
    });

    // Kullanıcıya bildirim gönder
    await Bildirim.create({
      kullanic_id: sikayet.sakin_id,
      sikayet_id: sikayet.id,
      baslik: 'Yönetici Notu',
      mesaj: `Şikayetinize yönetici tarafından not eklendi: ${not}`
    });

    res.json({
      mesaj: 'Not başarıyla eklendi',
      sikayet
    });
  } catch (err) {
    console.error('Not ekleme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Analiz Dashboard Verileri
 * GET /api/yonetici/analiz
 * İstatistikler, kategori analizi ve personel performansı
 */
router.get('/analiz', auth, yoneticiKontrol, async (req, res) => {
  try {
    // Temel istatistikleri hesapla
    const toplam = await Sikayet.count();
    const cozulen = await Sikayet.count({ where: { durum: 'cozuldu' } });
    const cozuluyor = await Sikayet.count({ where: { durum: 'cozuluyor' } });
    const yeni = await Sikayet.count({ where: { durum: 'yeni' } });
    const atandi = await Sikayet.count({ where: { durum: 'atandi' } });
    const reddedildi = await Sikayet.count({ where: { durum: 'reddedildi' } });

    // Kategoriye göre şikayet sayılarını getir
    const kategoriAnaliz = await Sikayet.findAll({
      attributes: [
        'kategori_id',
        [sequelize.fn('COUNT', sequelize.col('Sikayet.id')), 'toplam']
      ],
      group: ['kategori_id'],
      include: [{ model: Kategori, as: 'kategori', attributes: ['ad'] }]
    });

    // Personel performansını getir
    const personelPerformansi = await Sikayet.findAll({
      attributes: [
        'atanan_personel_id',
        [sequelize.fn('COUNT', sequelize.col('Sikayet.id')), 'atanan']
      ],
      where: { atanan_personel_id: { [Op.ne]: null } },
      group: ['atanan_personel_id'],
      include: [{ model: User, as: 'atananPersonel', attributes: ['ad', 'email'] }]
    });

    // Çözülme oranını hesapla (0'a bölme hatasını önle)
    const cozulmeOrani = toplam > 0 
      ? ((cozulen / toplam) * 100).toFixed(2) + '%' 
      : '0%';

    res.json({
      istatistik: {
        toplam,
        cozulen,
        cozuluyor,
        yeni,
        atandi,
        reddedildi,
        cozulmeOrani
      },
      kategoriAnaliz,
      personelPerformansi
    });
  } catch (err) {
    console.error('Analiz hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

module.exports = router;
