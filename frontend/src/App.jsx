import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Routing from './Components/Routing'
import Footer from './Components/Footer'

export default function App() {
  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    <Footer/>
    </BrowserRouter>
    </>
  )
}
