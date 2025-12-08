/**
 * Kimlik Doğrulama Middleware'leri
 * JWT token kontrolü ve rol bazlı yetkilendirme
 * 
 * Bu middleware'ler korumalı route'lara erişimi kontrol eder
 */

const jwt = require('jsonwebtoken');

/**
 * Auth Middleware - JWT Token Doğrulama
 * Tüm korumalı route'lar için gerekli
 * 
 * Kullanım: router.get('/korunmus-route', auth, handler)
 * 
 * Header'da beklenen format: Authorization: Bearer <token>
 */
const auth = (req, res, next) => {
  try {
    // Authorization header'dan token'ı al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Token yoksa erişimi reddet
    if (!token) {
      return res.status(401).json({ mesaj: 'Token bulunamadı' });
    }

    // Token'ı doğrula ve decode et
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');
    
    // Kullanıcı bilgilerini request objesine ekle
    // Sonraki middleware'ler ve route handler'lar req.user ile erişebilir
    req.user = decoded;
    
    // Sonraki middleware'e geç
    next();
  } catch (err) {
    // Token geçersiz veya süresi dolmuş
    res.status(401).json({ mesaj: 'Geçersiz token' });
  }
};

/**
 * Yönetici Kontrol Middleware - Yönetici Yetkisi Kontrolü
 * Sadece yönetici rolüne sahip kullanıcılara izin verir
 * 
 * Kullanım: router.get('/yonetici-route', auth, yoneticiKontrol, handler)
 * 
 * Not: Bu middleware auth middleware'den SONRA kullanılmalı
 */
const yoneticiKontrol = (req, res, next) => {
  // Kullanıcı yönetici değilse erişimi reddet
  if (req.user.rol !== 'yonetici') {
    return res.status(403).json({ mesaj: 'Yetkisiz erişim - Yönetici yetkisi gerekli' });
  }
  next();
};

/**
 * Personel Kontrol Middleware - Personel/Yönetici Yetkisi Kontrolü
 * Personel ve yönetici rollerine izin verir
 * 
 * Kullanım: router.get('/personel-route', auth, personelKontrol, handler)
 * 
 * Not: Yöneticiler de personel route'larına erişebilir
 */
const personelKontrol = (req, res, next) => {
  // Kullanıcı personel veya yönetici değilse erişimi reddet
  if (req.user.rol !== 'personel' && req.user.rol !== 'yonetici') {
    return res.status(403).json({ mesaj: 'Yetkisiz erişim - Personel yetkisi gerekli' });
  }
  next();
};

// Middleware'leri dışa aktar
module.exports = { auth, yoneticiKontrol, personelKontrol };
