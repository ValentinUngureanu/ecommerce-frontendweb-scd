import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, Eye, EyeOff, Phone, MapPin } from 'lucide-react';
import { authService } from '../../api/authService';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        location: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Parolele nu se potrivesc!");
            return;
        }

        try {
            // Trimitem obiectul filtrat fără confirmPassword către backend
            const { confirmPassword, ...dataToSubmit } = formData;
            await authService.register(dataToSubmit);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || "Eroare la înregistrare.");
        }
    };

    return (
        <div className="register-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={20} />
                <span>Înapoi la magazin</span>
            </button>

            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo">X</div>
                    <h1>Creează cont</h1>
                    <p>Alătură-te comunității XCart</p>
                </div>

                {error && <div className="error-message" style={{color: '#BA1A1A', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <label>Nume Utilizator</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Utilizator"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                placeholder="nume@exemplu.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Telefon</label>
                        <div className="input-wrapper">
                            <Phone size={20} className="input-icon" />
                            <input
                                type="text"
                                placeholder="07xxxxxxxx"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Locație</label>
                        <div className="input-wrapper">
                            <MapPin size={20} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Oraș, Județ"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Parolă</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Parolă"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirmă Parola</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Repetă parola"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-submit-btn">
                        <UserPlus size={20} />
                        Creează Cont
                    </button>
                </form>

                <div className="register-footer">
                    <p>Ai deja un cont? <a href="/login">Autentifică-te</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;