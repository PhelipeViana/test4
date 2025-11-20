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
// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const err = new Error('Invalid id');
      err.status = 400;
      throw err;
    }

    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const items = JSON.parse(raw);

    const item = items.find(i => Number(i.id) === id);

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});



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
