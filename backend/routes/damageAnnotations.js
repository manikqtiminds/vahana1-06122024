const express = require('express');
const router = express.Router();
const damageService = require('../services/damageService');

// Get damage annotations for a specific image
router.get('/:referenceNo/:imageName', async (req, res) => {
  const { referenceNo, imageName } = req.params;
  try {
    const annotations = await damageService.getDamageAnnotations(referenceNo, imageName);
    const costs = await damageService.getTotalCosts(referenceNo);
    
    const currentImageCost = costs.find(c => c.ImageName === imageName)?.TotalCost || 0;
    const totalCost = costs.reduce((sum, c) => sum + (c.TotalCost || 0), 0);

    res.json({
      annotations,
      currentImageCost,
      totalCost
    });
  } catch (error) {
    console.error('Error fetching damage annotations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new damage annotation
router.post('/', async (req, res) => {
  try {
    const id = await damageService.createDamageAnnotation(req.body);
    res.status(201).json({ id, message: 'Damage annotation created successfully' });
  } catch (error) {
    console.error('Error creating damage annotation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update damage annotation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await damageService.updateDamageAnnotation(id, req.body);
    res.json({ message: 'Damage annotation updated successfully' });
  } catch (error) {
    console.error('Error updating damage annotation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete damage annotation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await damageService.deleteDamageAnnotation(id);
    res.json({ message: 'Damage annotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting damage annotation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;