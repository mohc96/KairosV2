import { useState } from 'react'
import './App.css'
import DialogDashboard from './components/Student/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DialogDashboard/>
    </>
  )
}

export default App
