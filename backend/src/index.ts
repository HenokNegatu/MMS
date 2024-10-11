import express, { Request, Response } from 'express'
import home from './routes/app';


const app = express()

app.use('/api', home)

const PORT = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('ready!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})