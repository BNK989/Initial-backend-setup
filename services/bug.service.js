import fs from 'fs'
import fr from 'follow-redirects'

import { utilService } from "./utils.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bugData.json')

function query(filterBy) {
    let bugsToReturn = bugs
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (filterBy.label) {
        bugsToReturn = bugsToReturn.filter(bug => bug.labels.includes(filterBy.label))
    }
    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(bugsToReturn)
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('bug does not exist!')
    return Promise.resolve(bug)
}

function remove(id) {
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()

}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.description = utilService.makeLorem()
        bug.labels = ['first', 'second', 'third']
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugData.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}