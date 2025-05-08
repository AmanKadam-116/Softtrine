import "../Styles/ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card shadow-sm border-0">
      <div className="product-image-wrapper">
        <img
          src={product.produt_url}
          className="product-image"
          alt={product.product_name}
        />
        <span className="badge badge-new">New</span>
      </div>

      <div className="product-body">
        <h5 className="product-title">{product.product_name}</h5>
        <p className="product-description">{product.product_details}</p>
      </div>

      <ul className="product-info-list">
        <li>💲 ${product.price}</li>
        <li>🏷 {product.brand}</li>
        <li>📦 {product.product_type}</li>
      </ul>
    </div>
  );
};

export default ProductCard;
