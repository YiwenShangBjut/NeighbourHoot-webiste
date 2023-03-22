import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import SplashPage from "./pages/SplashPage";
import UserTable from "./pages/UserTable";
import "./styles.css";

function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<SplashPage />} />
          <Route path="/user" exact element={<UserTable />} />
          <Route path="/create" exact element={<ClientPage />} />
          <Route path="/admin" element={ <AdminPage />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
