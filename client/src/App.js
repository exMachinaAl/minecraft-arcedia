import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm/LoginForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Registrasi from "./components/Registrasi/Registrasi";
import Test from "./components/Test/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" Component={LoginForm} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/registrasi" Component={Registrasi} />
        <Route path="/test" Component={Test} />
        <Route exact path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
