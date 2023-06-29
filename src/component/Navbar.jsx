import React from "react";

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="Navbar-links-left">
        <dir className="div-link1">
          <a href="/">Accueil</a>
        </dir>
        <div className="div-link2">
          <a href="/Recherche">Recherche</a>
        </div>
      </div>
      <div className="Navbar-links-right">
        <div className="div-link3">
          <a href="/Gestion">Gestion</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
