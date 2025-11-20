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

// GET /api/items (list with search + pagination)
router.get('/', async (req, res, next) => {
  try {
    const { q = '', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const fileData = await fs.readFile(DATA_PATH, 'utf8');
    let items = JSON.parse(fileData);

    // Busca
    if (q) {
      const lower = q.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(lower) ||
        i.category?.toLowerCase().includes(lower)
      );
    }

    const total = items.length;

    // Paginação
    const start = (pageNum - 1) * limitNum;
    const data = items.slice(start, start + limitNum);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      data
    });

  } catch (err) {
    err.status = 500;
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
