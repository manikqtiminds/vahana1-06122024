import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReferenceSelect from './components/ReferenceSelect';
import ReviewEdit from './pages/ReviewEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReferenceSelect />} />
        <Route path="/review" element={<ReviewEdit />} />
        <Route path="/report" element={<div>Report Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;