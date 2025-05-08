import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const Store = createContext();
const StoreComponent = ({ children }) => {
  //for Seller Component
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

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
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
      .put(`http://localhost:5000/products/${editId}`, formData)
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
      .patch(`http://localhost:5000/products/${product.id}/status`, {
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
        .delete(`http://localhost:5000/products/${id}`)
        .then(() => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  const handleAddProduct = () => {
    axios
      .post("http://localhost:5000/products", formData)
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
  return (
    <>
      <Store.Provider
        value={{
          products,
          setProducts,
          searchTerm,
          setSearchTerm,
          selectedType,
          setSelectedType,
          filteredProducts,
          showModal,
          setShowModal,
          formData,
          setFormData,
          handleChange,
          handleOnEdit,
          handleUpdateProduct,
          handleOnChangeStatus,
          handleOnDelete,
          handleAddProduct,
        }}
      >
        {children}
      </Store.Provider>
    </>
  );
};
export default StoreComponent;
