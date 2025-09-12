import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SessionListPage from './pages/SessionListPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<SessionListPage />} />
    </Routes>
    </>

  )
}

export default App