import fs from 'fs'
import express from 'express'
import { bugService } from './services/bug.service.js'

const PORT = 3030

const app = express()
app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {
  bugService.query().then((data) => res.send(data))
})
app.get('/api/bug/save', (req, res) => {
  const bugToSave = {
    _id: req.query.id,
    desc: req.query.desc,
    title: req.query.title,
    severity: +req.query.severity,
  }
  bugService
    .save(bugToSave)
        .then((bug) => res.send(bug))
        .catch((err) => res.send(err))
})

app.get('/api/bug/:bugId', (req, res) => {
  const bugId = req.params.bugId
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => res.send(err))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  const bugId = req.params.bugId
  bugService
    .remove(bugId)
    .then(() => res.send(`<h2>Bug removed</h2>`))
    .catch((err) => res.send(err))
})

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))
