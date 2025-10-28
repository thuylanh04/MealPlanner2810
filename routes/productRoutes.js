// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 1. GET TẤT CẢ meal / Tìm kiếm 
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let result;
        if (search) {
            const q = `%${search}%`;
            result = await db.query(
                `SELECT * FROM products 
                 WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
                 ORDER BY created_at DESC`,
                [q]
            );
        } else {
            result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /api/products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. POST thêm meal mới 
router.post('/', async (req, res) => {
    try {
        const { name, description, category, calories, image } = req.body;
        if (!name) return res.status(400).json({ error: 'Tên món ăn là bắt buộc.' });

        const sql = `
          INSERT INTO products (name, description, category, calories, image)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const result = await db.query(sql, [name, description, category, calories, image]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /api/products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. PUT cập nhật meal (Endpoint Sửa)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, calories, image } = req.body;
        if (!name) return res.status(400).json({ error: 'Tên món ăn là bắt buộc.' });

        const sql = `
          UPDATE products
          SET name = $1, description = $2, category = $3, calories = $4, image = $5
          WHERE id = $6
          RETURNING *;
        `;
        const result = await db.query(sql, [name, description, category, calories, image, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in PUT /api/products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. DELETE xóa meal (Endpoint Xóa)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM products WHERE id = $1 RETURNING id';
        const result = await db.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn.' });
        }
        res.status(204).send(); 
    } catch (err) {
        console.error('Error in DELETE /api/products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;