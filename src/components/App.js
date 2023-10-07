import Loader from "./Loader";
import Navbar from "./Navbar";
import { Home, Login, Signup, PageNotFound, Settings, UserProfile } from '../pages/index';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../hooks";


function PrivateRoute({ element }) {
  const auth = useAuth();
  const isAuthenticated = auth.user ? true : false;

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  const auth = useAuth();
  if (auth.loading){
    return <Loader />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/settings" exact element={<PrivateRoute element={<Settings />} />} />
          <Route path="/user/:userId" exact element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
