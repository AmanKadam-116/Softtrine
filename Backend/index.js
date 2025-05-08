const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// const bodyParser = require("body-parser"); // bodyParser is built into modern Express

const app = express();
// Render sets the PORT environment variable. Fallback to 5000 for local dev.
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in Express middleware for parsing JSON
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// MySQL Connection
// !!! WARNING: Hardcoding credentials is a security risk. !!!
// !!! WARNING: The 'host' below is the INTERNAL host from your screenshot. !!!
// !!! You likely need the EXTERNAL host from Sevalla after enabling "Public access". !!!
const db = mysql.createConnection({
  host: "asia-south1-001.proxy.kinsta.app", // <--- UPDATE THIS if you get an External Host from Sevalla
  user: "vole",
  password: "hC1_jP0-tH5-tF5=xW0+",
  database: "imperial-harlequin-cardinal",
  port: 30008, // This is the standard MySQL port, confirm if Sevalla's external port is different
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    // In a real application, you might want to exit or have retry logic
    // For Render, if the DB connection fails, the app might crash or become unhealthy.
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
      console.error("Error signing up user:", err);
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

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
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
    produt_url, // Note: typo in original code, 'produt_url' should likely be 'product_url'
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
      produt_url, // Consistent with body, but consider fixing typo
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

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
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

// Change product status (active/inactive)
app.patch("/products/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status === 'undefined') {
    return res.status(400).json({ message: "Status is required" });
  }

  const query = "UPDATE products SET status = ? WHERE id = ?";

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating product status:", err);
      return res.status(500).send("Error updating product status");
    }
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found or status unchanged" });
    }

    // Fetch the updated product
    const fetchQuery = "SELECT * FROM products WHERE id = ?";
    db.query(fetchQuery, [id], (fetchErr, results) => {
      if (fetchErr) {
        console.error("Error fetching updated product:", fetchErr);
        // Still send success for the update, but note the fetch error
        return res.status(200).json({
          message: "Product status updated successfully, but failed to fetch updated product.",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found after update."})
      }

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
    produt_url, // Note: typo in original code
    product_type,
    status,
    brand,
    stock_quantity,
    price,
  } = req.body;

  // Basic validation (you might want more robust validation)
  if (!product_name || !price) {
    return res.status(400).json({ message: "Product name and price are required." });
  }

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
      produt_url, // Consistent with body
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