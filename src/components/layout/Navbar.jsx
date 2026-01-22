import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, LayoutGrid, Sun, Moon, LogOut, PlusCircle, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { productService } from '../../api/productService';
import './Navbar.css';

export default function Navbar({ onSearch }) {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
    const [user, setUser] = useState(authService.getCurrentUser());
    const [cartCount, setCartCount] = useState(0);

    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('xcart_notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });
    const [showNotif, setShowNotif] = useState(false);

    useEffect(() => {
        localStorage.setItem('xcart_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        const handleNewNotif = (event) => {
            const newMsg = {
                id: Date.now(),
                text: event.detail.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setNotifications(prev => [newMsg, ...prev]);
            setShowNotif(true);
        };
        window.addEventListener('app-notification', handleNewNotif);
        return () => window.removeEventListener('app-notification', handleNewNotif);
    }, []);

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    useEffect(() => {
        const updateUserData = () => {
            setUser(authService.getCurrentUser());
        };
        window.addEventListener('profileUpdated', updateUserData);
        return () => window.removeEventListener('profileUpdated', updateUserData);
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (user?.id) {
                try {
                    const res = await productService.getCart(user.id);
                    setCartCount(res.data.length);
                } catch (err) {
                    console.error("Eroare la preluare count coș:", err);
                }
            } else {
                setCartCount(0);
            }
        };

        fetchCartCount();
        window.addEventListener('cartUpdated', fetchCartCount);
        return () => window.removeEventListener('cartUpdated', fetchCartCount);
    }, [user]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left" onClick={() => navigate('/')}>
                    <LayoutGrid size={28} className="logo-icon" />
                    <span className="logo-text">XCart</span>
                </div>

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

                <div className="nav-right">
                    <button className="sell-btn" onClick={() => navigate(user ? '/add-product' : '/login')}>
                        <PlusCircle size={20} />
                        <span className="sell-text">Vinde</span>
                    </button>

                    <button className="icon-action-btn" onClick={toggleTheme} title="Schimbă tema">
                        {isDark ? <Sun size={22} /> : <Moon size={22} />}
                        <span className="btn-label">{isDark ? 'Light' : 'Dark'}</span>
                    </button>

                    <div className="notif-wrapper">
                        <button className="icon-action-btn" onClick={() => setShowNotif(!showNotif)}>
                            <div className="icon-badge-container">
                                <Bell size={22} />
                                {notifications.length > 0 && <span className="notif-count-badge">{notifications.length}</span>}
                            </div>
                            <span className="btn-label">Notificări</span>
                        </button>

                        {showNotif && (
                            <div className="notif-dropdown">
                                <div className="notif-header">
                                    <h4>Notificări</h4>
                                    <button className="clear-all-notif" onClick={() => setNotifications([])}>Șterge tot</button>
                                </div>
                                <div className="notif-list">
                                    {notifications.length === 0 ? (
                                        <p className="empty-notif">Nu ai notificări noi</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="notif-item">
                                                <div className="notif-content">
                                                    <p>{n.text}</p>
                                                    <span>{n.time}</span>
                                                </div>
                                                <X size={14} className="close-notif-x" onClick={() => setNotifications(notifications.filter(not => not.id !== n.id))} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {user ? (
                        <>
                            <div className="user-profile-nav" onClick={() => navigate('/profile')}>
                                <div className="user-avatar">
                                    {user.profilePictureUrl ? (
                                        <img
                                            src={user.profilePictureUrl}
                                            alt="Profile"
                                            className="nav-avatar-img"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('fallback-avatar');
                                            }}
                                        />
                                    ) : (
                                        <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
                                    )}
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

                    <button
                        className="icon-action-btn cart-btn"
                        onClick={() => navigate(user ? '/cart' : '/login')}
                        title="Vezi coșul"
                    >
                        <div className="cart-wrapper">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </div>
                        <span className="btn-label">Coș</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}