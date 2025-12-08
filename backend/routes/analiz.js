const express = require('express');
const { Sikayet, Analiz, sequelize } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Genel istatistikler
router.get('/istatistikler', auth, async (req, res) => {
  try {
    const { tarihBas, tarihBit } = req.query;
    let query = {};

    if (tarihBas && tarihBit) {
      query.olusturma_tarihi = {
        [Op.gte]: new Date(tarihBas),
        [Op.lte]: new Date(tarihBit)
      };
    }

    const toplam = await Sikayet.count({ where: query });
    const cozulen = await Sikayet.count({ where: { ...query, durum: 'cozuldu' } });
    const yuksekOncelik = await Sikayet.count({ where: { ...query, oncelik: 'yuksek' } });

    res.json({
      istatistik: {
        toplam,
        cozulen,
        yuksekOncelik,
        cozulmeOrani: ((cozulen / toplam) * 100).toFixed(2) + '%'
      }
    });
  } catch (err) {
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

// Raporlandırma
router.post('/rapor-kaydet', auth, async (req, res) => {
  try {
    const { kategori_ozetleri, personel_performansi } = req.body;

    const toplam = await Sikayet.count();
    const cozulen = await Sikayet.count({ where: { durum: 'cozuldu' } });
    const onemli = await Sikayet.count({ where: { oncelik: 'yuksek' } });

    const rapor = await Analiz.create({
      toplam_sikayet: toplam,
      cozulen_sikayet: cozulen,
      onemli_sikayet: onemli,
      kategori_ozetleri: JSON.stringify(kategori_ozetleri),
      personel_performansi: JSON.stringify(personel_performansi)
    });

    res.json({
      mesaj: 'Rapor başarıyla kaydedildi',
      rapor
    });
  } catch (err) {
    res.status(500).json({ mesaj: 'Hata', hata: err.message });
  }
});

module.exports = router;
