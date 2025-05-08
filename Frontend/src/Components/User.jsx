import { useEffect, useState } from "react";
import ProductCard from "./Product";
import axios from "axios";
import "../Styles/User.css";

function User() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredData = data?.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All" || product.product_type === selectedType;
    return matchesSearch && matchesType;
  });
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("https://softtrine.onrender.com/products")
        .then((res) => {
          const activeProducts = res.data.filter(
            (product) => product.status === "1"
          );
          setData(activeProducts);
        })
        .catch((err) => {
          console.log("Error fetching:", err);
        });
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Clear on unmount
  }, []);

  return (
    <div className="container py-4">
      {/* Header */}
      {/* <div className="text-center mb-4">
        <h2 className="text-primary">Explore Products</h2>
      </div> */}

      {/* Search and Filter */}
      <div className="row g-2 align-items-center mb-4">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select shadow-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Categories</option>
            {[...new Set(data.map((product) => product.product_type))].map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="row">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100 shadow-sm product-card">
                <ProductCard product={product} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-4">No products found.</div>
        )}
      </div>
    </div>
  );
}

export default User;
