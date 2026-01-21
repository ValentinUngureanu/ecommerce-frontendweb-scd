import React from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // Imagine de rezervă dacă link-ul din DB este invalid
    const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200?text=XCart';

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="image-container">
                <img src={imageUrl} alt={product.name} loading="lazy" />
            </div>

            <div className="card-content">
                <div className="card-header-info">
                    <span className="category-tag">{product.category || 'General'}</span>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Adăugat în coș:", product.name);
                        }}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;