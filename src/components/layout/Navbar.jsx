import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, LayoutGrid, Sun, Moon, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import './Navbar.css';

export default function Navbar({ onSearch }) {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
    const [user, setUser] = useState(authService.getCurrentUser());

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* 1. ZONA LOGO */}
                <div className="nav-left" onClick={() => navigate('/')}>
                    <LayoutGrid size={28} className="logo-icon" />
                    <span className="logo-text">XCart</span>
                </div>

                {/* 2. ZONA SEARCH */}
                <div className="nav-center">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Caută pe XCart (haine, electronice...)"
                            onChange={(e) => onSearch ? onSearch(e.target.value) : null}
                        />
                    </div>
                </div>

                {/* 3. ZONA ACTIONS */}
                <div className="nav-right">
                    {/* Buton Adaugă Anunț - Vizibil pentru toți, dar redirecționează la login dacă nu ești logat */}
                    <button className="sell-btn" onClick={() => navigate(user ? '/add-product' : '/login')}>
                        <PlusCircle size={20} />
                        <span className="sell-text">Vinde</span>
                    </button>

                    <button className="icon-action-btn" onClick={toggleTheme} title="Schimbă tema">
                        {isDark ? <Sun size={22} /> : <Moon size={22} />}
                        <span className="btn-label">{isDark ? 'Light' : 'Dark'}</span>
                    </button>

                    {user ? (
                        <>
                            <div className="user-profile-nav" onClick={() => navigate('/profile')}>
                                <div className="user-avatar">
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="user-info-text">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-sub">Contul meu</span>
                                </div>
                            </div>
                            <button className="icon-action-btn logout-btn" onClick={handleLogout} title="Ieșire">
                                <LogOut size={22} />
                                <span className="btn-label">Ieșire</span>
                            </button>
                        </>
                    ) : (
                        <button className="icon-action-btn" onClick={() => navigate('/login')}>
                            <User size={22} />
                            <span className="btn-label">Cont</span>
                        </button>
                    )}

                    <button className="icon-action-btn cart-btn">
                        <div className="cart-wrapper">
                            <ShoppingCart size={22} />
                            <span className="cart-count">0</span>
                        </div>
                        <span className="btn-label">Coș</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}