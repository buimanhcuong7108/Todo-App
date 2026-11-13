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

    const result = getTask.all(req.userId)
    res.json(result)
})

//Tạo todo mới
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTask = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = insertTask.run(req.userId, task)
    res.json({ id: result.lastInsertRowid, task, status: 0 })
})

//cập nhật todo
//Phức tạp hơn vì cần truy cập cụ thể vùng cần update
router.put('/:id', (req, res) => {
    const { id } = req.params
    const { completed } = req.body

    const updateTask = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    const result = updateTask.run(completed, id)

    res.json({ status: "complete" })
})

//xoá todo
router.delete('/:id', (req, res) => {
    const { id } = req.params

    const deleteTask = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    const result = deleteTask.run(id, req.userId)

    res.json({ message: "complete" })
})

export default router