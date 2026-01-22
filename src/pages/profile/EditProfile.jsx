import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import Navbar from '../../components/layout/Navbar';
import { ArrowLeft, User, Mail, MapPin, Phone, Lock, Save, Link, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        location: currentUser?.location || '',
        profilePictureUrl: currentUser?.profilePictureUrl || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- SALVARE DATE PERSONALE ---
    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                profilePictureUrl: formData.profilePictureUrl
            };

            // Trimitem datele către UserController.java
            await authService.updateProfile(currentUser.id, updateData);

            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Profilul a fost actualizat cu succes! ✨" }
            }));
        } catch (err) {
            console.error("Eroare server 500:", err.response?.data);
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Eroare la comunicarea cu serverul. Verificați baza de date. ❌" }
            }));
        }
    };

    // --- SCHIMBARE PAROLĂ ---
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (formData.oldPassword !== currentUser.password) {
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Parola curentă este incorectă! ⚠️" }
            }));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Parolele noi nu coincid! ❌" }
            }));
            return;
        }

        try {
            await authService.updateProfile(currentUser.id, {
                password: formData.newPassword
            });

            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Parola a fost actualizată cu succes! 🔒" }
            }));

            setFormData({ ...formData, oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="edit-profile-page">
            <Navbar />
            <div className="edit-container">
                <button className="back-btn-simple" onClick={() => navigate('/profile')}>
                    <ArrowLeft size={18} /> Înapoi la profil
                </button>

                <div className="edit-main-grid">
                    <div className="edit-section-card">
                        <div className="section-header">
                            <User size={20} />
                            <h3>Informații Profil</h3>
                        </div>

                        <div className="avatar-edit-wrapper">
                            <div className="avatar-preview">
                                {formData.profilePictureUrl ? (
                                    <img
                                        src={formData.profilePictureUrl}
                                        alt="Profile"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Imagine+Invalida'}
                                    />
                                ) : (
                                    <span className="avatar-placeholder">
                                        {formData.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleUpdateInfo} className="edit-form-content">
                            <div className="edit-input-group">
                                <label><ImageIcon size={14}/> URL Imagine Profil</label>
                                <div className="url-input-wrapper">
                                    <Link size={16} className="url-icon" />
                                    <input
                                        type="text"
                                        name="profilePictureUrl"
                                        placeholder="Introduceți link-ul imaginii sau codul base64..."
                                        value={formData.profilePictureUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="edit-input-group">
                                <label><User size={14}/> Nume utilizator</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="edit-input-group">
                                <label><Mail size={14}/> Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="edit-input-group">
                                <label><Phone size={14}/> Telefon</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="edit-input-group">
                                <label><MapPin size={14}/> Locație</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} />
                            </div>
                            <button type="submit" className="action-save-btn">
                                <Save size={18} /> Salvează Datele
                            </button>
                        </form>
                    </div>

                    <div className="edit-section-card">
                        <div className="section-header">
                            <ShieldCheck size={20} />
                            <h3>Securitate Cont</h3>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="edit-form-content">
                            <div className="edit-input-group">
                                <label>Parola curentă</label>
                                <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
                            </div>
                            <div className="edit-input-group password-divider">
                                <label>Parola nouă</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                            </div>
                            <div className="edit-input-group">
                                <label>Confirmă parola nouă</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="action-save-btn security-btn">
                                <Lock size={18} /> Actualizează Parola
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;