# 🚀 Vercel'de Deploy Etme Rehberi

Bu projeyi Vercel'de yayınlamak için aşağıdaki adımları takip edin.

## ⚠️ ÖNEMLİ: Veritabanı Sorunu

**SQLite Vercel'de çalışmaz!** Vercel'de dosya sistemi kalıcı değildir. Bu yüzden bir **cloud veritabanı** kullanmanız gerekiyor.

### Önerilen Veritabanı Seçenekleri:

1. **Vercel Postgres** (Önerilen - En kolay)
2. **PlanetScale** (MySQL uyumlu)
3. **Supabase** (PostgreSQL)
4. **Railway** (PostgreSQL)
5. **Neon** (PostgreSQL)

## 📋 Deploy Adımları

### 1. GitHub'a Push Edin

Projenizi GitHub'a push edin (eğer henüz yapmadıysanız):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel'de Proje Oluşturun

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Proje ayarlarını yapılandırın

### 3. Veritabanı Kurulumu

#### Seçenek A: Vercel Postgres (Önerilen)

1. Vercel Dashboard'da projenize gidin
2. "Storage" sekmesine tıklayın
3. "Create Database" → "Postgres" seçin
4. Database oluşturun
5. Connection string'i kopyalayın

#### Seçenek B: PlanetScale

1. [PlanetScale](https://planetscale.com) hesabı oluşturun
2. Yeni bir database oluşturun
3. Connection string'i alın

#### Seçenek C: Supabase

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Database connection string'i alın

### 4. Environment Variables (Ortam Değişkenleri) Ayarlayın

Vercel Dashboard'da projenize gidin → Settings → Environment Variables:

**Zorunlu Değişkenler:**
```
# JWT Secret (güvenli bir key oluşturun)
JWT_SECRET=apartman_sikayet_gizli_anahtar_2024_degistirin_bu_anahtari

# Veritabanı Connection String (Vercel Postgres önerilir)
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require

# Frontend API URL
REACT_APP_API_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

**Opsiyonel Değişkenler:**
```
# Veritabanı init için secret key
INIT_DB_SECRET=your-secret-key-here

# Frontend URL (CORS için)
FRONTEND_URL=https://your-app.vercel.app

# Veritabanı logging (debug için)
DB_LOGGING=false
```

**Not:** `POSTGRES_URL` Vercel Postgres kullanıyorsanız otomatik olarak eklenir. Manuel eklemeniz gerekmez.

### 5. Veritabanı Yapılandırması

✅ **Hazır!** Veritabanı yapılandırması zaten Vercel Postgres için optimize edilmiştir.

`backend/config/database.js` dosyası otomatik olarak:
- `POSTGRES_URL` varsa → Vercel Postgres kullanır
- `DATABASE_URL` varsa → PostgreSQL veya MySQL kullanır (otomatik algılar)
- Hiçbiri yoksa → SQLite kullanır (sadece local development)

**Ekstra yapılandırma gerekmez!** Sadece environment variable'ları ayarlayın.

### 6. Veritabanı Tablolarını Oluşturun

Deploy sonrası veritabanı tablolarını oluşturmak için:

**Seçenek 1: Init-DB Endpoint'i (Önerilen)**

Deploy sonrası tarayıcıda veya curl ile:

```bash
# Secret key'i environment variable'da ayarladığınızdan emin olun
curl "https://your-app.vercel.app/api/init-db?secret=YOUR_SECRET_KEY"
```

Veya tarayıcıda:
```
https://your-app.vercel.app/api/init-db?secret=YOUR_SECRET_KEY
```

Bu endpoint:
- ✅ Veritabanı tablolarını oluşturur
- ✅ Kategorileri ekler
- ✅ Test kullanıcılarını oluşturur

**Seçenek 2: Vercel CLI ile**

```bash
npm i -g vercel
vercel login
vercel env pull .env.local
cd backend
npm run seed
```

**Seçenek 3: Manuel SQL**

Vercel Postgres dashboard'dan SQL editor'ü kullanarak tabloları manuel oluşturabilirsiniz.

### 7. Deploy

1. Vercel Dashboard'da "Deploy" butonuna tıklayın
2. Veya GitHub'a push yaptığınızda otomatik deploy olacak

### 8. İlk Veri Yükleme (Seed)

Deploy sonrası test kullanıcılarını oluşturmak için:

1. Vercel Dashboard → Functions → `api/init-db` (eğer oluşturduysanız)
2. Veya local'de connection string ile seed çalıştırın

## 🔧 Sorun Giderme

### "Database connection error"

- Environment variable'ların doğru ayarlandığından emin olun
- Connection string'in doğru formatta olduğunu kontrol edin
- SSL ayarlarının doğru olduğundan emin olun

### "Cannot find module"

- `package.json` dosyalarında tüm dependencies'in olduğundan emin olun
- `node_modules` klasörünü `.gitignore`'a ekleyin (zaten olmalı)

### Frontend API'ye bağlanamıyor

- `REACT_APP_API_URL` environment variable'ının doğru ayarlandığından emin olun
- CORS ayarlarını kontrol edin (`backend/server.js`)

## 📝 Notlar

- Vercel'de SQLite **çalışmaz**, mutlaka cloud veritabanı kullanın
- Environment variable'ları production, preview ve development için ayrı ayrı ayarlayabilirsiniz
- İlk deploy biraz zaman alabilir
- Vercel Postgres ücretsiz planında sınırlı kaynak var

## 🎉 Başarılı Deploy Sonrası

Deploy başarılı olduktan sonra:

1. Veritabanı tablolarını oluşturun
2. Test kullanıcılarını ekleyin (seed)
3. Uygulamanızı test edin

Test hesapları:
- Yönetici: admin@test.com / 123456
- Personel: personel@test.com / 123456
- Sakin: sakin@test.com / 123456

---

**Sorularınız için:** Vercel dokümantasyonuna bakın veya GitHub Issues açın.

