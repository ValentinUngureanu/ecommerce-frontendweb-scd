import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import Navbar from '../../components/layout/Navbar';
import { ShoppingCart, MapPin, User, ArrowLeft, ShieldCheck, Truck, Languages, Loader2, RotateCcw } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // State-uri pentru traducere
    const [translatedDesc, setTranslatedDesc] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
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

    // Funcția de traducere
    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const res = await productService.translateDescription(id);
            setTranslatedDesc(res.data.translatedDescription);

            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Descrierea a fost tradusă în engleză!" }
            }));
        } catch (err) {
            console.error("Eroare la traducere:", err);
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "AI-ul se trezește. Reîncearcă în 20 secunde." }
            }));
        } finally {
            setIsTranslating(false);
        }
    };

    const handleAddToCart = async () => {
        const user = authService.getCurrentUser();

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await productService.addToCart(user.id, product.id);
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: `"${product.name}" a fost adăugat în coș!` }
            }));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error("Eroare la adăugare:", err);
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Eroare: Nu s-a putut adăuga produsul în coș." }
            }));
        }
    };

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
                    <div className="product-gallery">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>

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
                            <button className="buy-now-btn" onClick={handleAddToCart}>
                                <ShoppingCart size={20} /> Adaugă în coș
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
                                    <p className="seller-status">Cont verificat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECȚIUNE DESCRIERE CU TRADUCERE AI */}
                <div className="product-description-section">
                    <div className="description-header">
                        <h2>Descriere produs</h2>
                        <div className="translation-controls">
                            {!translatedDesc ? (
                                <button
                                    className="ai-translate-btn"
                                    onClick={handleTranslate}
                                    disabled={isTranslating}
                                >
                                    {isTranslating ? (
                                        <Loader2 size={16} className="spinner" />
                                    ) : (
                                        <Languages size={16} />
                                    )}
                                    {isTranslating ? "Se traduce..." : "Tradu în Engleză"}
                                </button>
                            ) : (
                                <button className="reset-desc-btn" onClick={() => setTranslatedDesc(null)}>
                                    <RotateCcw size={14} /> Vezi originalul (RO)
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="description-body">
                        {translatedDesc || product.description || 'Acest produs nu are o descriere detaliată.'}
                    </p>
                    {translatedDesc && <span className="ai-disclaimer">Traducere automată prin Hugging Face AI</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;