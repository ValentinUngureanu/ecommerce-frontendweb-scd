import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {authService} from '../../api/authService';
import {productService} from "../../api/productService.js";
import {ShieldCheck, ShoppingBag, Tag, Trash2, UserCheck, Users} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const admin = authService.getCurrentUser();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'users') {
                    const res = await axios.get(`http://localhost:8080/api/users/admin/all?requesterId=${admin.id}`);
                    setUsers(res.data);
                } else {
                    const res = await axios.get(`http://localhost:8080/api/products`);
                    setProducts(res.data);
                }
            } catch (err) {
                console.error("Eroare la încărcare:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, admin.id]);

    const sendNavNotif = (msg) => {
        const notifEvent = new CustomEvent('app-notification', {
            detail: {message: msg}
        });
        window.dispatchEvent(notifEvent);
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Ești sigur că vrei să elimini definitiv utilizatorul "${userName}"?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${userId}?requesterId=${admin.id}`);
                setUsers(users.filter(u => u.id !== userId));
                sendNavNotif(`Utilizatorul "${userName}" a fost șters cu succes de pe platformă.`);
            } catch (err) {
                sendNavNotif(`Eroare la ștergerea utilizatorului "${userName}".`);
            }
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Sigur vrei să ștergi produsul "${productName}"?`)) {
            try {
                await productService.delete(productId, admin.id);
                setProducts(products.filter(p => p.id !== productId));
                sendNavNotif(`Produsul "${productName}" a fost eliminat de către administrator.`);
            } catch (err) {
                sendNavNotif(`Eroare la ștergerea produsului "${productName}".`);
            }
        }
    };

    if (loading) return <div className="loader-mini">Se încarcă panoul de control...</div>;

    return (
        <div className="admin-panel">
            <div className="admin-tabs">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={18}/> Utilizatori
                </button>
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    <ShoppingBag size={18}/> Produse
                </button>
            </div>

            {activeTab === 'users' ? (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Utilizator</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="user-cell">
                                <div className="u-avatar">
                                    {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span>{u.username}</span>
                            </td>
                            <td>{u.email}</td>
                            <td>
                                    <span className={`role-badge ${u.role}`}>
                                        {u.role === 'ADMIN' ? <ShieldCheck size={14}/> : <UserCheck size={14}/>}
                                        {u.role}
                                    </span>
                            </td>
                            <td>
                                {u.id !== admin.id && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(u.id, u.username)}
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Imagine</th>
                        <th>Produs</th>
                        <th>Preț</th>
                        <th>Vânzător</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td><img src={p.imageUrl} alt="" className="admin-prod-img"/></td>
                            <td>
                                <div className="prod-info">
                                    <strong>{p.name}</strong>
                                    <span><Tag size={12}/> {p.category}</span>
                                </div>
                            </td>
                            <td className="price-text">{p.price} RON</td>
                            <td>{p.user?.username || 'Necunoscut'}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;