/**
 * Vercel Serverless Function Handler
 * Express uygulamasını Vercel serverless functions olarak çalıştırır
 */

const app = require('../backend/server');

// Vercel serverless function export
module.exports = app;

