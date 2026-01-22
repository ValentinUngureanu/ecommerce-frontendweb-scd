import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Eye, EyeOff, Lock, Mail, MapPin, Phone, ShieldAlert, User, UserPlus} from 'lucide-react';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [adminCode, setAdminCode] = useState("");
    const [isAdminVisible, setIsAdminVisible] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '', phone: '', location: ''
    });

    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);
        if (clickCount + 1 === 5) {
            setIsAdminVisible(true);
            setClickCount(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Parolele nu se potrivesc!");
            return;
        }

        try {
            const {confirmPassword, ...dataToSubmit} = formData;

            await axios.post(`http://localhost:8080/api/users/register?adminCode=${adminCode}`, dataToSubmit);

            alert("Cont creat cu succes!");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || "Eroare la înregistrare.");
        }
    };

    return (<div className="register-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={20}/>
                <span>Înapoi la magazin</span>
            </button>

            <div className="register-card">
                <div className="register-header">
                    <div
                        className="register-logo"
                        onClick={handleLogoClick}
                        title="XCart Logo"
                    >
                        X
                    </div>
                    <h1>Creează cont</h1>
                    <p>Alătură-te comunității XCart</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <label>Nume Utilizator</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon"/>
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
                            <Mail size={20} className="input-icon"/>
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
                            <Phone size={20} className="input-icon"/>
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
                            <MapPin size={20} className="input-icon"/>
                            <input
                                type="text"
                                placeholder="Oraș, Județ"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    {isAdminVisible && (<div className="input-group admin-code-group animated-fade-in">
                            <label>Cod Invitație Admin</label>
                            <div className="input-wrapper">
                                <ShieldAlert size={20} className="input-icon"/>
                                <input
                                    type="password"
                                    placeholder="Introdu codul secret"
                                    value={adminCode}
                                    onChange={(e) => setAdminCode(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>)}

                    <div className="input-group">
                        <label>Parolă</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Parolă"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button type="button" className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirmă Parola</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon"/>
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
                        <UserPlus size={20}/>
                        Creează Cont
                    </button>
                </form>

                <div className="register-footer">
                    <p>Ai deja un cont? <a href="/login">Autentifică-te</a></p>
                </div>
            </div>
        </div>);
};

export default Register;