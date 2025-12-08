/**
 * Veritabanı Seed Dosyası
 * Başlangıç verilerini oluşturur:
 * - Şikayet kategorileri
 * - Test kullanıcıları (yönetici, personel, sakin)
 * 
 * Kullanım: node seed.js
 */

const bcrypt = require('bcryptjs');
const { User, Kategori, sequelize } = require('./models');

/**
 * Seed fonksiyonu
 * Veritabanını başlangıç verileriyle doldurur
 */
async function seed() {
  try {
    console.log('🌱 Seed işlemi başlıyor...\n');

    // Veritabanı tablolarını senkronize et
    await sequelize.sync({ alter: true });
    console.log('✅ Veritabanı tabloları hazır\n');

    // ============================================
    // KATEGORİLERİ OLUŞTUR
    // ============================================
    
    // Apartmanlarda sık karşılaşılan sorun kategorileri
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

    // Kategorileri ekle (varsa güncelleme, findOrCreate ile)
    for (const kat of kategoriler) {
      await Kategori.findOrCreate({ where: { ad: kat.ad }, defaults: kat });
    }
    console.log('✅ Kategoriler oluşturuldu');

    // ============================================
    // TEST KULLANICILARI OLUŞTUR
    // ============================================

    // Tüm test kullanıcıları için aynı şifre (123456)
    const hashedSifre = await bcrypt.hash('123456', 10);

    // Test kullanıcıları - her rolden bir tane
    const users = [
      { 
        ad: 'Admin Yönetici', 
        email: 'admin@test.com', 
        sifre: hashedSifre, 
        blok: 'A',
        kat: '1',
        daire: '001', 
        telefon: '5550000001', 
        rol: 'yonetici' 
      },
      { 
        ad: 'Ahmet Personel', 
        email: 'personel@test.com', 
        sifre: hashedSifre, 
        blok: 'A',
        kat: '2',
        daire: '002', 
        telefon: '5550000002', 
        rol: 'personel' 
      },
      { 
        ad: 'Mehmet Sakin', 
        email: 'sakin@test.com', 
        sifre: hashedSifre, 
        blok: 'B',
        kat: '3',
        daire: '005', 
        telefon: '5550000003', 
        rol: 'sakin' 
      }
    ];

    // Kullanıcıları ekle (varsa atlat)
    for (const user of users) {
      await User.findOrCreate({ where: { email: user.email }, defaults: user });
    }
    console.log('✅ Test kullanıcıları oluşturuldu');

    // ============================================
    // BİLGİLENDİRME
    // ============================================

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Seed işlemi başarıyla tamamlandı!\n');
    console.log('📝 Test Hesapları:');
    console.log('─'.repeat(50));
    console.log('👔 Yönetici : admin@test.com     / Şifre: 123456');
    console.log('🔧 Personel : personel@test.com  / Şifre: 123456');
    console.log('👤 Sakin    : sakin@test.com     / Şifre: 123456');
    console.log('─'.repeat(50));
    console.log('\n🚀 Sunucuyu başlatmak için: npm run dev');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed hatası:', err);
    process.exit(1);
  }
}

// Seed fonksiyonunu çalıştır
seed();
