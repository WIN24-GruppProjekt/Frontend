import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SessionListPage from './pages/SessionListPage'
import PortalLayout from './layouts/PortalLayout'
import StartPage from './pages/StartPage'
import AboutPage from './pages/AboutPage'
import ComponentsPage from './pages/ComponentsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route element={<PortalLayout />}>
      <Route path='/' element={<StartPage />}/>
        <Route path='/bokning' element={<SessionListPage />} />
        <Route path='/om' element={<AboutPage />} />
        <Route path='/komponenter' element={<ComponentsPage />} />
      </Route>
    </Routes>
    </>

  )
}

export default App