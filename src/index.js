import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChartProduit from "./Pages/RecherchePage";
import Accueil from "./Pages/AccueilPage";
import GestionPage from "./Pages/GestionPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/Recherche" element={<ChartProduit />} />
        <Route path="/Gestion" element={<GestionPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
