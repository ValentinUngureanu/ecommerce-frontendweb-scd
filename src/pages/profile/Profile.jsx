import React, {useEffect, useState} from 'react';
import {authService} from '../../api/authService';
import {useNavigate} from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import MyProducts from './MyProducts';
import OrderHistory from './OrderHistory';
import AdminDashboard from './AdminDashboard';
import {List, LogOut, Mail, MapPin, Package, Phone, Settings, ShieldCheck, ShoppingBag} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getCurrentUser());
    const [activeTab, setActiveTab] = useState('products');

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
            <Navbar/>

            <main className="profile-content">
                <div className="profile-grid">

                    <aside className="profile-sidebar">
                        <div className="user-card-main">
                            <div className="profile-avatar-large">
                                {user.profilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt={user.username}
                                        className="avatar-img-full"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = user.username.charAt(0).toUpperCase();
                                        }}
                                    />
                                ) : (
                                    user.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h2>{user.username}</h2>
                            <p className="user-role">{user.role === 'ADMIN' ? 'Administrator' : 'Membru XCart'}</p>
                        </div>

                        <div className="profile-details-list">
                            <div className="detail-item">
                                <Mail size={20}/>
                                <div>
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Phone size={20}/>
                                <div>
                                    <label>Telefon</label>
                                    <p>{user.phone || 'Nesetat'}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <MapPin size={20}/>
                                <div>
                                    <label>Locație</label>
                                    <p>{user.location || 'Nesetată'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-actions">
                            <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
                                <Settings size={18}/> Setări
                            </button>
                            <button className="logout-btn-profile" onClick={handleLogout}>
                                <LogOut size={18}/> Deconectare
                            </button>
                        </div>
                    </aside>

                    <section className="profile-main-area">
                        <div className="welcome-banner">
                            {activeTab === 'products' && <Package size={24}/>}
                            {activeTab === 'orders' && <ShoppingBag size={24}/>}
                            {activeTab === 'admin' && <ShieldCheck size={24}/>}

                            <div>
                                <h3>
                                    {activeTab === 'products' && 'Panou Vânzător'}
                                    {activeTab === 'orders' && 'Istoric Cumpărături'}
                                    {activeTab === 'admin' && 'Control Panel Admin'}
                                </h3>
                                <p>
                                    {activeTab === 'products' && 'Gestionați produsele listate la vânzare.'}
                                    {activeTab === 'orders' && 'Vizualizați toate comenzile plasate.'}
                                    {activeTab === 'admin' && 'Gestionați utilizatorii și securitatea platformei.'}
                                </p>
                            </div>
                        </div>

                        <div className="profile-tabs-nav">
                            <button
                                className={`tab-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <List size={18}/> Anunțuri
                            </button>

                            <button
                                className={`tab-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <ShoppingBag size={18}/> Comenzi
                            </button>

                            {user.role === 'ADMIN' && (
                                <button
                                    className={`tab-nav-item admin-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('admin')}
                                >
                                    <ShieldCheck size={18}/> Admin Panel
                                </button>
                            )}
                        </div>

                        <div className="tab-container-content">
                            {activeTab === 'products' && <MyProducts/>}
                            {activeTab === 'orders' && <OrderHistory/>}
                            {activeTab === 'admin' && user.role === 'ADMIN' && <AdminDashboard/>}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default Profile;