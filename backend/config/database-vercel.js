/**
 * Veritabanı Yapılandırması - Vercel için
 * Vercel Postgres veya başka bir cloud veritabanı kullanır
 * 
 * Vercel Postgres kullanmak için:
 * 1. Vercel dashboard'da Postgres ekleyin
 * 2. Connection string'i environment variable olarak ekleyin: POSTGRES_URL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Vercel Postgres kullanılıyorsa
if (process.env.POSTGRES_URL) {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      freezeTableName: true
    }
  });
} 
// PlanetScale (MySQL) kullanılıyorsa
else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      freezeTableName: true
    }
  });
}
// Supabase veya başka bir PostgreSQL
else if (process.env.SUPABASE_DB_URL) {
  sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      freezeTableName: true
    }
  });
}
// Fallback: SQLite (sadece development için)
else {
  const path = require('path');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../apartman.db'),
    logging: false,
    define: {
      freezeTableName: true
    }
  });
}

// Veritabanı bağlantısını test et
sequelize.authenticate()
  .then(() => {
    console.log('✅ Veritabanı bağlantısı başarılı');
  })
  .catch(err => {
    console.error('❌ Veritabanı bağlantı hatası:', err.message);
  });

module.exports = sequelize;

