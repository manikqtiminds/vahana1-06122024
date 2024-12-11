import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReferenceSelect from './components/ReferenceSelect';
import ReviewEdit from './pages/ReviewEdit';
import Report from './pages/Report';
import ExternalRedirect from './pages/ExternalRedirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReferenceSelect />} />
        <Route path="/review" element={<ReviewEdit />} />
        <Route path="/report" element={<Report />} />
        <Route path="/external" element={<ExternalRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;