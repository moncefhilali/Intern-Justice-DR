import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionPage = () => {
  const [dataProduits, setDataProduits] = useState([]);
  const [dataTribs, setDataTribs] = useState([]);
  const [dataServices, setDataServices] = useState([]);

  useEffect(() => {
    getProduits();
    getTribs();
  }, []);

  const getTribs = () => {
    axios
      .get("http://localhost:5000/Tribs")
      .then((result) => {
        setDataTribs(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProduits = () => {
    axios
      .get("http://localhost:5000/Produits")
      .then((result) => {
        setDataProduits(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getServices = () => {
    var T = document.getElementById("select-Sortie-nomTrib").value;
    axios
      .get("http://localhost:5000/Services", {
        params: {
          idTrib: dataTribs[T].idTrib,
        },
      })
      .then((result) => {
        setDataServices(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const postProduit = (e) => {
    e.preventDefault();
    var nP = document.getElementById("select-Produit-nomProduit").value;
    var qP = document.getElementById("select-Produit-qteProduit").value;
    axios
      .get("http://localhost:5000/post/Produit", {
        params: {
          nomProduit: nP,
          qteProduit: qP,
        },
      })
      .then(() => {
        document.getElementById("select-Produit-nomProduit").value = "";
        document.getElementById("select-Produit-qteProduit").value = "";
        toast("✔️ Le produit a été inséré !");
        getProduits();
      })
      .catch((error) => {
        toast("❌ Le produit n'a pas été inséré !");
        console.log(error);
      });
  };

  const postService = (e) => {
    e.preventDefault();
    var iT = document.getElementById("select-Service-nomTrib").value;
    var nS = document.getElementById("select-Service-nomService").value;
    axios
      .get("http://localhost:5000/post/Service", {
        params: {
          idTrib: dataTribs[iT].idTrib,
          nomService: nS,
        },
      })
      .then(() => {
        document.getElementById("select-Service-nomService").value = "";
        toast("✔️ Le service a été inséré !");
      })
      .catch((error) => {
        toast("❌ Le service n'a pas été inséré !");
        console.log(error);
      });
  };

  const postSortie = (e) => {
    e.preventDefault();
    var P = document.getElementById("select-Sortie-nomProduit").value;
    var S = document.getElementById("select-Sortie-nomService").value;
    var Q = document.getElementById("select-Sortie-qteSortie").value;
    var D = document.getElementById("select-Sortie-dateProduit").value;
    axios
      .get("http://localhost:5000/post/Sortie", {
        params: {
          idProduit: dataProduits[P].idProduit,
          idService: dataServices[S].idService,
          qteSortie: Q,
          dateSortie: D,
        },
      })
      .then(() => {
        toast("✔️ Le sortie a été inséré !");
      })
      .catch((error) => {
        toast("❌ Le sortie n'a pas été inséré !");
        console.log(error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container-Gestion">
        <div className="Gestion-Upper">
          <form className="form" onSubmit={postProduit}>
            <legend>Ajouter un Produit</legend>
            <table>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Nom"
                    id="select-Produit-nomProduit"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantité"
                    id="select-Produit-qteProduit"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="submit" value="Enregister" id="Form-Submit" />
                </td>
              </tr>
            </table>
          </form>
          <form className="form" onSubmit={postService}>
            <legend>Ajouter un Service</legend>
            <table>
              <tr>
                <td>
                  <select id="select-Service-nomTrib">
                    <option value="default" hidden>
                      -- Trib
                    </option>
                    {dataTribs.map((opts, i) => (
                      <option value={i}>{opts.nomTrib}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Nom"
                    id="select-Service-nomService"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="submit" value="Enregister" id="Form-Submit" />
                </td>
              </tr>
            </table>
          </form>
        </div>
        <div className="Gestion-Lower">
          <form className="form" onSubmit={postSortie}>
            <legend>Ajouter un Sortie</legend>
            <table>
              <tr>
                <td colSpan="2">
                  <select id="select-Sortie-nomProduit">
                    <option value="default" hidden>
                      -- Produit
                    </option>
                    {dataProduits.map((opts, i) => (
                      <option value={i}>{opts.nomProduit}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <select id="select-Sortie-nomTrib" onChange={getServices}>
                    <option value="default" hidden>
                      -- Trib
                    </option>
                    {dataTribs.map((opts, i) => (
                      <option value={i}>{opts.nomTrib}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select id="select-Sortie-nomService">
                    <option value="default" hidden>
                      -- Service
                    </option>
                    {dataServices.map((opts, i) => (
                      <option value={i}>{opts.nomService}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantité"
                    id="select-Sortie-qteSortie"
                    required
                  />
                </td>
                <td>
                  <input type="date" id="select-Sortie-dateProduit" required />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <input type="submit" value="Enregister" id="Form-Submit" />
                </td>
              </tr>
            </table>
          </form>
        </div>
        <div className="container"></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GestionPage;
