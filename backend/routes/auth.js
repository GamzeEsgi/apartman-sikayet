/**
 * Auth Routes - Kimlik Doğrulama İşlemleri
 * Bu dosya kullanıcı kayıt, giriş ve profil işlemlerini yönetir
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * Kullanıcı Kayıt Endpoint'i
 * POST /api/auth/kayit
 * Yeni kullanıcı oluşturur ve JWT token döner
 */
router.post('/kayit', async (req, res) => {
  try {
    // Request body'den kullanıcı bilgilerini al
    // Blok ve kat bilgileri de alınıyor
    const { ad, email, sifre, blok, kat, daire, telefon, rol } = req.body;

    // Email benzersizlik kontrolü - aynı email ile kayıt yapılamaz
    const mevcutKullanici = await User.findOne({ where: { email } });
    if (mevcutKullanici) {
      return res.status(400).json({ mesaj: 'Bu email zaten kullanılmaktadır' });
    }

    // Şifreyi bcrypt ile hashle (güvenlik için)
    const hashedSifre = await bcrypt.hash(sifre, 10);

    // Yeni kullanıcıyı veritabanına kaydet
    // DÜZELTME: Geçerli roller kontrol ediliyor, yönetici hariç
    const gecerliRoller = ['sakin', 'personel'];
    const kullaniciRolu = gecerliRoller.includes(rol) ? rol : 'sakin';

    const yeniKullanici = await User.create({
      ad,
      email,
      sifre: hashedSifre,
      blok: blok || 'A',
      kat: kat || '1',
      daire,
      telefon,
      rol: kullaniciRolu // Kullanıcının seçtiği rol (yönetici hariç)
    });

    // JWT token oluştur - 24 saat geçerli
    const token = jwt.sign(
      { id: yeniKullanici.id, email: yeniKullanici.email, rol: yeniKullanici.rol },
      process.env.JWT_SECRET || 'gizli_anahtar',
      { expiresIn: '24h' }
    );

    // Başarılı kayıt yanıtı
    res.status(201).json({
      mesaj: 'Kayıt başarılı',
      token,
      kullanici: {
        id: yeniKullanici.id,
        ad: yeniKullanici.ad,
        email: yeniKullanici.email,
        rol: yeniKullanici.rol
      }
    });
  } catch (err) {
    // Kayıt sırasında hata oluştu
    console.error('Kayıt hatası:', err);
    res.status(500).json({ mesaj: 'Kayıt hatası', hata: err.message });
  }
});

/**
 * Kullanıcı Giriş Endpoint'i
 * POST /api/auth/giris
 * Email ve şifre ile giriş yapar, JWT token döner
 */
router.post('/giris', async (req, res) => {
  try {
    // Request body'den giriş bilgilerini al
    const { email, sifre } = req.body;

    // Email ile kullanıcıyı bul
    const kullanici = await User.findOne({ where: { email } });
    if (!kullanici) {
      // Kullanıcı bulunamadı - güvenlik için aynı mesaj
      return res.status(401).json({ mesaj: 'Email veya şifre yanlış' });
    }

    // Şifre doğrulama - bcrypt ile karşılaştır
    const sifreKontrol = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreKontrol) {
      // Şifre yanlış - güvenlik için aynı mesaj
      return res.status(401).json({ mesaj: 'Email veya şifre yanlış' });
    }

    // Son giriş tarihini güncelle
    await kullanici.update({ son_giris: new Date() });

    // JWT token oluştur - 24 saat geçerli
    const token = jwt.sign(
      { id: kullanici.id, email: kullanici.email, rol: kullanici.rol },
      process.env.JWT_SECRET || 'gizli_anahtar',
      { expiresIn: '24h' }
    );

    // Başarılı giriş yanıtı
    res.json({
      mesaj: 'Giriş başarılı',
      token,
      kullanici: {
        id: kullanici.id,
        ad: kullanici.ad,
        email: kullanici.email,
        rol: kullanici.rol,
        daire: kullanici.daire
      }
    });
  } catch (err) {
    // Giriş sırasında hata oluştu
    console.error('Giriş hatası:', err);
    res.status(500).json({ mesaj: 'Giriş hatası', hata: err.message });
  }
});

/**
 * Profil Bilgileri Endpoint'i
 * GET /api/auth/profil
 * Giriş yapmış kullanıcının profil bilgilerini döner
 * Korumalı route - auth middleware gerektirir
 */
router.get('/profil', auth, async (req, res) => {
  try {
    // Şifre hariç kullanıcı bilgilerini getir
    const kullanici = await User.findByPk(req.user.id, {
      attributes: { exclude: ['sifre'] }
    });
    res.json(kullanici);
  } catch (err) {
    console.error('Profil getirme hatası:', err);
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

/**
 * Profil Güncelleme Endpoint'i
 * PUT /api/auth/profil-guncelle
 * Kullanıcı profil bilgilerini günceller
 */
router.put('/profil-guncelle', auth, async (req, res) => {
  try {
    const { ad, telefon, blok, kat, daire } = req.body;

    // Kullanıcıyı bul
    const kullanici = await User.findByPk(req.user.id);
    
    if (!kullanici) {
      return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcı bilgilerini güncelle
    await kullanici.update({
      ad: ad || kullanici.ad,
      telefon: telefon || kullanici.telefon,
      blok: blok || kullanici.blok,
      kat: kat || kullanici.kat,
      daire: daire || kullanici.daire
    });

    // Güncellenmiş kullanıcıyı döndür (şifre hariç)
    const guncelKullanici = await User.findByPk(req.user.id, {
      attributes: { exclude: ['sifre'] }
    });

    res.json({
      mesaj: 'Profil başarıyla güncellendi',
      kullanici: guncelKullanici
    });
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ mesaj: 'Güncelleme hatası', hata: err.message });
  }
});

module.exports = router;
