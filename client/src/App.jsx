import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import AuthModal from './components/AuthModal/AuthModal'

import ProfilePage from "./components/ProfilePage/ProfilePage";
import Overview from "./components/ProfilePage/Overview/Overview";
import Orders from "./components/ProfilePage/Orders/Orders"
import Wishlist from "./components/ProfilePage/Wishlist/Wishlist";
import PersonalInfo from "./components/ProfilePage/PersonalInfo/PersonalInfo";
import Security from "./components/ProfilePage/Security/Security";

import AdminPanel from "./components/AdminPanel/AdminPanel";
import Dashboard from "./components/AdminPanel/Dashboard/Dashboard";
import Products from "./components/AdminPanel/Products/Products";
import AdminOrders from "./components/AdminPanel/Orders/Orders";
import Users from "./components/AdminPanel/Users/Users";

import Catalog from "./components/AdminPanel/Catalog/Catalog";
import CategoriesList from "./components/AdminPanel/Catalog/CategoriesList/CategoriesList";
import LeaguesList from "./components/AdminPanel/Catalog/LeaguesList/LeaguesList";
import TeamsList from "./components/AdminPanel/Catalog/TeamsList/TeamsList";

import Footer from './components/Footer/Footer';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Header openAuth={() => setIsAuthOpen(true)} />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/profile" element={<ProfilePage />}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="personal" element={<PersonalInfo />} />
            <Route path="security" element={<Security />} />
          </Route>

          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
            <Route path="catalog" element={<Catalog />}>
              <Route index element={<Navigate to="categories" replace />} />
              <Route path="categories" element={<CategoriesList />} />
              <Route path="leagues" element={<LeaguesList />} />
              <Route path="teams" element={<TeamsList />} />
            </Route>
          </Route>

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
