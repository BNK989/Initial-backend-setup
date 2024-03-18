import fs from 'fs'
import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const PORT = 3030

const app = express()
app.use(express.static('public'))
// app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {
  bugService.query().then((data) => res.send(data))
})

app.get('/api/bug/save', (req, res) => {
  const bugToSave = {
    _id: req.query._id,
    desc: req.query.desc,
    title: req.query.title,
    severity: +req.query.severity,
  }
  bugService
    .save(bugToSave)
        .then((bug) => res.send(bug))
        .catch(err => {
            res.send(err)
            loggerService.error(err)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
  const bugId = req.params.bugId
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch(err => {
        res.send(err)
        loggerService.error(err)
    })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  const bugId = req.params.bugId
  bugService
    .remove(bugId)
    .then(() => res.send(`<h2>Bug removed</h2>`))
    .catch((err) => res.send(err))
})



app.get('/log', (req, res) => {
  fs.readFile(`./logs/backend.log`, 'utf8', (err, data) => {
    if (err) {
      res.send('error reading file')
    } else {
      res.send(data.replace(/[\n,]/g, function (match) {
        return match + '<br>';
      }))
    }
  })
})

app.listen(PORT, () => 
    loggerService.info(`Server ready at port ${PORT}`))
