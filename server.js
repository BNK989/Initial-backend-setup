import fs from 'fs'
import express from 'express'
import { bugService } from "./services/bug.service.js"

const PORT = 3030

const app = express()
app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {
    bugService.query()
    .then(data  => res.send(data))
})
// app.get('/api/bug/save', (req, res) => {})
// app.get('/api/bug/:bugId', (req, res) => {})
// app.get('/api/bug/:bugId/remove', (req, res) => {})



app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))