import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import AuthModal from './components/AuthModal/AuthModal'
import ProfilePage from "./components/ProfilePage/ProfilePage";
import Footer from './components/Footer/Footer'

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Header openAuth={() => setIsAuthOpen(true)} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        <Footer />

        {isAuthOpen && (
          <AuthModal closeAuth={() => setIsAuthOpen(false)} />
        )}
      </BrowserRouter>
    </>
  )
}

export default App
