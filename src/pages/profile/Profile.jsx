import React, { useState, useEffect } from 'react';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import MyProducts from './MyProducts';
import {
    User, Mail, MapPin, Phone,
    LogOut, Settings, Package
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getCurrentUser());

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-content">
                <div className="profile-grid">

                    {/* SIDEBAR: INFO UTILIZATOR */}
                    <aside className="profile-sidebar">
                        <div className="user-card-main">
                            <div className="profile-avatar-large">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h2>{user.username}</h2>
                            <p className="user-role">Membru XCart</p>
                        </div>

                        <div className="profile-details-list">
                            <div className="detail-item">
                                <Mail size={20} />
                                <div>
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Phone size={20} />
                                <div>
                                    <label>Telefon</label>
                                    <p>{user.phone || 'Nesetat'}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <MapPin size={20} />
                                <div>
                                    <label>Locație</label>
                                    <p>{user.location || 'Nesetată'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-actions">
                            <button className="edit-btn">
                                <Settings size={18} /> Setări
                            </button>
                            <button className="logout-btn-profile" onClick={handleLogout}>
                                <LogOut size={18} /> Deconectare
                            </button>
                        </div>
                    </aside>

                    {/* MAIN: ANUNȚURILE MELE */}
                    <section className="profile-main-area">
                        <div className="welcome-banner">
                            <Package size={24} />
                            <div>
                                <h3>Panou Vânzător</h3>
                                <p>Aici poți gestiona toate produsele pe care le-ai adăugat în bazar.</p>
                            </div>
                        </div>

                        <MyProducts />
                    </section>

                </div>
            </main>
        </div>
    );
};

export default Profile;