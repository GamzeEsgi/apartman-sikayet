# 🏢 Apartman Şikayet Yönetim Sistemi

Apartman sakinlerinin şikayet oluşturup, yöneticilerin bu şikayetleri personele atayıp, personelin çözüm durumu bildirebildiği, sakinin bildirim alabileceği ve yöneticinin analiz paneli görebildiği modern web uygulaması.

## 🌟 Özellikler

### 👤 Sakin (Kullanıcı)
- ✅ Kayıt ve Giriş
- ✅ Şikayet Oluşturma (Kategori, Başlık, Açıklama, Fotoğraf)
- ✅ Şikayetleri Görüntüleme
- ✅ Bildirim Alma (Durumu değişince)
- ✅ Profil Görüntüleme

### 👔 Yönetici
- ✅ Tüm Şikayetleri Görüntüleme
- ✅ Şikayetleri Personele Atama
- ✅ Analiz Dashboard
  - Toplam Şikayet Sayısı
  - Çözülen Şikayet Sayısı
  - Çözülme Oranı
  - Kategoriye göre İstatistikler
  - Personel Performansı

### 🔧 Personel
- ✅ Atanan Şikayetleri Görüntüleme
- ✅ Şikayet Durumunu Güncelleme (Çözülüyor, Çözüldü, Reddedildi)
- ✅ Çözüm Notu Yazma
- ✅ Bildirim Sistemi
- ✅ Profil Görüntüleme

## 🛠️ Teknoloji Stack

### Backend
- **Node.js & Express** - REST API
- **SQLite** - Veritabanı (Local development için)
- **PostgreSQL/MySQL** - Cloud veritabanı (Production/Vercel için)
- **Sequelize** - ORM
- **JWT** - Kimlik Doğrulama
- **Bcryptjs** - Şifre Hashleme
- **Multer** - Dosya Yükleme

### Frontend
- **React** - UI Framework
- **CSS3** - Styling
- **Fetch API** - HTTP Requests

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Backend Kurulum

1. Backend klasörüne git
```bash
cd backend
```

2. Bağımlılıkları yükle
```bash
npm install
```

3. `.env` dosyasını oluştur (otomatik oluşturulmuştur)
```env
PORT=5000
JWT_SECRET=apartman_sikayet_gizli_anahtar_2024
NODE_ENV=development
```

4. Veritabanını ve test kullanıcılarını oluştur
```bash
node seed.js
```

5. Server'ı başlat
```bash
npm run dev
```

### Frontend Kurulum

1. Frontend klasörüne git
```bash
cd backend/frontend
```

2. Bağımlılıkları yükle
```bash
npm install
```

3. Uygulamayı başlat
```bash
npm start
```

## ☁️ Vercel'de Deploy Etme

Projeyi Vercel'de yayınlamak için detaylı rehber: **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

### Hızlı Başlangıç:

1. **GitHub'a push edin**
2. **Vercel Dashboard'da yeni proje oluşturun**
3. **Cloud veritabanı ekleyin** (Vercel Postgres, PlanetScale, Supabase vb.)
4. **Environment variables ayarlayın:**
   - `JWT_SECRET` - Güvenli bir secret key
   - `POSTGRES_URL` veya `DATABASE_URL` - Veritabanı connection string
   - `REACT_APP_API_URL` - Frontend için API URL (örn: `https://your-app.vercel.app`)
5. **Deploy edin**

⚠️ **ÖNEMLİ:** SQLite Vercel'de çalışmaz! Mutlaka cloud veritabanı kullanın.

Detaylı adımlar için [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) dosyasına bakın.

## 🔐 Test Hesapları

Seed işleminden sonra şu hesaplarla giriş yapabilirsiniz:

| Rol | Email | Şifre |
|-----|-------|-------|
| Yönetici | admin@test.com | 123456 |
| Personel | personel@test.com | 123456 |
| Sakin | sakin@test.com | 123456 |

## 📡 API Endpoints

### Auth Routes (Kimlik Doğrulama)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/kayit` | Yeni kullanıcı kaydı |
| POST | `/api/auth/giris` | Kullanıcı girişi |
| GET | `/api/auth/profil` | Profil bilgileri (Protected) |

### Şikayet Routes
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/sikayet/kategoriler` | Kategorileri listele |
| POST | `/api/sikayet/olustur` | Yeni şikayet oluştur (Protected) |
| GET | `/api/sikayet/benim-sikayetlerim` | Kendi şikayetlerini listele (Protected) |
| GET | `/api/sikayet/:id` | Şikayet detayı (Protected) |

### Yönetici Routes (Sadece Yönetici)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/yonetici/sikayetler` | Tüm şikayetleri listele |
| GET | `/api/yonetici/personeller` | Personel listesi |
| POST | `/api/yonetici/ata` | Şikayeti personele ata |
| GET | `/api/yonetici/analiz` | Analiz verileri |

### Personel Routes (Personel ve Yönetici)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/personel/sikayetlerim` | Atanan şikayetleri listele |
| PUT | `/api/personel/durum-guncelle/:id` | Şikayet durumunu güncelle |
| GET | `/api/personel/bildirimler` | Bildirimleri listele |
| PUT | `/api/personel/bildirim-oku/:id` | Bildirimi okundu işaretle |

## 📊 Veritabanı Şeması

### User (Kullanıcı) Tablosu
```
- id: INTEGER (Primary Key)
- ad: STRING
- email: STRING (Unique)
- sifre: STRING (Hashed)
- daire: STRING
- telefon: STRING
- rol: ENUM ('sakin', 'personel', 'yonetici')
- olusturma_tarihi: DATE
- son_giris: DATE
```

### Sikayet (Şikayet) Tablosu
```
- id: INTEGER (Primary Key)
- sakin_id: INTEGER (Foreign Key -> User)
- kategori_id: INTEGER (Foreign Key -> Kategori)
- baslik: STRING
- aciklama: TEXT
- fotoğraf: TEXT (Base64)
- durum: ENUM ('yeni', 'atandi', 'cozuluyor', 'cozuldu', 'reddedildi')
- oncelik: ENUM ('dusuk', 'orta', 'yuksek')
- atanan_birim: STRING
- atanan_personel_id: INTEGER (Foreign Key -> User)
- not: TEXT
- cozum_tarihi: DATE
- olusturma_tarihi: DATE
- guncelleme_tarihi: DATE
```

### Kategori Tablosu
```
- id: INTEGER (Primary Key)
- ad: STRING (Unique)
- aciklama: TEXT
- olusturma_tarihi: DATE
```

### Bildirim Tablosu
```
- id: INTEGER (Primary Key)
- kullanic_id: INTEGER (Foreign Key -> User)
- sikayet_id: INTEGER (Foreign Key -> Sikayet)
- baslik: STRING
- mesaj: TEXT
- okunanmis: BOOLEAN
- olusturma_tarihi: DATE
```

## 🔄 Kullanım Akışı

```
1. Sakin Kayıt/Giriş
      ↓
2. Şikayet Oluştur (Kategori + Fotoğraf)
      ↓
3. Yöneticiye Bildirim Gider
      ↓
4. Yönetici Şikayeti Personele Atar
      ↓
5. Personele ve Sakine Bildirim Gider
      ↓
6. Personel Durumu Günceller (Çözülüyor/Çözüldü)
      ↓
7. Sakine Bildirim Gider
      ↓
8. Yönetici Dashboard'da İstatistikleri Görür
```

## ⚠️ Önemli Notlar

- JWT token 24 saat geçerlidir
- Şikayet fotoğrafları Base64 formatında kaydedilir
- SQLite veritabanı dosyası: `backend/apartman.db`
- Tüm tarihler otomatik kaydedilir
- Personel performansı: çözülen/atanan şikayet oranı

## 🐛 Bilinen Sorunlar ve Çözümler

### "Sunucuya bağlanılamadı" Hatası
**Sebep:** Backend sunucusu çalışmıyor
**Çözüm:** 
```bash
cd backend
npm run dev
```

### Veritabanı Hatası
**Çözüm:** Seed dosyasını çalıştırın
```bash
node seed.js
```

## 📁 Proje Yapısı

```
projeler/
├── api/
│   ├── index.js              # Vercel serverless function handler
│   └── init-db.js            # Veritabanı ilk kurulum endpoint'i
├── backend/
│   ├── config/
│   │   ├── database.js       # Veritabanı bağlantısı (local + cloud)
│   │   └── database-vercel.js # Vercel için alternatif config
│   ├── middleware/
│   │   └── auth.js           # JWT doğrulama
│   ├── models/
│   │   └── index.js          # Sequelize modelleri
│   ├── routes/
│   │   ├── auth.js           # Kimlik doğrulama
│   │   ├── sikayet.js        # Şikayet işlemleri
│   │   ├── yonetici.js       # Yönetici işlemleri
│   │   ├── personel.js       # Personel işlemleri
│   │   └── analiz.js         # Analiz verileri
│   ├── frontend/             # React uygulaması
│   │   └── src/
│   │       ├── components/   # React bileşenleri
│   │       ├── App.jsx       # Ana uygulama
│   │       └── App.css       # Stiller
│   ├── server.js             # Express sunucusu
│   ├── seed.js               # Test verileri
│   ├── .env                  # Ortam değişkenleri
│   └── package.json
├── vercel.json               # Vercel deployment konfigürasyonu
├── VERCEL_DEPLOY.md          # Vercel deploy detaylı rehberi
└── README.md
```

## 📞 İletişim ve Destek

Sorularınız için iletişime geçebilirsiniz.

---
**Geliştirici:** Apartman Şikayet Yönetim Sistemi Projesi
