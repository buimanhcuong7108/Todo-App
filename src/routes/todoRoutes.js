import express from 'express'
import db from '../db.js'

const router = express.Router()

//Lấy todo list từ client ĐÃ ĐĂNG NHẬP
router.get('/', (req, res) => {
    //lấy tất cả các task của userId
    const getTask = db.prepare(`
        SELECT * FROM todos
        WHERE user_id = ?
    `)

    const tasks = getTask.all(req.userId)
    res.json(tasks)
})

//Tạo todo mới
router.post('/', (req, res) => {
    const newTask = db.prepare(`
        INSERT INTO todos (user id, task)
        VALUES (?, ?)
    `)

    newTask.run(req.userId, req.task)
})

//cập nhật todo
//Phức tạp hơn vì cần truy cập cụ thể vùng cần updata
router.put('/', (req, res) => {

})

//xoá todo
router.delete('/:id', (req, res) => { })

export default router