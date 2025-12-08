/**
 * Apartman Şikayet Yönetim Sistemi - Ana Sunucu Dosyası
 * Express.js tabanlı REST API sunucusu
 * 
 * Bu dosya uygulamanın giriş noktasıdır ve:
 * - Express uygulamasını yapılandırır
 * - Middleware'leri yükler
 * - Veritabanı bağlantısını başlatır
 * - API route'larını tanımlar
 * - Sunucuyu başlatır
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

// Ortam değişkenlerini .env dosyasından yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// ============================================
// MIDDLEWARE YAPILANDIRMASI
// ============================================

// CORS - Cross-Origin Resource Sharing
// Frontend'in farklı bir porttan API'ye erişmesine izin verir
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://apartman-sikayet-sistemi.vercel.app'
].filter(Boolean); // null/undefined değerleri filtrele

app.use(cors({
  origin: function (origin, callback) {
    // Origin yoksa (mobile app, Postman vb.) veya izin verilen listede ise
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // Production'da tüm origin'lere izin ver (güvenlik için daha sonra kısıtlanabilir)
      callback(null, true);
    }
  },
  credentials: true
}));

// JSON body parser - JSON formatındaki request body'leri parse eder
app.use(express.json({ limit: '50mb' })); // 50mb limit - Base64 fotoğraflar için

// URL-encoded body parser - Form verilerini parse eder
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// VERİTABANI SENKRONİZASYONU
// ============================================

// Sequelize modellerini veritabanı ile senkronize et
// Production'da alter: false (veri kaybını önlemek için)
// Development'ta alter: true (tabloları güncellemek için)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Vercel'de tabloları oluştur (eğer yoksa)
sequelize.sync({ 
  alter: false, // Production'da alter kullanma
  force: false // Hiçbir zaman force kullanma (veri kaybı olur)
})
  .then(() => {
    console.log('✅ Veritabanı tabloları hazır');
  })
  .catch(err => {
    console.error('❌ Veritabanı sync hatası:', err.message);
    // Production'da sync hatası kritik değil (tablolar zaten var olabilir)
    if (!isProduction) {
      console.error('Detay:', err);
    }
  });

// ============================================
// API ROUTE'LARI
// ============================================

// Kimlik doğrulama route'ları (kayıt, giriş, profil)
app.use('/api/auth', require('./routes/auth'));

// Şikayet route'ları (oluşturma, listeleme)
app.use('/api/sikayet', require('./routes/sikayet'));

// Yönetici route'ları (şikayet atama, analiz)
app.use('/api/yonetici', require('./routes/yonetici'));

// Personel route'ları (şikayet güncelleme, bildirimler)
app.use('/api/personel', require('./routes/personel'));

// Analiz route'ları (istatistikler, raporlar)
app.use('/api/analiz', require('./routes/analiz'));

// ============================================
// ANA ROUTE
// ============================================

// API sağlık kontrolü endpoint'i
app.get('/', (req, res) => {
  res.json({ 
    message: 'Apartman Şikayet Sistemi API çalışıyor',
    version: '1.0.0',
    status: 'active'
  });
});

// ============================================
// SUNUCUYU BAŞLAT
// ============================================

// Port numarasını ortam değişkeninden al veya varsayılan 5000 kullan
const PORT = process.env.PORT || 5000;

// Vercel serverless functions için app'i export et
// Eğer Vercel'de çalışıyorsa listen() çağrılmayacak
if (process.env.VERCEL !== '1') {
  // Sunucuyu başlat ve dinlemeye başla (sadece local development için)
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} adresinde çalışıyor`);
    console.log('📚 API Dokümantasyonu: README.md dosyasına bakın');
  });
}

// Vercel için app'i export et
module.exports = app;
