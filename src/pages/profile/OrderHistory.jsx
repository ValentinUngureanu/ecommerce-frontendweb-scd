import React, { useEffect, useState } from 'react';
import { productService } from '../../api/productService.js';
import { authService } from '../../api/authService.js';
import { Package, Calendar, Tag, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const user = authService.getCurrentUser();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await productService.getOrdersByUser(user.id);
                setOrders(res.data);
            } catch (err) {
                console.error("Eroare la încărcarea comenzilor:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchOrders();
    }, [user?.id]);

    const toggleOrder = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    if (loading) return <div className="loading-simple">Se încarcă istoricul...</div>;

    return (
        <div className="order-history-section">
            {orders.length === 0 ? (
                <div className="no-orders">
                    <Package size={40} />
                    <p>Nu ai plasat nicio comandă încă.</p>
                </div>
            ) : (
                <div className="orders-container">
                    {orders.map(order => (
                        <div key={order.id} className={`order-group-card ${expandedOrder === order.id ? 'active' : ''}`}>
                            <div className="order-summary" onClick={() => toggleOrder(order.id)}>
                                <div className="order-info">
                                    <span className="order-id">{order.orderNumber}</span>
                                    <div className="order-meta">
                                        <Calendar size={14} />
                                        <span>{new Date(order.createdAt).toLocaleDateString('ro-RO')}</span>
                                    </div>
                                </div>
                                <div className="order-right">
                                    <div className="order-price-total">
                                        {order.totalAmount.toFixed(2)} RON
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="order-details-expanded">
                                    <div className="items-list">
                                        {order.items.map(item => (
                                            <div key={item.id} className="order-item-row">
                                                <img src={item.product.imageUrl} alt={item.product.name} className="item-mini-img" />
                                                <div className="item-text">
                                                    <h5>{item.product.name}</h5>
                                                    <p>{item.quantity} x {item.priceAtPurchase} RON</p>
                                                </div>
                                                <div className="item-subtotal">
                                                    {(item.quantity * item.priceAtPurchase).toFixed(2)} RON
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;