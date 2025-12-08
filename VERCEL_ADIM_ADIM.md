# 🚀 Vercel'de Yayınlama - Adım Adım Rehber

Bu rehber, projenizi Vercel'de yayınlamak için tüm adımları detaylı olarak açıklar.

## 📋 Ön Hazırlık

### 1. GitHub Hesabı ve Repository

✅ **GitHub hesabınız var mı?**
- Yoksa: https://github.com adresinden ücretsiz hesap oluşturun

✅ **Projeniz GitHub'da mı?**
- Yoksa: Aşağıdaki adımları takip edin

---

## 🔵 ADIM 1: Projeyi GitHub'a Yükleyin

### 1.1. Git Repository Oluşturun

**Terminal/PowerShell'de proje klasörünüze gidin:**

```bash
cd C:\projeler
```

**Git repository başlatın:**

```bash
git init
```

### 1.2. Dosyaları Ekleyin

```bash
git add .
```

### 1.3. İlk Commit Yapın

```bash
git commit -m "Vercel deployment için hazır"
```

### 1.4. GitHub'da Yeni Repository Oluşturun

1. https://github.com adresine gidin
2. Sağ üstteki **"+"** butonuna tıklayın
3. **"New repository"** seçin
4. Repository adı girin (örn: `apartman-sikayet-sistemi`)
5. **Public** veya **Private** seçin
6. **"Create repository"** butonuna tıklayın
7. **"Quick setup"** bölümündeki komutları kopyalayın (örnek aşağıda)

### 1.5. GitHub'a Push Edin

GitHub'da oluşturduğunuz repository'nin sayfasında gösterilen komutları çalıştırın:

```bash
# Örnek (sizin repository URL'iniz farklı olacak):
git remote add origin https://github.com/KULLANICI_ADINIZ/apartman-sikayet-sistemi.git
git branch -M main
git push -u origin main
```

**Not:** İlk kez push yapıyorsanız GitHub kullanıcı adı ve şifre isteyebilir.

---

## 🔵 ADIM 2: Vercel Hesabı Oluşturun

### 2.1. Vercel'e Kaydolun

1. https://vercel.com adresine gidin
2. **"Sign Up"** butonuna tıklayın
3. **GitHub ile giriş yapın** (önerilen - en kolay yol)
4. GitHub hesabınızı bağlayın ve izinleri verin

### 2.2. Dashboard'a Gidin

Giriş yaptıktan sonra otomatik olarak dashboard'a yönlendirileceksiniz.

---

## 🔵 ADIM 3: Vercel'de Yeni Proje Oluşturun

### 3.1. Proje Ekle

1. Vercel Dashboard'da **"Add New..."** veya **"New Project"** butonuna tıklayın
2. **"Import Git Repository"** seçeneğini seçin
3. GitHub repository'nizi listeden seçin
4. **"Import"** butonuna tıklayın

### 3.2. Proje Ayarları

Vercel otomatik olarak projenizi algılayacak. Ayarları kontrol edin:

- **Framework Preset:** Otomatik algılanır (React)
- **Root Directory:** `.` (kök dizin)
- **Build Command:** Otomatik
- **Output Directory:** `backend/frontend/build`

**Değişiklik yapmanıza gerek yok!** Vercel otomatik algılayacak.

---

## 🔵 ADIM 4: Veritabanı Ekleyin (Vercel Postgres)

### 4.1. Storage'a Git

1. Proje sayfasında **"Storage"** sekmesine tıklayın
2. Veya sol menüden **"Storage"** → **"Create Database"**

### 4.2. Postgres Oluştur

1. **"Create Database"** butonuna tıklayın
2. **"Postgres"** seçin
3. Database adı girin (örn: `apartman-db`)
4. **Region** seçin (en yakın bölgeyi seçin)
5. **"Create"** butonuna tıklayın

### 4.3. Connection String'i Kopyalayın

Database oluşturulduktan sonra:
- **"Settings"** sekmesine gidin
- **"Connection String"** bölümündeki değeri kopyalayın
- Bu değer otomatik olarak `POSTGRES_URL` environment variable olarak eklenir ✅

---

## 🔵 ADIM 5: Environment Variables (Ortam Değişkenleri) Ayarlayın

### 5.1. Settings'e Git

1. Proje sayfasında **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçin

### 5.2. Gerekli Değişkenleri Ekleyin

Aşağıdaki değişkenleri tek tek ekleyin:

#### ✅ JWT_SECRET (Zorunlu)

```
Key: JWT_SECRET
Value: apartman_sikayet_gizli_anahtar_2024_degistirin_bu_anahtari
```

**Önemli:** Production için güçlü bir secret key oluşturun! Örnek:
```
apartman_sikayet_2024_xyz123_abc456_gizli_anahtar
```

#### ✅ REACT_APP_API_URL (Zorunlu)

```
Key: REACT_APP_API_URL
Value: https://your-app-name.vercel.app
```

**Not:** Deploy sonrası gerçek URL'inizi buraya yazacaksınız. Şimdilik placeholder bırakabilirsiniz.

#### ✅ INIT_DB_SECRET (Opsiyonel - Önerilir)

```
Key: INIT_DB_SECRET
Value: güvenli_bir_secret_key_12345
```

Bu key'i veritabanı kurulumu için kullanacaksınız.

#### ✅ NODE_ENV (Otomatik)

```
Key: NODE_ENV
Value: production
```

### 5.3. Environment Seçimi

Her değişken için:
- ✅ **Production** işaretleyin
- ✅ **Preview** işaretleyin (opsiyonel)
- ✅ **Development** işaretleyin (opsiyonel)

### 5.4. Kaydet

Her değişkeni ekledikten sonra **"Save"** butonuna tıklayın.

---

## 🔵 ADIM 6: İlk Deploy

### 6.1. Deploy Başlat

1. **"Deployments"** sekmesine gidin
2. **"Deploy"** butonuna tıklayın
3. Veya GitHub'a push yaptığınızda otomatik deploy başlar

### 6.2. Deploy Sürecini İzleyin

- Build loglarını görebilirsiniz
- İlk deploy 2-5 dakika sürebilir
- Başarılı olduğunda yeşil tik görünecek

### 6.3. Deploy Sonrası

Deploy tamamlandığında:
- **"Visit"** butonuna tıklayarak sitenizi görüntüleyin
- URL şu formatta olacak: `https://your-app-name.vercel.app`

---

## 🔵 ADIM 7: Veritabanını Başlatın

### 7.1. REACT_APP_API_URL'i Güncelleyin

1. Gerçek Vercel URL'inizi kopyalayın (örn: `https://apartman-sikayet.vercel.app`)
2. **Settings** → **Environment Variables**
3. `REACT_APP_API_URL` değerini gerçek URL ile güncelleyin
4. **"Save"** butonuna tıklayın
5. Yeni bir deploy tetikleyin (Settings'te **"Redeploy"** butonu var)

### 7.2. Veritabanı Tablolarını Oluşturun

Tarayıcıda şu URL'i açın (veya curl ile çağırın):

```
https://your-app-name.vercel.app/api/init-db?secret=INIT_DB_SECRET_DEĞERİNİZ
```

**Örnek:**
```
https://apartman-sikayet.vercel.app/api/init-db?secret=güvenli_bir_secret_key_12345
```

### 7.3. Başarı Kontrolü

Başarılı olduğunda şu mesajı göreceksiniz:

```json
{
  "success": true,
  "message": "Veritabanı başarıyla kuruldu!",
  "kategoriler": 8,
  "kullanicilar": 3,
  "testHesaplari": {
    "yonetici": "admin@test.com / 123456",
    "personel": "personel@test.com / 123456",
    "sakin": "sakin@test.com / 123456"
  }
}
```

---

## 🔵 ADIM 8: Test Edin

### 8.1. Sitenizi Açın

Vercel URL'inize gidin: `https://your-app-name.vercel.app`

### 8.2. Giriş Yapın

Test hesaplarından biriyle giriş yapın:
- **Yönetici:** admin@test.com / 123456
- **Personel:** personel@test.com / 123456
- **Sakin:** sakin@test.com / 123456

### 8.3. Özellikleri Test Edin

- ✅ Şikayet oluşturma
- ✅ Şikayetleri görüntüleme
- ✅ Bildirimler
- ✅ Yönetici paneli
- ✅ Personel paneli

---

## ✅ Başarılı! Projeniz Yayında

Artık projeniz canlıda! 🎉

### 📝 Önemli Notlar

1. **Otomatik Deploy:** GitHub'a push yaptığınızda otomatik deploy olur
2. **Custom Domain:** Settings'ten kendi domain'inizi ekleyebilirsiniz
3. **Environment Variables:** Production'da değişiklik yapmak için Settings → Environment Variables
4. **Logs:** Deployments sekmesinden logları görüntüleyebilirsiniz

### 🔧 Sorun Giderme

#### "Database connection error"
- `POSTGRES_URL` environment variable'ının doğru olduğundan emin olun
- Vercel Postgres'in aktif olduğunu kontrol edin

#### "Cannot find module"
- `package.json` dosyalarında tüm dependencies'in olduğundan emin olun
- Deploy loglarını kontrol edin

#### Frontend API'ye bağlanamıyor
- `REACT_APP_API_URL` değerinin doğru olduğundan emin olun
- Deploy sonrası yeni bir build gerekebilir

#### Veritabanı tabloları yok
- `/api/init-db` endpoint'ini çağırdığınızdan emin olun
- Secret key'in doğru olduğunu kontrol edin

---

## 📞 Yardım

Sorun yaşarsanız:
1. Vercel Dashboard'daki **"Deployments"** sekmesinden logları kontrol edin
2. Vercel dokümantasyonuna bakın: https://vercel.com/docs
3. GitHub Issues açabilirsiniz

---

**Hazır! Projeniz Vercel'de yayında! 🚀**

