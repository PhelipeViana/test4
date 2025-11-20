const request = require('supertest');
const app = require('../app');
const fs = require('fs/promises');
const statsRouter = require('../routes/stats'); // para resetar cache
// Mock filesystem
jest.mock('fs/promises');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /api/items', () => {

    it('should return items (happy path)', async () => {
        const fakeItems = [
            { id: 1, name: 'A', price: 10 },
            { id: 2, name: 'B', price: 20 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/items');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakeItems);
        expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should filter items by q query parameter', async () => {
        const fakeItems = [
            { id: 1, name: 'Apple', price: 10 },
            { id: 2, name: 'Orange', price: 20 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/items?q=app');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, name: 'Apple', price: 10 }]);
    });

    it('should limit items when limit parameter is provided', async () => {
        const fakeItems = [
            { id: 1, name: 'Item1', price: 10 },
            { id: 2, name: 'Item2', price: 20 },
            { id: 3, name: 'Item3', price: 30 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/items?limit=2');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should return 500 when file read fails', async () => {
        fs.readFile.mockRejectedValue(new Error('File error'));

        const res = await request(app).get('/api/items');

        expect(res.status).toBe(500);
        expect(res.body.error).toBeDefined();
    });

});


describe('GET /api/items/:id', () => {

    it('should return a single item when it exists', async () => {
        const fakeItems = [
            { id: 10, name: 'Item X', price: 90 },
            { id: 20, name: 'Item Y', price: 120 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/items/20');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakeItems[1]);
    });

    it('should return 404 when item does not exist', async () => {
        const fakeItems = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/items/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Item not found');
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).get('/api/items/abc');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid id');
    });

});



describe('POST /api/items', () => {

    it('should create a new item (happy path)', async () => {
        const initialItems = [
            { id: 1, name: 'A', price: 10 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(initialItems));
        fs.writeFile.mockResolvedValue(); // simular sucesso

        const newItem = { name: 'New', price: 999 };

        const res = await request(app)
            .post('/api/items')
            .send(newItem);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('New');
        expect(res.body.price).toBe(999);

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
    });

    it('should return 500 on write error', async () => {
        const fakeItems = [{ id: 1, name: 'A' }];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));
        fs.writeFile.mockRejectedValue(new Error('Write failed'));

        const res = await request(app)
            .post('/api/items')
            .send({ name: 'Fail' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Write failed');
    });

});


describe('GET /api/stats', () => {

    beforeEach(() => {
        // limpar cache antes de cada teste
        if (statsRouter.resetCache) {
            statsRouter.resetCache();
        }
    });

    it('should return stats (happy path)', async () => {
        const fakeItems = [
            { price: 10 },
            { price: 20 },
            { price: 30 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const res = await request(app).get('/api/stats');

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(3);
        expect(res.body.averagePrice).toBe(20);
        expect(res.body.cached).toBe(false);
    });

    it('should use cached results on subsequent calls', async () => {
        const fakeItems = [
            { price: 10 },
            { price: 20 }
        ];

        fs.readFile.mockResolvedValue(JSON.stringify(fakeItems));

        const first = await request(app).get('/api/stats');
        const second = await request(app).get('/api/stats');

        expect(first.body.cached).toBe(false);
        expect(second.body.cached).toBe(true);
    });

    it('should return 500 on fs error', async () => {
        fs.readFile.mockRejectedValue(new Error('Stats error'));

        const res = await request(app).get('/api/stats');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Stats error');
    });

});
