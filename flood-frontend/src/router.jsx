import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LiveMap from './pages/LiveMap';
import ReportFlood from './pages/ReportFlood';
import Resources from './pages/Resources';
import DataAnalytics from './pages/DataAnalytics';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';

const AppRouter = () => (
  <Router>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/report" element={<ReportFlood />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/data" element={<DataAnalytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  </Router>
);

export default AppRouter;