const express = require('express');
const router = express.Router();
const referenceService = require('../services/referenceService');

router.get('/', async (req, res) => {
  try {
    const referenceNumbers = await referenceService.getAllReferenceNumbers();
    res.json({ referenceNumbers });
  } catch (error) {
    console.error('Error fetching reference numbers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check/:referenceNo', async (req, res) => {
  const { referenceNo } = req.params;
  try {
    const exists = await referenceService.checkReferenceExists(referenceNo);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking reference number:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;