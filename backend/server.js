const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'databasePW55', 
    database: 'mydb'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking username or email.' });
        if (results.length > 0) {
            if (results[0].email === email) {
                return res.status(400).json({ message: 'Email is already taken.' });
            }
            if (results[0].username === username) {
                return res.status(400).json({ message: 'Username is already taken.' });
            }
        }

        db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Error registering user.' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    });
    
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ message: 'User not found.' });

        const user = results[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const userId = user.id;

        const token = jwt.sign({ id: user.id, username: user.username }, 'jwt_secret', { expiresIn: '1h' });
        const decodedToken = jwt.decode(token);
        const tokenExp = decodedToken.exp;

        res.status(200).json({ message: 'Login successful', userId, tokenExp });
    });
});

app.post('/addtocart', (req, res) => {
    const { product_id, user_id, quantity, price } = req.body; 
    db.query('SELECT quantity FROM cartproducts WHERE product_id = ? AND user_id = ?', [product_id, user_id], (err, result) => {
        if (err) {
            console.error('Error checking cartproducts:', err);
            return res.status(500).json({ message: 'Error checking cartproducts.' });
        }
        if (result.length === 0) {
            db.query('INSERT INTO cartproducts (product_id, user_id, quantity, price) VALUES (?, ?, ?, ?)', [product_id, user_id, quantity, price], (err, result) => {
                if (err) {
                    console.error('Error adding to cartproducts:', err);
                    return res.status(500).json({ message: 'Error adding to cartproducts.' })
                }
                res.status(201).json({ message: 'Cart product added successfully!' });
            });
        }
        else {
            const existingQuantity = result[0].quantity;
            const updatedQuantity = existingQuantity + quantity;

            db.query('UPDATE cartproducts SET quantity = ? WHERE product_id = ? AND user_id = ?', [updatedQuantity, product_id, user_id], (err, result) => {
                if (err) {
                    console.error('Error updating cart quantity:', err);
                    return res.status(500).json({ message: 'Error updating cart quantity.' });
                }
                res.status(200).json({ message: 'Cart product updated successfully!' });
            });    
        }
    })
});

app.get('/cart', (req, res) => {
    const { userId } = req.query;
    db.query('SELECT * FROM cartproducts WHERE user_id = ?', [userId], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ message: 'User cart not found.' });
        res.status(200).json({ message: 'User cart found successfully', result: results});
    });
});

app.post('/getsubtotal', (req, res) => {
    const { userId, product } = req.body;
    db.query('SELECT price FROM cartproducts WHERE user_id = ? AND product_id = ?', [userId, product], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "Price not found." })
        }
        res.status(200).json({ message: "Price found successfully.", price: results[0].price})
    });
})

app.listen(5000, () => {
    console.log(`Server running on http://localhost:${port}`);
});
