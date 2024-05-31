const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const { suggestDoctor } = require('./suggest_doctor');

const app = express();
app.use(bodyParser.json());

app.get('/items/:item_id', async (req, res) => {
    const itemId = req.params.item_id;
    try {
        const [rows] = await db.execute('SELECT name FROM items WHERE id = ?', [itemId]);
        if (rows.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.json({ name: rows[0].name });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await db.execute('SELECT * FROM user WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = rows[0];
        user.location = JSON.parse(user.location);
        user.disability_related_to = JSON.parse(user.disability_related_to);
        user.disability_with = JSON.parse(user.disability_with);
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/suggest_doctor', async (req, res) => {
    try {
        const suggestion = await suggestDoctor(req.body);
        res.json(suggestion);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
