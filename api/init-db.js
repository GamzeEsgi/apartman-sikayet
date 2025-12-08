/**
 * Vercel Function - Veritabanı İlk Kurulum
 * Bu endpoint deploy sonrası bir kez çağrılarak veritabanı tablolarını oluşturur
 * 
 * Kullanım: https://your-app.vercel.app/api/init-db?secret=YOUR_SECRET_KEY
 */

const { sequelize } = require('../backend/models');
const { User, Kategori, Sikayet, Bildirim } = require('../backend/models');

module.exports = async (req, res) => {
  // Güvenlik: Sadece secret key ile çalışsın
  const secret = req.query.secret || req.headers['x-secret-key'];
  const expectedSecret = process.env.INIT_DB_SECRET || 'change-this-secret-key';

  if (secret !== expectedSecret) {
    return res.status(401).json({ 
      error: 'Unauthorized. Secret key gerekli.' 
    });
  }

  try {
    // Veritabanı tablolarını oluştur
    await sequelize.sync({ force: false, alter: true });
    
    // Kategorileri ekle (eğer yoksa) - seed.js ile aynı
    const kategoriler = [
      { ad: 'Bakım ve Onarım', aciklama: 'Genel bakım ve onarım işleri' },
      { ad: 'Elektrik', aciklama: 'Elektrik sistemi sorunları' },
      { ad: 'Su ve Kanalizasyon', aciklama: 'Su ve kanalizasyon sorunları' },
      { ad: 'Isıtma Sistemi', aciklama: 'Isıtma ve klima sorunları' },
      { ad: 'Kapıcı ve Güvenlik', aciklama: 'Kapıcı ve güvenlik hizmetleri' },
      { ad: 'Asansör', aciklama: 'Asansör arıza ve bakımı' },
      { ad: 'Çatı ve Cephe', aciklama: 'Çatı ve cephe sorunları' },
      { ad: 'Diğer', aciklama: 'Diğer konular' }
    ];

    for (const kategori of kategoriler) {
      await Kategori.findOrCreate({ 
        where: { ad: kategori.ad }, 
        defaults: kategori 
      });
    }

    // Test kullanıcılarını ekle (eğer yoksa)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        ad: 'Admin Yönetici',
        email: 'admin@test.com',
        sifre: hashedPassword,
        blok: 'A',
        kat: '1',
        daire: '001',
        telefon: '5550000001',
        rol: 'yonetici'
      },
      {
        ad: 'Ahmet Personel',
        email: 'personel@test.com',
        sifre: hashedPassword,
        blok: 'A',
        kat: '2',
        daire: '002',
        telefon: '5550000002',
        rol: 'personel'
      },
      {
        ad: 'Mehmet Sakin',
        email: 'sakin@test.com',
        sifre: hashedPassword,
        blok: 'B',
        kat: '3',
        daire: '005',
        telefon: '5550000003',
        rol: 'sakin'
      }
    ];

    for (const user of users) {
      await User.findOrCreate({ 
        where: { email: user.email }, 
        defaults: user 
      });
    }

    const kategoriCount = await Kategori.count();
    const userCount = await User.count();

    res.json({ 
      success: true,
      message: 'Veritabanı başarıyla kuruldu!',
      kategoriler: kategoriCount,
      kullanicilar: userCount,
      testHesaplari: {
        yonetici: 'admin@test.com / 123456',
        personel: 'personel@test.com / 123456',
        sakin: 'sakin@test.com / 123456'
      }
    });

  } catch (error) {
    console.error('Veritabanı kurulum hatası:', error);
    res.status(500).json({ 
      error: 'Veritabanı kurulumu başarısız',
      message: error.message 
    });
  }
};

