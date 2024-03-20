const { useState, useEffect, useRef } = React

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'

import { utilService } from '../services/util.service.js'

const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [labels, setLabels] = useState([])
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )
  const [sortBy, setSortBy] = useState({})

  const debounceOnSetFilterRef = useRef(utilService.debounce(onSetFilter, 500))

  useEffect(() => {
    loadBugs()
    setSearchParams({ ...filterBy, ...sortBy })
  }, [filterBy, sortBy])

  function loadBugs() {
    console.log('filterBy:', filterBy)
    bugService.query(filterBy, sortBy).then(setBugs).then(getAllLabels)
  }

  
  function getAllLabels() {
    const labels = []
    bugs.forEach((bug) => {
      if (!labels.includes(...bug.labels)) {
        labels.push(...bug.labels)
      }
    })
    console.log('labels:', labels)
    setLabels(labels)
    //return labels
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Successfully!')
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
    }
    bugService
      .save(bug)
      .then((data) => data.data)
      .then((savedBug) => {
        console.log('Added Bug', savedBug)
        setBugs([...bugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((data) => data.data)
      .then((savedBug) => {
        const bugsToUpdate = bugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
        )
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }
      function onSetFilter(fieldsToUpdate) {
        setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }))
      }

      function onChangePage(diff) {
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
      }

  return (
    <main>
      <h3>Bugs App</h3>
      <BugFilter
        onSetFilter={debounceOnSetFilterRef.current}
        filterBy={filterBy}
        labels={labels}
      />
      <BugSort setSortBy={setSortBy} sortBy={sortBy} />
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
      <button onClick={() => onChangePage(-1)}>-</button>
      <span>{filterBy.pageIdx + 1}</span>
      <button onClick={() => onChangePage(1)}>+</button>
    </main>
  )
}
