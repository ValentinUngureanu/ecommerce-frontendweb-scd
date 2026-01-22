import React from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200?text=XCart';

    const handleQuickAdd = async (e) => {
        // Oprim navigarea către pagina de detalii a produsului
        e.stopPropagation();

        if (!user) {
            // Nu mai afișăm alert(), trimitem direct la login
            navigate('/login');
            return;
        }

        try {
            // Apel către backend (CartController.java)
            await productService.addToCart(user.id, product.id);

            // --- NOTIFICARE PERSONALIZATĂ (FĂRĂ ALERT) ---
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: `"${product.name}" a fost adăugat în coș!` }
            }));

            // Actualizează badge-ul cu cifra de la coș în Navbar
            window.dispatchEvent(new Event('cartUpdated'));

        } catch (err) {
            console.error("Eroare adăugare rapidă:", err);

            // Notificare de eroare (opțional, poți folosi tot sistemul de notificări)
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: `Eroare la adăugarea "${product.name}" în coș.` }
            }));
        }
    };

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="image-container">
                <img src={imageUrl} alt={product.name} loading="lazy" />
                <div className="overlay-info">
                    <span className="category-tag">{product.category || 'General'}</span>
                </div>
            </div>

            <div className="card-content">
                <div className="card-header-info">
                    <h3>{product.name}</h3>
                </div>

                <div className="location">
                    <MapPin size={14} />
                    <span>{product.location || 'România'}</span>
                </div>

                <div className="card-footer">
                    <div className="price-tag">
                        <span className="amount">{product.price}</span>
                        <span className="currency">RON</span>
                    </div>
                    <button
                        className="add-cart-btn"
                        onClick={handleQuickAdd}
                        title="Adaugă rapid în coș"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;