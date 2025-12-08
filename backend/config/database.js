/**
 * Veritabanı Yapılandırması
 * Vercel Postgres için optimize edilmiş
 * Hem production (Vercel) hem de local development için çalışır
 * 
 * Öncelik sırası:
 * 1. POSTGRES_URL (Vercel Postgres)
 * 2. DATABASE_URL (Genel PostgreSQL)
 * 3. SQLite (Local development)
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Vercel Postgres veya PostgreSQL kullanılıyorsa
if (process.env.POSTGRES_URL || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'))) {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      // Vercel serverless için optimize edilmiş ayarlar
      connectTimeout: 10000,
      statement_timeout: 10000
    },
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      // Serverless functions için connection pooling
      max: isProduction ? 5 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 1000
    },
    define: {
      freezeTableName: true,
      underscored: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    },
    // Vercel'de connection'ları kapat
    retry: {
      max: 3
    }
  });
  console.log('📦 PostgreSQL kullanılıyor (Vercel/Production)');
} 
// PlanetScale (MySQL) veya diğer MySQL kullanılıyorsa
else if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('mysql')) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: isProduction ? 5 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true
    }
  });
  console.log('📦 MySQL (PlanetScale) kullanılıyor');
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
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: isProduction ? 5 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true
    }
  });
  console.log('📦 Supabase PostgreSQL kullanılıyor');
}
// Fallback: SQLite (sadece local development için)
else {
  const path = require('path');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../apartman.db'),
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      freezeTableName: true
    }
  });
  console.log('📦 SQLite kullanılıyor (local development)');
}

// Veritabanı bağlantısını test et
sequelize.authenticate()
  .then(() => {
    console.log('✅ Veritabanı bağlantısı başarılı');
  })
  .catch(err => {
    console.error('❌ Veritabanı bağlantı hatası:', err.message);
    // Production'da hata durumunda uygulamayı durdurma
    if (!isProduction) {
      console.error('Detay:', err);
    }
  });

// Vercel serverless için connection cleanup
if (isProduction) {
  // Graceful shutdown için connection'ları kapat
  process.on('SIGTERM', async () => {
    await sequelize.close();
  });
}

// Sequelize instance'ını dışa aktar
module.exports = sequelize;
