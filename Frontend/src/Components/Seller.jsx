import { useState, useEffect } from "react";
import axios from "axios";

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    slug: "",
    product_details: "",
    produt_url: "",
    product_type: "",
    status: "1",
    brand: "",
    stock_quantity: "",
    price: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [editId, setEditId] = useState(null);

  const handleOnEdit = (product) => {
    setFormData(product);
    setEditId(product.id);
    setShowModal(true);
  };

  const handleUpdateProduct = () => {
    axios
      .put(`https://softtrine.onrender.com/products/${editId}`, formData)
      .then(() => {
        setProducts((prev) =>
          prev.map((p) => (p.id === editId ? { ...p, ...formData } : p))
        );
        setShowModal(false);
        setEditId(null);
        setFormData({
          product_name: "",
          slug: "",
          product_details: "",
          produt_url: "",
          product_type: "",
          status: "1",
          brand: "",
          stock_quantity: "",
          price: "",
        });
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  const handleOnChangeStatus = (product) => {
    const newStatus = product.status === "1" ? "0" : "1";
    axios
      .patch(`https://softtrine.onrender.com/products/${product.id}/status`, {
        status: newStatus,
      })
      .then(() => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, status: newStatus } : p
          )
        );
      })
      .catch((err) => console.error("Error changing status:", err));
  };

  const handleOnDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`https://softtrine.onrender.com/products/${id}`)
        .then(() => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  const handleAddProduct = () => {
    axios
      .post("https://softtrine.onrender.com/products", formData)
      .then((res) => {
        const newProduct = res.data;
        setProducts([...products, newProduct]);
        setShowModal(false);
        setFormData({
          product_name: "",
          slug: "",
          product_details: "",
          produt_url: "",
          product_type: "",
          status: "1",
          brand: "",
          stock_quantity: "",
          price: "",
        });
      })
      .catch((err) => {
        console.error("Error adding product:", err);
      });
  };

  useEffect(() => {
    axios
      .get("https://softtrine.onrender.com/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data); // Initialize filteredProducts with all products
      })
      .catch((err) => console.log("Error fetching:", err));
  }, []);

  useEffect(() => {
    // Filter products based on search term and selected type
    const filtered = products.filter((product) => {
      const matchesSearchTerm = product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "" || product.product_type === selectedType;
      return matchesSearchTerm && matchesType;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedType, products]);

  return (
    <div className="container my-5">
      <div className="row align-items-center mb-4">
        <div className="col-md-5 mb-2">
          <input
            type="text"
            placeholder="Search by product name"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select Product Type</option>
            {[...new Set(products.map((product) => product.product_type))].map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>
        <div className="col-md-3 text-md-end text-center">
          <button
            className="btn btn-primary w-100 w-md-auto"
            onClick={() => setShowModal(true)}
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card p-4 shadow">
            <h5 className="mb-3">{editId ? "Edit Product" : "Add Product"}</h5>
            {[
              { label: "Product Name", name: "product_name" },
              { label: "Slug", name: "slug" },
              { label: "Product Details", name: "product_details" },
              { label: "Image URL", name: "produt_url" },
              { label: "Category", name: "product_type" },
              { label: "Brand", name: "brand" },
              {
                label: "Stock Quantity",
                name: "stock_quantity",
                type: "number",
              },
              { label: "Price", name: "price", type: "number" },
            ].map((field) => (
              <div className="mb-2" key={field.name}>
                <input
                  type={field.type || "text"}
                  className="form-control"
                  placeholder={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select mb-3"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={editId ? handleUpdateProduct : handleAddProduct}
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Details</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredProducts) &&
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.produt_url}
                      alt={product.product_name}
                      width="50"
                      height="50"
                      className="rounded"
                    />
                  </td>
                  <td>{product.product_name}</td>
                  <td>{product.slug}</td>
                  <td>{product.product_details}</td>
                  <td>{product.product_type}</td>
                  <td>{product.brand}</td>
                  <td>${product.price}</td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.status === "1" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {product.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleOnEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleOnDelete(product.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleOnChangeStatus(product)}
                      >
                        Change Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seller;
