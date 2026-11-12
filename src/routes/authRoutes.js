import express from 'express'
import bcrypt from 'bcryptjs'
import jwb from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()
const SALT_NUM = 8

//tạo user mới với endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    //encrypt password
    const hashedPassword = bcrypt.hashSync(password, SALT_NUM)

    try {
        //tạo user mới
        const insertUser = db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `)

        const currUser = insertUser.run(username, hashedPassword)

        //tạo default task
        const insertTask = db.prepare(`
            INSERT INTO todos (user_id, task)
            VALUES (?, ?)
        `)

        const defaultTask = `Create your first todo!`
        insertTask.run(currUser.lastInsertRowid, defaultTask)

        //tạo token để mỗi user đều có một phân vùng quyền lợi riêng
        const token = jwb.sign(
            { id: currUser.lastInsertRowid },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        //RESPONSE
        res.status(201).json({ token })
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

        const currUser = getUser.get(username)
        const passwordValid = bcrypt.compareSync(password, currUser.password)

        //xử lý lỗi login
        if (!currUser) {
            return res.status(404).send({ message: "User not found!" })
        } else if (!passwordValid) {
            return res.status(404).send(`Wrong password!`)
        }

        //tạo token login
        const token = jwb.sign(
            { id: currUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        //RESPONSE
        console.log(currUser)
        res.status(200).json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(401)
    }
})

export default router