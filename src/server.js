import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const PORT = process.env.PORT || 5000
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicPath = path.join(__dirname, '../public') // Giả sử server.js nằm trong src/

// Middlewares
app.use(express.json())
app.use(express.static(publicPath))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', authMiddleware, todoRoutes)

// Fallback / Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Global Error Handler (Bắt buộc có trong production)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
})