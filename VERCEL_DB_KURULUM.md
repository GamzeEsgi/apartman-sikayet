# 🔧 Vercel Veritabanı Kurulum Rehberi

500 hatası alıyorsanız, muhtemelen veritabanı tabloları oluşturulmamıştır.

## ✅ Hızlı Çözüm

### 1. Veritabanı Tablolarını Oluşturun

Tarayıcıda şu URL'i açın:

```
https://apartman-sikayet-sistemi.vercel.app/api/init-db?secret=INIT_DB_SECRET_DEĞERİNİZ
```

**Eğer `INIT_DB_SECRET` ayarlamadıysanız:**

1. Vercel Dashboard → Settings → Environment Variables
2. Yeni variable ekleyin:
   - Key: `INIT_DB_SECRET`
   - Value: `güvenli_bir_secret_key_12345`
3. Save butonuna tıklayın
4. Yukarıdaki URL'i secret key ile çağırın

### 2. Başarı Kontrolü

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

### 3. Tekrar Deneyin

Veritabanı kurulduktan sonra kayıt olmayı tekrar deneyin.

---

## 🔍 Sorun Giderme

### "Database connection error"

- Vercel Dashboard → Storage sekmesine gidin
- Postgres database'inizin aktif olduğundan emin olun
- `POSTGRES_URL` environment variable'ının olduğundan emin olun

### "Unauthorized" hatası

- `INIT_DB_SECRET` environment variable'ını doğru ayarladığınızdan emin olun
- URL'deki secret key'in environment variable ile aynı olduğundan emin olun

### Hala 500 hatası alıyorsanız

1. Vercel Dashboard → Deployments → Logs
2. Hata mesajlarını kontrol edin
3. Veritabanı bağlantısını kontrol edin

---

**Not:** İlk kurulumdan sonra `/api/init-db` endpoint'ini tekrar çağırmanıza gerek yok. Tablolar zaten oluşturulmuş olacak.


