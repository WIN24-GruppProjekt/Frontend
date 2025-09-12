import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='centerscreen'>
        <h1>
          Body from App.jsx
        </h1>
        <ThemeToggle />
      </div>
    </>
  )
}

export default App
