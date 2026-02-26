import { useState } from 'react'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import AuthModal from './components/AuthModal/AuthModal'
import Footer from './components/Footer/Footer'

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <Header openAuth={() => setIsAuthOpen(true)} />
      <HomePage />
      <Footer />

      {isAuthOpen && (
        <AuthModal closeAuth={() => setIsAuthOpen(false)} />
      )}
    </>
  )
}

export default App
