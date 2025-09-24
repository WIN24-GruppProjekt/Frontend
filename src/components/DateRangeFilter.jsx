import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * DateRangeFilter – Reusable component for filtering items by a date range.
 * 
 * This component renders:
 * - A toggle button (with optional filter icon) that shows/hides the filter panel
 * - Two date inputs: "Från" and "Till"
 * - A clear button that resets the date range
 * - A status line showing how many items match the filter compared to total
 * 
 * Props:
 * @prop {string} from             - Current start date in "YYYY-MM-DD" format
 * @prop {string} to               - Current end date in "YYYY-MM-DD" format
 * @prop {function} onChange       - Callback called with `{ from, to }` when either date changes
 * @prop {boolean} [defaultOpen]   - If true, the filter panel is open by default (default: false)
 * @prop {string} [buttonText]     - Label for the toggle button when panel is closed
 * @prop {string} [buttonHideText] - Label for the toggle button when panel is open
 * @prop {string} [className]      - Additional CSS classes applied to the root wrapper
 * @prop {boolean} [showIcon]      - If true, shows a Font Awesome filter icon inside the toggle button
 * @prop {number} [totalCount]     - Total number of items (e.g. all sessions)
 * @prop {number} [filteredCount]  - Number of items after applying the date filter
 *
 * Example usage:
 * <DateRangeFilter
 *   from={dateFrom}
 *   to={dateTo}
 *   onChange={({ from, to }) => { setDateFrom(from); setDateTo(to) }}
 *   totalCount={sessions.length}
 *   filteredCount={filteredSessions.length}
 * />
 */
const DateRangeFilter = ({
  from = '',
  to = '',
  onChange,
  defaultOpen = false,
  buttonText = 'Filtrera pass efter datum',
  buttonHideText = 'Dölj filter',
  className = '',
  showIcon = true,
  totalCount = 0,
  filteredCount = 0,
}) => {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    if (from && to && from > to) {
      onChange?.({ from, to: from })
    }
  }, [from, to])

  const updateFrom = (value) => onChange?.({ from: value, to })
  const updateTo = (value) => onChange?.({ from, to: value })
  const clear = () => onChange?.({ from: '', to: '' })

  const toMin = from || undefined
  const fromMax = to || undefined

  return (
    <div className={`date-range-filter ${className}`}>
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-controls="date-range-panel"
      >
        {showIcon && <i className="fa-solid fa-filter" />}
        {open ? buttonHideText : buttonText}
      </button>

      {open && (
        <div id="date-range-panel" className="filter-panel">
          <label className="filter-field">
            <span>Från</span>
            <input
              type="date"
              value={from}
              max={fromMax}
              onChange={(e) => updateFrom(e.target.value)}
            />
          </label>

          <label className="filter-field">
            <span>Till</span>
            <input
              type="date"
              value={to}
              min={toMin}
              onChange={(e) => updateTo(e.target.value)}
            />
          </label>

          {(from || to) && (
            <button type="button" className="btn-box filter-clear" onClick={clear}>
              Rensa
            </button>
          )}
        </div>
      )}

      <p className="filter-status">
        Visar {filteredCount} av {totalCount} pass
        {(from || to) && ` för ${from || '…'} → ${to || '…'}`}
      </p>
    </div>
  )
}

DateRangeFilter.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonHideText: PropTypes.string,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  totalCount: PropTypes.number,
  filteredCount: PropTypes.number,
}

export default DateRangeFilter