const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

router.get('/:referenceNo', async (req, res) => {
  const { referenceNo } = req.params;

  try {
    const imagesWithDamageInfo = await imageService.getImagesWithDamageInfo(referenceNo);
    res.json(imagesWithDamageInfo);
  } catch (error) {
    console.error('Error fetching images and damage info:', error);
    if (error.message === 'No images found for this reference number') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;