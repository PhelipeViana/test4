const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const initialPath = require('initial-path');
const router = express.Router();
const DATA_PATH = path.join(process.cwd(), 'data/items.json');

// Utility async
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q } = req.query;
    let results = data;

    if (q) {
      const query = q.toLowerCase();
      results = results.filter(item =>
        (item.name || '').toLowerCase().includes(query)
      );
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        results = results.slice(0, limitNum);
      }
    }

    initialPath();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/', async (req, res, next) => {
  try {
    const raw = await fs.readFile(DATA_PATH);
    let items = JSON.parse(raw);

    const { q, page = 1, limit = 20 } = req.query;

    // filtro
    if (q) {
      items = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
    }

    // paginação
    const p = Number(page);
    const l = Number(limit);

    const start = (p - 1) * l;
    const end = start + l;

    const paginated = items.slice(start, end);

    res.json({
      page: p,
      total: items.length,
      items: paginated
    });

  } catch (err) {
    next(err);
  }
});


// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();

    item.id = Date.now();
    data.push(item);

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
