import React, { useEffect, useState, useMemo } from 'react';
import { productService } from '../../api/productService';
import Navbar from '../../components/layout/Navbar';
import ProductCard from '../../components/ui/ProductCard.jsx';
import { Filter, LayoutGrid, ChevronRight, DollarSign } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Toate ofertele");
    const [activeCategory, setActiveCategory] = useState("Toate");

    // --- STĂRI PENTRU FILTRARE PREȚ ---
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

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
            setMinPrice(""); // Resetăm prețurile la "Toate"
            setMaxPrice("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    // --- LOGICA DE FILTRARE (FRONTEND) ---
    // Folosim useMemo pentru a recalcula lista filtrată doar când se schimbă produsele sau prețul
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const price = p.price;
            const min = minPrice === "" ? 0 : parseFloat(minPrice);
            const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
            return price >= min && price <= max;
        });
    }, [products, minPrice, maxPrice]);

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
                <aside className="sidebar">
                    {/* SECȚIUNE CATEGORII */}
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

                    {/* --- SECȚIUNE FILTRARE PREȚ --- */}
                    <div className="sidebar-section price-filter-section">
                        <div className="sidebar-title">
                            <Filter size={20} />
                            <span>Filtrare Preț</span>
                        </div>
                        <div className="price-inputs-container">
                            <div className="price-field">
                                <label>Min (RON)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                            <div className="price-field">
                                <label>Max (RON)</label>
                                <input
                                    type="number"
                                    placeholder="99999"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        {(minPrice || maxPrice) && (
                            <button className="clear-price-btn" onClick={() => { setMinPrice(""); setMaxPrice(""); }}>
                                Șterge filtrele de preț
                            </button>
                        )}
                    </div>
                </aside>

                <main className="main-feed">
                    <div className="feed-header">
                        <h2>{title}</h2>
                        <span className="product-count">{filteredProducts.length} produse găsite</span>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Se încarcă XCart...</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {/* Randăm filteredProducts în loc de products */}
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="empty-state">
                            <h3>Nu am găsit niciun rezultat</h3>
                            <p>Încearcă să modifici prețul sau să schimbi categoria.</p>
                            <button onClick={loadAll} className="reset-btn">Resetează tot</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;