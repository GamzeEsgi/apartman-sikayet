const mongoose = require('mongoose');
const { Kategori } = require('./models');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apartman-sikayetler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB bağlandı, kategoriler ekleniyor...');
  
  const kategoriler = [
    { ad: 'Bakım', aciklama: 'Bina bakım ve onarım işleri' },
    { ad: 'Elektrik', aciklama: 'Elektrik tesisatı ve aydınlatma sorunları' },
    { ad: 'Su', aciklama: 'Su tesisatı ve su şebekesi sorunları' },
    { ad: 'Güvenlik', aciklama: 'Güvenlik ve kapıcı ile ilgili sorunlar' },
    { ad: 'Asansör', aciklama: 'Asansör arıza ve bakım işleri' },
    { ad: 'Temizlik', aciklama: 'Ortak alanların temizliği ile ilgili şikayetler' },
    { ad: 'Gürültü', aciklama: 'Komşu gürültüsü ve ses problemi' },
    { ad: 'Çevre', aciklama: 'Çevre düzeni ve bahçe ile ilgili sorunlar' },
    { ad: 'Park', aciklama: 'Otopark yönetimi ve araç parklama sorunları' },
    { ad: 'Isı', aciklama: 'Isıtma sistemi ve sıcak su sorunları' }
  ];

  try {
    await Kategori.insertMany(kategoriler);
    console.log('Kategoriler başarıyla eklendi');
  } catch (err) {
    console.log('Kategoriler zaten mevcut');
  }

  process.exit(0);
})
.catch(err => {
  console.log('MongoDB bağlantı hatası:', err);
  process.exit(1);
});
