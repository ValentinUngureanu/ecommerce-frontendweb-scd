import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import Navbar from '../../components/layout/Navbar';
import { ArrowLeft, Save, Tag, DollarSign, Image as ImageIcon, AlignLeft, Layers, AlertCircle } from 'lucide-react';
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const currentUser = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
    });

    const categories = ["Electronice", "Fashion", "Casă & Grădină", "Auto", "Sport", "Jucării", "Imobiliare"];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getById(id);
                setFormData(res.data);
            } catch (err) {
                console.error("Eroare la preluarea datelor:", err);
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.id) {
            alert("Trebuie să fii logat pentru a face modificări.");
            return;
        }

        try {
            // Trimitem: ID Produs, ID User (pentru verificare posesor) și Datele noi
            await productService.update(id, currentUser.id, formData);

            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Anunțul a fost actualizat cu succes! ✨" }
            }));

            navigate('/profile');
        } catch (err) {
            console.error("Eroare la salvare:", err);
            alert("Eroare: Nu s-a putut actualiza produsul. Verifică drepturile de acces.");
        }
    };

    if (loading) return (
        <div className="edit-loading-wrapper">
            <div className="loader-spinner"></div>
            <p>Se încarcă detaliile produsului...</p>
        </div>
    );

    return (
        <div className="edit-product-page">
            <Navbar />

            <div className="edit-product-content">
                <header className="edit-page-header">
                    <button className="back-navigation" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        <span>Înapoi la profil</span>
                    </button>
                    <div className="header-text">
                        <h1>Editează Anunțul</h1>
                        <p>ID Produs: #{id}</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="edit-main-card">
                    <div className="edit-layout-grid">

                        {/* COLOANA STÂNGA: VIZUAL */}
                        <aside className="edit-visual-side">
                            <div className="image-preview-container">
                                <label className="field-label">Imagine Curentă</label>
                                <div className="image-frame">
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Imagine+Invalida'}
                                        />
                                    ) : (
                                        <div className="empty-image-state">
                                            <ImageIcon size={48} />
                                            <span>Nicio imagine</span>
                                        </div>
                                    )}
                                </div>
                                <div className="input-field-wrapper">
                                    <label><ImageIcon size={14} /> Link Imagine (URL)</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        placeholder="Lipeste URL-ul imaginii aici..."
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </aside>

                        {/* COLOANA DREAPTĂ: DATE */}
                        <section className="edit-details-side">
                            <div className="details-group">
                                <div className="input-field-wrapper full-width">
                                    <label><Tag size={14} /> Nume Produs</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="fields-row">
                                    <div className="input-field-wrapper">
                                        <label><DollarSign size={14} /> Preț (RON)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-field-wrapper">
                                        <label><Layers size={14} /> Categorie</label>
                                        <select name="category" value={formData.category} onChange={handleChange}>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-field-wrapper full-width">
                                    <label><AlignLeft size={14} /> Descriere</label>
                                    <textarea
                                        name="description"
                                        rows="10"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <footer className="form-actions">
                                <div className="info-notice">
                                    <AlertCircle size={16} />
                                    <span>Asigură-te că datele sunt corecte înainte de a salva.</span>
                                </div>
                                <button type="submit" className="save-action-btn">
                                    <Save size={20} />
                                    <span>Actualizează Anunțul</span>
                                </button>
                            </footer>
                        </section>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;