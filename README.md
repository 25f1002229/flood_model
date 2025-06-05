# Chennai Flood Watch

A real-time flood monitoring and prediction system for Chennai, featuring an interactive map visualization and live alerts.

## Project Structure

```
flood-backend/  - FastAPI backend service
flood-frontend/ - React frontend application
```

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn
- Git

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd flood-backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .
   .\Scripts\Activate.ps1  # For Windows PowerShell
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd flood-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Features

- Real-time flood zone visualization
- Interactive map with risk level indicators
- Live alerts and warnings
- Incident reporting system
- Historical data analytics
- Emergency resource information

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for the complete API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
