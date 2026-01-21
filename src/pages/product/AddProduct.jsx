import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import Navbar from '../../components/layout/Navbar';
import { PackagePlus, Image as ImageIcon, Tag, Coins, AlignLeft, MapPin, CheckCircle } from 'lucide-react';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronice',
        imageUrl: '',
        location: user?.location || ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            // Construim obiectul fix cum îl cere ProductController.java
            const productToSave = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                imageUrl: formData.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
                location: formData.location,
                stock: 1,
                user: {
                    id: parseInt(user.id) // Mapare pentru @ManyToOne
                }
            };

            await productService.create(productToSave);
            setStatus({ type: 'success', msg: 'Anunț publicat cu succes!' });
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            console.error("Eroare Backend:", err.response?.data);
            setStatus({
                type: 'error',
                msg: err.response?.data || 'Eroare la comunicarea cu serverul.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">
            <Navbar />
            <div className="add-container">
                <div className="add-card">
                    <div className="add-header">
                        <div className="header-icon-box"><PackagePlus size={32} /></div>
                        <h1>Vinde pe XCart</h1>
                        <p>Anunțul tău va fi vizibil imediat</p>
                    </div>

                    {status.msg && <div className={`status-banner ${status.type}`}>{status.msg}</div>}

                    <form onSubmit={handleSubmit} className="add-form">
                        <div className="form-section">
                            <label><Tag size={18} /> Nume Produs</label>
                            <input type="text" placeholder="Ex: iPhone 15" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>

                        <div className="form-grid">
                            <div className="form-section">
                                <label>Categorie</label>
                                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option>Electronice</option><option>Fashion</option><option>Auto</option><option>Casă & Grădină</option>
                                </select>
                            </div>
                            <div className="form-section">
                                <label><Coins size={18} /> Preț (RON)</label>
                                <input type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                            </div>
                        </div>

                        <div className="form-section">
                            <label><ImageIcon size={18} /> URL Imagine</label>
                            <input type="text" placeholder="https://link-imagine.jpg" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                            {formData.imageUrl && (
                                <div className="url-preview-box">
                                    <img src={formData.imageUrl} alt="Preview" onError={(e) => e.target.src='https://via.placeholder.com/150?text=Imagine+Invalida'} />
                                </div>
                            )}
                        </div>

                        <div className="form-section">
                            <label><MapPin size={18} /> Locație</label>
                            <input type="text" placeholder="Orașul tău" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                        </div>

                        <div className="form-section">
                            <label><AlignLeft size={18} /> Descriere</label>
                            <textarea rows="4" placeholder="Detalii..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Se publică...' : 'Publică Anunțul'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;