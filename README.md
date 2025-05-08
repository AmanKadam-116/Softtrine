# Softtrine Task - Product Management System

A full-stack web application for managing products with user authentication and role-based access control.

## Project Structure

```
├── Backend/              # Express.js server
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
│
└── Frontend/            # React + Vite application
    ├── src/
    │   ├── Components/  # React components
    │   ├── Styles/     # CSS stylesheets
    │   └── Store.jsx   # Global state management
    └── package.json    # Frontend dependencies
```

## Features

- User Authentication (Login/Signup)
- Role-based Access (Admin/User)
- Product Management
  - Add new products
  - Edit existing products
  - Delete products
  - Change product status
- Product Filtering
  - Search by product name
  - Filter by category
- Responsive Product Cards
- Bootstrap UI Integration

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- Body Parser

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Context API for state management

## Getting Started

### Prerequisites
- Node.js
- MySQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure MySQL connection in `index.js`:
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYSQLPASS123",
  database: "softtrine_task",
});
```

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## API Endpoints

### Authentication
- POST `/signup` - Register a new user
- POST `/login` - User login

### Products
- GET `/products` - Get all products
- POST `/products` - Create a new product
- PUT `/products/:id` - Update a product
- DELETE `/products/:id` - Delete a product
- PATCH `/products/:id/status` - Update product status

## Database Schema

### Users Table
- id (Primary Key)
- name
- email
- password
- role

### Products Table
- id (Primary Key)
- product_name
- slug
- product_details
- produt_url
- product_type
- status
- brand
- stock_quantity
- price

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC License
