import fs from 'fs'
import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { utilService } from './services/utils.service.js'

const PORT = 3030

const app = express()

// Express config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// GET ALL BUGS
app.get('/api/bug', (req, res) => {
  console.log('req.query:', req.query)
  const filterByObj = JSON.parse(req.query.filterBy)
  const sortByObj = JSON.parse(req.query.sortBy)
  console.log('filterByObj:', filterByObj)
  console.log('sortByObj:', sortByObj)
  const filterBy = {
    title: filterByObj.title || '',
    minSeverity: +filterByObj.minSeverity || 0,
    label: filterByObj.label || '',
    pageIdx: filterByObj.pageIdx
  }
  console.log('filterBy:', filterBy)
  bugService
    .query(filterBy,sortByObj)
    .then((bugs) => {
      res.send(bugs)
    })
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(400).send('Cannot get bugs')
    })
})

// SAVE NEW BUG
app.post('/api/bug', (req, res) => {
  const bugToSave = {
    title: req.body.title,
    severity: +req.body.severity,
  }
  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

// UPDATE BUG
app.put('/api/bug', (req, res) => {
  const bugToSave = {
    title: req.body.title,
    severity: +req.body.severity,
    description: req.body.description,
    _id: req.body._id,
  }
  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

app.get('/api/bug/:bugId', (req, res) => {
  let visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')

  const bugId = req.params.bugId
  bugService
    .getById(bugId)
    .then((bug) => {
      visitedBugs.push(bugId)
      visitedBugs = utilService.unique(visitedBugs)
      if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')
      console.log('visitedBugs:', visitedBugs)

      res.cookie('visitedBugs', JSON.stringify(visitedBugs), {
        maxAge: 7 * 1000,
      })
      res.send(bug)
    })
    .catch((err) => {
      res.send(err)
      loggerService.error(err)
    })
})

app.delete('/api/bug/:bugId', (req, res) => {
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
      res.send(
        data.replace(/[\n,]/g, function (match) {
          return match + '<br>'
        })
      )
    }
  })
})

app.listen(PORT, () => loggerService.info(`Server ready at port ${PORT}`))
