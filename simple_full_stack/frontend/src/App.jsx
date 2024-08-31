import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])
  useEffect(()=>{
    axios.get("/usib").
    then((response)=>{

      setJokes(response.data)
    })

  },[])

  return (
    <>
    {console.log(jokes)}
    {jokes.map((j)=>(
      <div key={j.id}>{j.joke}</div>
    ))}
      
    </>
  )
}

export default App
