/**
 * Veritabanı Modelleri
 * Bu dosya tüm Sequelize modellerini ve ilişkilerini tanımlar
 * PostgreSQL (Vercel) ve SQLite (local) için uyumlu
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Veritabanı tipini kontrol et
const isPostgres = sequelize.getDialect() === 'postgres';
const isMySQL = sequelize.getDialect() === 'mysql';

/**
 * User Model - Kullanıcı Tablosu
 * Sakin, Personel ve Yönetici rollerini destekler
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sifre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  daire: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blok: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'A'
  },
  kat: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '1'
  },
  telefon: {
    type: DataTypes.STRING
  },
  rol: {
    // PostgreSQL için ENUM, diğerleri için STRING
    type: isPostgres 
      ? DataTypes.ENUM('sakin', 'personel', 'yonetici')
      : DataTypes.STRING,
    defaultValue: 'sakin',
    validate: {
      isIn: [['sakin', 'personel', 'yonetici']]
    }
  },
  olusturma_tarihi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  son_giris: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false
});

/**
 * Kategori Model - Şikayet Kategorileri Tablosu
 * Örnek: Elektrik, Su, Asansör, Güvenlik vb.
 */
const Kategori = sequelize.define('Kategori', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  aciklama: {
    type: DataTypes.TEXT
  },
  olusturma_tarihi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'kategoriler',
  timestamps: false
});

/**
 * Sikayet Model - Şikayetler Tablosu
 * Kullanıcıların oluşturduğu şikayetleri tutar
 * Durum: yeni, atandi, cozuluyor, cozuldu, reddedildi
 */
const Sikayet = sequelize.define('Sikayet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sakin_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baslik: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fotoğraf: {
    type: DataTypes.TEXT
  },
  durum: {
    // PostgreSQL için ENUM, diğerleri için STRING
    type: isPostgres 
      ? DataTypes.ENUM('yeni', 'atandi', 'cozuluyor', 'cozuldu', 'reddedildi')
      : DataTypes.STRING,
    defaultValue: 'yeni',
    validate: {
      isIn: [['yeni', 'atandi', 'cozuluyor', 'cozuldu', 'reddedildi']]
    }
  },
  oncelik: {
    // PostgreSQL için ENUM, diğerleri için STRING
    type: isPostgres 
      ? DataTypes.ENUM('dusuk', 'orta', 'yuksek')
      : DataTypes.STRING,
    defaultValue: 'orta',
    validate: {
      isIn: [['dusuk', 'orta', 'yuksek']]
    }
  },
  atanan_birim: {
    type: DataTypes.STRING
  },
  atanan_personel_id: {
    type: DataTypes.INTEGER
  },
  not: {
    type: DataTypes.TEXT
  },
  cozum_tarihi: {
    type: DataTypes.DATE
  },
  olusturma_tarihi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  guncelleme_tarihi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sikayetler',
  timestamps: false
});

/**
 * Bildirim Model - Bildirimler Tablosu
 * Kullanıcılara gönderilen bildirimleri tutar
 * Şikayet durumu değiştiğinde otomatik oluşturulur
 */
const Bildirim = sequelize.define('Bildirim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kullanic_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sikayet_id: {
    type: DataTypes.INTEGER
  },
  baslik: {
    type: DataTypes.STRING
  },
  mesaj: {
    type: DataTypes.TEXT
  },
  okunanmis: {
    // Sequelize otomatik olarak SQLite'da INTEGER'a çevirir
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  olusturma_tarihi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'bildirimler',
  timestamps: false
});

/**
 * Analiz Model - Analiz Raporları Tablosu
 * Yönetici dashboard için istatistik verilerini tutar
 */
const Analiz = sequelize.define('Analiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tarih: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  toplam_sikayet: {
    type: DataTypes.INTEGER
  },
  cozulen_sikayet: {
    type: DataTypes.INTEGER
  },
  onemli_sikayet: {
    type: DataTypes.INTEGER
  },
  kategori_ozetleri: {
    // PostgreSQL için JSONB (daha hızlı), MySQL için JSON, SQLite için TEXT
    type: isPostgres 
      ? DataTypes.JSONB 
      : (isMySQL ? DataTypes.JSON : DataTypes.TEXT)
  },
  personel_performansi: {
    // PostgreSQL için JSONB (daha hızlı), MySQL için JSON, SQLite için TEXT
    type: isPostgres 
      ? DataTypes.JSONB 
      : (isMySQL ? DataTypes.JSON : DataTypes.TEXT)
  }
}, {
  tableName: 'analizler',
  timestamps: false
});

/**
 * Model İlişkileri (Associations)
 * Tablolar arası foreign key ilişkilerini tanımlar
 */

// Sikayet -> User (Sakin) ilişkisi
// Bir şikayet bir sakine aittir
Sikayet.belongsTo(User, { 
  as: 'sakin',           // Alias: şikayet.sakin şeklinde erişim
  foreignKey: 'sakin_id' 
});

// User -> Sikayet ilişkisi (Sakin olarak)
// Bir sakin birden fazla şikayet açabilir
User.hasMany(Sikayet, { 
  as: 'sikayetleri', 
  foreignKey: 'sakin_id' 
});

// Sikayet -> User (Atanan Personel) ilişkisi
// Bir şikayet bir personele atanabilir
Sikayet.belongsTo(User, { 
  as: 'atananPersonel',         // Alias: şikayet.atananPersonel şeklinde erişim
  foreignKey: 'atanan_personel_id' 
});

// User -> Sikayet ilişkisi (Personel olarak)
// Bir personele birden fazla şikayet atanabilir
User.hasMany(Sikayet, { 
  as: 'atananSikayetler', 
  foreignKey: 'atanan_personel_id' 
});

// Sikayet -> Kategori ilişkisi
// Her şikayetin bir kategorisi vardır
Sikayet.belongsTo(Kategori, { 
  as: 'kategori',         // Alias: şikayet.kategori şeklinde erişim
  foreignKey: 'kategori_id' 
});

// Kategori -> Sikayet ilişkisi
// Bir kategoride birden fazla şikayet olabilir
Kategori.hasMany(Sikayet, { 
  as: 'sikayetler', 
  foreignKey: 'kategori_id' 
});

// Bildirim -> User ilişkisi
// Her bildirim bir kullanıcıya aittir
Bildirim.belongsTo(User, { 
  as: 'kullanici', 
  foreignKey: 'kullanic_id' 
});

// User -> Bildirim ilişkisi
// Bir kullanıcının birden fazla bildirimi olabilir
User.hasMany(Bildirim, { 
  as: 'bildirimleri', 
  foreignKey: 'kullanic_id' 
});

// Bildirim -> Sikayet ilişkisi
// Her bildirim bir şikayetle ilişkili olabilir
Bildirim.belongsTo(Sikayet, { 
  as: 'sikayet', 
  foreignKey: 'sikayet_id' 
});

// Sikayet -> Bildirim ilişkisi
// Bir şikayetle ilgili birden fazla bildirim olabilir
Sikayet.hasMany(Bildirim, { 
  as: 'bildirimleri', 
  foreignKey: 'sikayet_id' 
});

// Modülleri dışa aktar
module.exports = {
  User,
  Kategori,
  Sikayet,
  Bildirim,
  Analiz,
  sequelize
};
