import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from './App.jsx';
import SearchIcon from './assets/search.svg';
import ProductCard from './ProductCard.jsx';

function ProductsList() {
  
    const { searchProducts, products, searchTerm, setSearchTerm } = useData();

    return (
        <div className="products-list">
            
            <div className="search-section">
                <input 
                    type="text"
                    placeholder="Search for products"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <img 
                    src={SearchIcon}
                    onClick={() => searchProducts(searchTerm)}
                    alt="Search Image"
                    style={{ width: '100px' }}                />
            </div>

            {products.length > 0 ? 
            (<div className="product-container">{products.map(product => <Link key={product.id} to={`/products/${product.id}`}><ProductCard product={product}/></Link>)}</div>) 
            : 
            (<div className="empty-container">Loading...</div>)}

        </div>
    );

}

export default ProductsList;