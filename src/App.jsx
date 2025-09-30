import { Route, Routes, Navigate } from 'react-router-dom'
import SessionListPage from './pages/SessionListPage'
import PortalLayout from './layouts/PortalLayout'
import LandingLayout from './layouts/LandingLayout'
import StartPage from './pages/StartPage'
import AboutPage from './pages/AboutPage'
import ComponentsPage from './pages/ComponentsPage'
import SessionDetailsPage from './pages/SessionDetailsPage'


function App() {
  return (
    <>
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path='/' element={<StartPage />} />
      </Route>



      <Route element={<PortalLayout />}>
        <Route path='/pass' element={<SessionListPage />} />
        <Route path='/pass/info/:id' element={<SessionDetailsPage />} />
        <Route path='/om' element={<AboutPage />} />
        <Route path='/komponenter' element={<ComponentsPage />} />
      </Route>


      {/* FailSafe om något skulle vara helt tokigt*/}
      <Route path='*' element={<Navigate to='/' replace />} /> 

    </Routes>
    </>

  )
}

export default App