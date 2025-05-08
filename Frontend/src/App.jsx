import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import ProductCard from "./Components/Product";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching:", err);
      });
  }, []);

  // Filter products by search term and selected type
  const filteredData = data?.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All" || product.product_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Navbar />

      {/* Search input */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by product name"
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter dropdown */}
        <select
          className="form-control w-25"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          {/* Add more product types here */}
        </select>
      </div>

      {/* Display filtered products */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredData &&
          filteredData.map((product) => (
            <div
              key={product.id}
              className="card"
              style={{ width: "18rem", margin: "10px" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      <h1>Bismillah</h1>
      <h1>Shukriya</h1>
      <h1>Allhamdulliallah</h1>
    </>
  );
}

export default App;
