const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(process.cwd(), 'data/items.json');

let statsCache = null;
let lastCacheTime = 0;
const TTL = 20_000;

async function computeStats() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const items = JSON.parse(raw);

  return {
    total: items.length,
    averagePrice:
      items.length === 0
        ? 0
        : items.reduce((acc, cur) => acc + (cur.price || 0), 0) / items.length,
  };
}

function resetCache() {
  statsCache = null;
  lastCacheTime = 0;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const now = Date.now();

    // validate cache
    if (statsCache && now - lastCacheTime < TTL) {
      return res.json({ ...statsCache, cached: true });
    }

    const stats = await computeStats();

    statsCache = stats;
    lastCacheTime = now;

    return res.json({ ...stats, cached: false });
  } catch (err) {
    next(err);
  }
});

router.resetCache = resetCache;

module.exports = router;
