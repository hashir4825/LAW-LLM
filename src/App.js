import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import MyEditor from "./component/MyEditor";

const App = () => {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            
            <Route path="/" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />}  />
            <Route path="/Editor" element={<MyEditor />}  />
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
