import React, { useEffect, useState } from 'react';
import { productService } from '../../api/productService';
import Navbar from '../../components/layout/Navbar';
import ProductCard from '../../components/ui/ProductCard';
import { Filter, LayoutGrid, Tag, ChevronRight } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Toate ofertele");
    const [activeCategory, setActiveCategory] = useState("Toate");

    const categories = [
        "Electronice", "Fashion", "Casă & Grădină",
        "Auto", "Sport", "Jucării", "Imobiliare"
    ];

    const loadAll = async () => {
        setLoading(true);
        try {
            const res = await productService.getAll();
            setProducts(res.data);
            setTitle("Toate ofertele");
            setActiveCategory("Toate");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            loadAll();
            return;
        }
        setLoading(true);
        try {
            const res = await productService.search(query);
            setProducts(res.data);
            setTitle(`Rezultate pentru "${query}"`);
            setActiveCategory(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (cat) => {
        setLoading(true);
        setActiveCategory(cat);
        try {
            const res = await productService.getByCategory(cat);
            setProducts(res.data);
            setTitle(`Produse din ${cat}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-layout">
            <Navbar onSearch={handleSearch} />

            <div className="home-content">
                {/* SIDEBAR CATEGORII */}
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-title">
                            <LayoutGrid size={20} />
                            <span>Categorii</span>
                        </div>
                        <div className="category-list">
                            <button
                                className={`category-item ${activeCategory === "Toate" ? 'active' : ''}`}
                                onClick={loadAll}
                            >
                                <span>Toate produsele</span>
                                <ChevronRight size={16} />
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    <span>{cat}</span>
                                    <ChevronRight size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MAIN FEED */}
                <main className="main-feed">
                    <div className="feed-header">
                        <h2>{title}</h2>
                        <span className="product-count">{products.length} produse găsite</span>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Se încarcă XCart...</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="empty-state">
                            <h3>Nu am găsit niciun rezultat</h3>
                            <p>Încearcă să cauți altceva sau să schimbi categoria.</p>
                            <button onClick={loadAll} className="reset-btn">Resetează filtrele</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;