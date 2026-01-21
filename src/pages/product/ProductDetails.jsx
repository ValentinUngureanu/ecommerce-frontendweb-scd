import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import Navbar from '../../components/layout/Navbar';
import { ShoppingCart, MapPin, User, ArrowLeft, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Se folosește metoda getById din productService
                const res = await productService.getById(id);
                setProduct(res.data);
            } catch (err) {
                console.error("Eroare la încărcarea produsului:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p>Se încarcă detaliile...</p>
        </div>
    );

    if (!product) return <div className="error-state">Produsul nu a fost găsit.</div>;

    return (
        <div className="details-page">
            <Navbar />

            <div className="details-container">
                <button className="back-link" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Înapoi la bazar
                </button>

                <div className="product-main-grid">
                    {/* GALERIE IMAGINE */}
                    <div className="product-gallery">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>

                    {/* PANOU INFORMAȚII */}
                    <div className="product-info-panel">
                        <div className="info-header">
                            <span className="category-badge">{product.category}</span>
                            <h1>{product.name}</h1>
                            <div className="location-tag">
                                <MapPin size={16} />
                                <span>{product.location}</span>
                            </div>
                        </div>

                        <div className="price-section">
                            <span className="price-amount">{product.price}</span>
                            <span className="price-currency">RON</span>
                        </div>

                        <div className="action-buttons">
                            <button className="buy-now-btn">
                                <ShoppingCart size={20} /> Adaugă în coș
                            </button>
                            <button className="chat-btn">
                                <MessageCircle size={20} /> Mesaj cu vânzătorul
                            </button>
                        </div>

                        <div className="trust-badges">
                            <div className="badge">
                                <ShieldCheck size={20} />
                                <span>Plată sigură prin XCart</span>
                            </div>
                            <div className="badge">
                                <Truck size={20} />
                                <span>Livrare prin curier disponibilă</span>
                            </div>
                        </div>

                        {/* CARD VÂNZĂTOR - CORELARE CU BACKEND */}
                        <div className="seller-card">
                            <h3>Informații vânzător</h3>
                            <div className="seller-profile">
                                <div className="seller-avatar">
                                    <User size={24} />
                                </div>
                                <div className="seller-details">
                                    <p className="seller-name">
                                        {product.user?.username || 'Vânzător XCart'}
                                    </p>
                                    <p className="seller-rating">⭐⭐⭐⭐⭐ (Cont verificat)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESCRIERE */}
                <div className="product-description-section">
                    <h2>Descriere produs</h2>
                    <p>{product.description || 'Acest produs nu are o descriere detaliată.'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;