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
        e.stopPropagation();

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
            console.error("Eroare adăugare rapidă:", err);

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