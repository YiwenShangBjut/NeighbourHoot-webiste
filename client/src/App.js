import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ClientPage from "./pages/ClientPage";
import EnhancedTable from "./pages/AdminTable";
import "./styles.css";

function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<ClientPage />} />
          <Route path="/admin" element={ <EnhancedTable />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
