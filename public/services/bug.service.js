import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

_createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromParams,
}

function query(filterBy = getDefaultFilter()) {
  return axios
    .get(BASE_URL)
    .then((res) => res.data)
    .then((bugs) => {
      if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugs = bugs.filter((bug) => regex.test(bug.title))
      }

      if (filterBy.minSeverity) {
        bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
      }

      return bugs
    })
}
function getById(bugId) {
  //return storageService.get(STORAGE_KEY, bugId)
  return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
  //return storageService.remove(STORAGE_KEY, bugId)
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {

  if (bug._id) {
    return axios.put(BASE_URL, bug)
  } else {
    return axios.post(BASE_URL, bug)
  }
  // const url = BASE_URL + 'save'

  // const { title, severity } = bug
  // console.log('bug:', bug)
  // const queryParams = { title, severity }

  // if (bug._id) queryParams._id = bug._id

  // console.log('queryParams:', queryParams)

  // return axios.get(url, { params: queryParams })
}

function getDefaultFilter() {
  return { title: '', minSeverity: 0 }
}

function getFilterFromParams(searchParams = {}) {
  const defaultFilter = getDefaultFilter()
  return {
    title: searchParams.get('title') || defaultFilter.title,
    minSeverity: searchParams.get('minSeverity') || defaultFilter.minSeverity,
  }
}

function _createBugs() {
  let bugs = utilService.loadFromStorage(STORAGE_KEY)
  if (!bugs || !bugs.length) {
    bugs = [
      {
        title: 'Infinite Loop Detected',
        severity: 4,
        _id: '1NF1N1T3',
      },
      {
        title: 'Keyboard Not Found',
        severity: 3,
        _id: 'K3YB0RD',
      },
      {
        title: '404 Coffee Not Found',
        severity: 2,
        _id: 'C0FF33',
      },
      {
        title: 'Unexpected Response',
        severity: 1,
        _id: 'G0053',
      },
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
  }
}
