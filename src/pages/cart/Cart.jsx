import React, { useEffect, useState } from 'react';
import { productService } from '../../api/productService';
import { authService } from '../../api/authService';
import Navbar from '../../components/layout/Navbar';
import { Trash2, ShoppingBag, Minus, Plus, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await productService.getCart(user.id);
            setCartItems(res.data);
        } catch (err) {
            console.error("Eroare coș:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!user?.id) return;
        try {
            const res = await productService.placeOrder(user.id);

            // --- NOTIFICARE PLASARE COMANDĂ (FĂRĂ ALERT) ---
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: `Comanda ${res.data.orderNumber} a fost plasată cu succes! 🚚` }
            }));

            window.dispatchEvent(new Event('cartUpdated'));
            setCartItems([]);

            // Navigăm direct către Home după succes
            navigate('/');
        } catch (err) {
            console.error("Eroare la comandă:", err);
            // Notificare de eroare în aplicație
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: "Nu s-a putut plasa comanda. Te rugăm să încerci din nou." }
            }));
        }
    };

    const handleUpdateQuantity = async (cartItemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            await productService.updateCartQuantity(cartItemId, newQty);
            setCartItems(cartItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQty } : item
            ));
        } catch (err) {
            console.error("Eroare actualizare cantitate:", err);
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            const itemToRemove = cartItems.find(item => item.id === cartItemId);

            await productService.removeFromCart(cartItemId);

            // --- NOTIFICARE ȘTERGERE PRODUS (FĂRĂ ALERT) ---
            window.dispatchEvent(new CustomEvent('app-notification', {
                detail: { message: `"${itemToRemove?.product.name}" a fost scos din coș.` }
            }));

            setCartItems(cartItems.filter(item => item.id !== cartItemId));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error("Eroare la ștergere:", err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2);
    };

    if (loading) return <div className="loader-box"><Loader2 className="spinner" /></div>;

    return (
        <div className="cart-page">
            <Navbar />
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Coșul de cumpărături</h1>
                    <span>{cartItems.length} produse salvate</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart-view">
                        <ShoppingBag size={80} strokeWidth={1} />
                        <p>Coșul tău este gol în acest moment.</p>
                    </div>
                ) : (
                    <div className="cart-main-layout">
                        <div className="cart-items-column">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-db-item">
                                    <img src={item.product.imageUrl} alt={item.product.name} />
                                    <div className="db-item-info">
                                        <h4>{item.product.name}</h4>
                                        <p className="db-item-price">{item.product.price} RON</p>
                                        <div className="db-qty-actions">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}><Minus size={14}/></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}><Plus size={14}/></button>
                                        </div>
                                    </div>
                                    <button className="db-remove-btn" onClick={() => handleRemove(item.id)}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <aside className="cart-checkout-card">
                            <h3>Sumar comandă</h3>
                            <div className="sum-line"><span>Subtotal:</span><span>{calculateTotal()} RON</span></div>
                            <div className="sum-line"><span>Livrare:</span><span className="free-tag">Gratuit</span></div>
                            <div className="sum-total"><span>Total:</span><span>{calculateTotal()} RON</span></div>
                            <button className="final-pay-btn" onClick={handlePlaceOrder}>
                                <CreditCard size={18}/> Finalizează plata
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;