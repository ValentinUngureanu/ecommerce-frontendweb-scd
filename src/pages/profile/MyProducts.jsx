import React, { useEffect, useState } from 'react';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import { Trash2, ExternalLink, PackageOpen, Loader2 } from 'lucide-react';
import './MyProducts.css';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchUserProducts();
    }, []);

    const fetchUserProducts = async () => {
        try {
            const res = await productService.getByUser(user.id);
            setProducts(res.data);
        } catch (err) {
            console.error("Eroare la încărcarea produselor tale:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
            try {
                // Sincronizat cu @DeleteMapping("/delete/{id}") din Java-ul tău
                await productService.delete(productId, user.id);
                setProducts(products.filter(p => p.id !== productId));
            } catch (err) {
                alert("Eroare la ștergere: " + (err.response?.data || err.message));
            }
        }
    };

    if (loading) return <div className="loading-inline"><Loader2 className="spinner" /> Se încarcă anunțurile tale...</div>;

    return (
        <div className="my-products-section">
            <div className="section-header">
                <h2>Anunțurile mele ({products.length})</h2>
            </div>

            {products.length === 0 ? (
                <div className="empty-products">
                    <PackageOpen size={48} />
                    <p>Nu ai postat niciun anunț încă.</p>
                </div>
            ) : (
                <div className="my-products-list">
                    {products.map(product => (
                        <div key={product.id} className="my-product-item">
                            <img src={product.imageUrl} alt={product.name} className="mini-thumb" />

                            <div className="my-product-info">
                                <h3>{product.name}</h3>
                                <p className="my-product-price">{product.price} RON</p>
                                <span className="my-product-category">{product.category}</span>
                            </div>

                            <div className="my-product-actions">
                                <button className="action-view-btn" title="Vezi anunț">
                                    <ExternalLink size={18} />
                                </button>
                                <button
                                    className="action-delete-btn"
                                    title="Șterge anunț"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;