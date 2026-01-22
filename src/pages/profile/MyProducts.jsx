import React, { useEffect, useState } from 'react';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Package } from 'lucide-react';
import './MyProducts.css';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserProducts = async () => {
            if (!currentUser || !currentUser.id) return;

            setLoading(true);
            try {
                // Folosim metoda dedicată din productService.js
                const res = await productService.getByUser(currentUser.id);
                console.log("Produse primite de la server pentru acest user:", res.data);
                setProducts(res.data);
            } catch (err) {
                console.error("Eroare la încărcarea produselor tale:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUserProducts();
    }, [currentUser?.id]);

    const handleDelete = async (id) => {
        if (window.confirm("Ești sigur că vrei să ștergi acest anunț?")) {
            try {
                // Atenție: Metoda delete din service-ul tău cere (id, userId)
                await productService.delete(id, currentUser.id);
                setProducts(products.filter(p => p.id !== id));

                window.dispatchEvent(new CustomEvent('app-notification', {
                    detail: { message: "Produsul a fost șters. 🗑️" }
                }));
            } catch (err) {
                console.error("Eroare la ștergere:", err);
            }
        }
    };

    if (loading) return <div className="loader-mini">Se încarcă anunțurile tale...</div>;

    return (
        <div className="my-products-list">
            {products.length === 0 ? (
                <div className="no-products-state">
                    <Package size={40} />
                    <p>Nu ai postat niciun anunț încă.</p>
                    <button onClick={() => navigate('/add-product')} className="add-first-btn">
                        Postează primul anunț
                    </button>
                </div>
            ) : (
                products.map(product => (
                    <div key={product.id} className="my-product-item">
                        <div className="item-preview">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/80'}
                                alt={product.name}
                            />
                            <div className="item-details">
                                <h4>{product.name}</h4>
                                <span className="item-price">{product.price} RON</span>
                            </div>
                        </div>

                        <div className="my-product-actions">
                            <button
                                className="action-icon-btn edit-btn"
                                onClick={() => navigate(`/edit-product/${product.id}`)}
                            >
                                <Edit3 size={18} />
                                <span>Editează</span>
                            </button>

                            <button
                                className="action-icon-btn delete-btn"
                                onClick={() => handleDelete(product.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyProducts;