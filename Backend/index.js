const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000; // Render sets the PORT environment variable

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
// !!! WARNING: Hardcoding credentials is a security risk. !!!
// !!! Ensure host and port are the correct EXTERNAL details for your database accessible from Render. !!!
const pool = mysql.createPool({
  connectionLimit: 10, // Max number of connections in pool
  host: "asia-south1-001.proxy.kinsta.app", // Your provided host
  user: "vole",
  password: "hC1_jP0-tH5-tF5=xW0+",
  database: "imperial-harlequin-cardinal",
  port: 30008, // Your provided port
  waitForConnections: true, // Wait for a connection when all are in use
  queueLimit: 0, // Unlimited queue when waiting for connections
  connectTimeout: 10000 // 10 seconds to connect
});

// Optional: Test the pool connection at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL pool:", err);
    // More specific error handling can be added here if needed
    // e.g., check err.code for 'ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', etc.
    return;
  }
  if (connection) {
    connection.release(); // Important to release the connection back to the pool
    console.log("Successfully connected to MySQL pool.");
  }
});

// API Routes (all db.query calls are now pool.query)

app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  pool.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      console.error("Error signing up user:", err);
      return res.status(500).send("Error signing up user");
    }
    res.status(201).json({ message: "User signed up successfully" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error logging in user:", err);
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

app.get("/products", (req, res) => {
  pool.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err); // This is where ECONNRESET would have been caught
      return res.status(500).send("Error fetching products");
    }
    res.json(results);
  });
});

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

  pool.query(
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
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";

  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).send("Error deleting product");
    }
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

app.patch("/products/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status === 'undefined') {
    return res.status(400).json({ message: "Status is required" });
  }

  const updateQuery = "UPDATE products SET status = ? WHERE id = ?";
  pool.query(updateQuery, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating product status:", err);
      return res.status(500).send("Error updating product status");
    }
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found or status unchanged" });
    }

    const fetchQuery = "SELECT * FROM products WHERE id = ?";
    pool.query(fetchQuery, [id], (fetchErr, results) => {
      if (fetchErr) {
        console.error("Error fetching updated product:", fetchErr);
        return res.status(200).json({ // Send 200 as update was successful
          message: "Product status updated successfully, but failed to fetch updated product.",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found after update."});
      }
      res.json({
        message: "Product status updated successfully",
        product: results[0],
      });
    });
  });
});

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

  if (!product_name || !price) {
    return res.status(400).json({ message: "Product name and price are required." });
  }

  const query = `
    INSERT INTO products
    (product_name, slug, product_details, produt_url, product_type, status, brand, stock_quantity, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
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
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).send("Error inserting product");
      }
      const newProduct = {
        id: result.insertId,
        product_name,
        slug,
        product_details,
        produt_url,
        product_type,
        status,
        brand,
        stock_quantity,
        price,
      };
      res.status(201).json(newProduct);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});