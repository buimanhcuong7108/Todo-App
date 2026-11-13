import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()
const SALT_NUM = 8

//tạo user mới với endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, SALT_NUM)
        //tạo user mới
        const insertUser = db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `)

        const result = insertUser.run(username, hashedPassword)

        //tạo default task
        const insertTask = db.prepare(`
            INSERT INTO todos (user_id, task)
            VALUES (?, ?)
        `)

        const defaultTask = `Create your first todo!`
        insertTask.run(result.lastInsertRowid, defaultTask)

        //tạo token để mỗi user đều có một phân vùng quyền lợi riêng
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })

        //RESPONSE
        res.json({ token })
    } catch (err) {
        //RESPONSE
        console.log(err.message)
        res.sendStatus(400)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    //encrypt password
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const result = getUser.get(username)

        //xử lý lỗi login
        if (!result) { return res.status(401).json({ message: "Invalid username or password" }); }
        const passwordValid = bcrypt.compareSync(password, result.password)
        if (!passwordValid) { return res.status(401).json({ message: "Invalid username or password" }); }

        //tạo token login
        const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, { expiresIn: '24h' })

        //RESPONSE
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(401)
    }
})

export default router