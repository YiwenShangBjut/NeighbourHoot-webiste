import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import SplashPage from "./pages/SplashPage";
import UserTable from "./pages/UserTable";
import "./styles.css";

function App() {
  // add new page here
  return (
    <Routes>
      
      <Route path="/" index element={<SplashPage />} />
      <Route path="user" element={<UserTable />} />
      <Route path="create" element={<ClientPage />} />
      <Route path="admin" element={<AdminPage />} />
    </Routes>
  );
}
export default App;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
