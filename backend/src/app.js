const express = require('express');
const morgan = require('morgan');
const initialPath = require('initial-path');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const cors = require('cors');
const { notFound } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Desabilitar initial-path durante testes
if (process.env.NODE_ENV !== 'test') {
    app.use(initialPath());
}

// Health Check
app.get('/', (req, res) => {
    res.send('Backend ativo! ' + Math.random());
});

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

// Not Found
app.use('*', notFound);

// GLOBAL ERROR HANDLER (ESSENCIAL PARA OS TESTES)
app.use((err, req, res, next) => {
    console.error('ERROR:', err.message);
    res.status(err.status || 500).json({
        error: err.message,
    });
});

module.exports = app;
