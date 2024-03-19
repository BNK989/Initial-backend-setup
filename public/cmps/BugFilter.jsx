const { useState, useEffect } = React

export function BugFilter({ onSetFilter, filterBy, labels }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === 'number') value = +value
    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
  }

  return (
    <section>
      <h2>Filter bugs</h2>

      <form>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={filterByToEdit.title}
          onChange={handleChange}
          placeholder="By title"
        />
        <label htmlFor="minSeverity">Min severity</label>
        <input
          type="number"
          id="minSeverity"
          name="minSeverity"
          value={filterByToEdit.minSeverity || ''}
          onChange={handleChange}
          placeholder="By min severity"
        />
        <label htmlFor="severityOptions">Label</label>
        <select
          type="text"
          id="label"
          name="label"
          value={filterByToEdit.label}
          onChange={handleChange}
        >
          <option value="">By label</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </form>
    </section>
  )
}
