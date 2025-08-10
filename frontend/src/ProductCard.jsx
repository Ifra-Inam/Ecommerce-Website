import React from 'react';

function ProductCard( { product }) {

  const {title, price, image, rating} = product;
  
  return (

    <div className="product-card">

      <div><img src={image} alt={title}/></div>

      <div className="product-text">
        <h3>{title}</h3>
        <h4>${price}</h4>
        <h4>{rating.rate}</h4>
      </div>

    </div>

  );

}

export default ProductCard;