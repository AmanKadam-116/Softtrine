const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "MYSQLPASS123", 
  database: "softtrine_task", 
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// API Routes
app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).send("Error signing up user");
    }
    res.status(201).json({ message: "User signed up successfully" });
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send("Error logging in user");
    }
    if (results.length > 0) {
      const user = results[0];
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});
// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching products");
    }

    res.json(results);
  });
});
// Update a product
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    slug,
    product_details,
    produt_url,
    product_type,
    status,
    brand,
    stock_quantity,
    price,
  } = req.body;

  const query = `
    UPDATE products SET
      product_name = ?, slug = ?, product_details = ?, produt_url = ?,
      product_type = ?, status = ?, brand = ?, stock_quantity = ?, price = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      product_name,
      slug,
      product_details,
      produt_url,
      product_type,
      status,
      brand,
      stock_quantity,
      price,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).send("Error updating product");
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});
// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).send("Error deleting product");
    }
    res.json({ message: "Product deleted successfully" });
  });
});
// Change product status (active/inactive)
app.patch("/products/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE products SET status = ? WHERE id = ?";

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating product status:", err);
      return res.status(500).send("Error updating product status");
    }

    // Fetch the updated product
    const fetchQuery = "SELECT * FROM products WHERE id = ?";
    db.query(fetchQuery, [id], (err, results) => {
      if (err) {
        console.error("Error fetching updated product:", err);
        return res.status(500).send("Error fetching updated product");
      }

      // Return the updated product
      res.json({
        message: "Product status updated successfully",
        product: results[0],
      });
    });
  });
});

// POST a new product
app.post("/products", (req, res) => {
  const {
    product_name,
    slug,
    product_details,
    produt_url,
    product_type,
    status,
    brand,
    stock_quantity,
    price,
  } = req.body;

  const query = `
    INSERT INTO products 
    (product_name, slug, product_details, produt_url, product_type, status, brand, stock_quantity, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      product_name,
      slug,
      product_details,
      produt_url,
      product_type,
      status,
      brand,
      stock_quantity,
      price,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);

      const newProduct = {
        id: result.insertId,
        ...req.body,
      };

      res.status(201).json(newProduct);
    }
  );
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
