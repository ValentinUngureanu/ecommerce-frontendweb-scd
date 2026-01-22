import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail} from 'lucide-react';
import {authService} from '../../api/authService';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await authService.login(formData.email, formData.password);

            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            console.error("Eroare la autentificare:", err);
            if (err.response && err.response.status === 401) {
                setError("Email sau parolă incorectă!");
            } else {
                setError("Eroare de conexiune la server. Verifică dacă Spring Boot rulează.");
            }
        }
    };

    return (
        <div className="login-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={20}/>
                <span>Înapoi la magazin</span>
            </button>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">X</div>
                    <h1>Bine ai revenit!</h1>
                    <p>Intră în contul tău XCart</p>
                </div>

                {error && <div className="error-message-box">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
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
                        <label>Parolă</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox"/>
                            <span>Ține-mă minte</span>
                        </label>
                        <a href="/forgot-password">Ai uitat parola?</a>
                    </div>

                    <button type="submit" className="login-submit-btn">
                        <LogIn size={20}/>
                        Autentificare
                    </button>
                </form>

                <div className="login-footer">
                    <p>Nu ai un cont? <a href="/register" onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                    }}>Creează cont nou</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;