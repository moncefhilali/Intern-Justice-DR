import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { format } from "date-fns";
import { enUS, fr, ar } from "date-fns/locale";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ChartProduit() {
  const [ChartLabel, setChartLabel] = useState("");
  const [produitFournisseur, setproduitFournisseur] = useState("");
  const [produitCat, setproduitCat] = useState("");
  const [dataTribs, setDataTribs] = useState([]);
  const [dataServices, setDataServices] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataQteSorties, setDataQteSorties] = useState([]);
  const [dataDateSorties, setDataDateSorties] = useState([]);
  const [dataFullDate, setDataFullDate] = useState([]);
  var xValues = [];
  var yValues = [];
  var dValues = [];

  useEffect(() => {
    GetTribs();
    GetProducts();
  }, []);

  const GetTribs = () => {
    axios
      .get("http://localhost:5000/Tribs")
      .then((result) => {
        setDataTribs(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetServices = () => {
    var T = document.getElementById("selectnomTrib").value;
    axios
      .get("http://localhost:5000/Services", {
        params: {
          trib: dataTribs[T].trib,
        },
      })
      .then((result) => {
        setDataServices(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetProducts = () => {
    axios
      .get("http://localhost:5000/Produits")
      .then((result) => {
        setDataProducts(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ButtonRechercher = () => {
    var T = document.getElementById("selectnomTrib");
    var S = document.getElementById("selectnomService");
    var P = document.getElementById("selectnomProduit");
    var D = document.getElementById("dateSortie").value;
    if (
      P.selectedIndex === 0 ||
      S.selectedIndex === 0 ||
      T.selectedIndex === 0 ||
      D === ""
    ) {
      toast("❌ Veuillez remplir tout les champs !");
    } else {
      var MydateArray = D.split("-");
      axios
        .get("http://localhost:5000/get", {
          params: {
            id_article: dataProducts[P.value].id_article,
            service: dataServices[S.value].service,
            yearSortie: MydateArray[0],
            monthSortie: MydateArray[1],
          },
        })
        .then((result) => {
          if (result.data[0] === undefined) {
            toast("⚠️ Il n'y a pas de sorties à cette date!");
          }
          result.data.forEach((opts, i) => {
            var dateLower = format(new Date(opts.date_sortie), "MMMM d", {
              locale: fr,
            });
            xValues[i] = dateLower.charAt(0).toUpperCase() + dateLower.slice(1);
            yValues[i] = opts["Quantite Total"];
            var Dtable = format(new Date(opts.date_sortie), "MMMM", {
              locale: fr,
            });
            dValues[i] =
              format(new Date(opts.date_sortie), "d", {
                locale: fr,
              }) +
              " " +
              Dtable.charAt(0).toUpperCase() +
              Dtable.slice(1) +
              " " +
              format(new Date(opts.date_sortie), "Y", {
                locale: fr,
              });
          });
          setChartLabel(dataProducts[P.value].designation_article);
          setproduitFournisseur(dataProducts[P.value].nom_four);
          setproduitCat(dataProducts[P.value].cat);
          setDataDateSorties(xValues);
          setDataQteSorties(yValues);
          setDataFullDate(dValues);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // Chart Data
  const chartData = {
    labels: dataDateSorties,
    datasets: [
      {
        data: dataQteSorties,
        label: ChartLabel,
        backgroundColor: ["#36a2eb", "#4BC0C0"],
      },
    ],
  };

  // Chart Options
  const chartOption = {};

  //   Chart("myChart", {
  //     type: "bar",
  //     data: {
  //       labels: xValues,
  //       datasets: [
  //         {
  //           data: yValues,
  //           label: "Papier A4",
  //           backgroundColor: "blue",
  //         },
  //       ],
  //     },
  //   });

  return (
    <div>
      <Navbar />
      <div className="div-Recherche-Table">
        <div className="container-Recherche">
          <form className="form">
            <div className="UpperSection">
              <div className="LabelSection">
                <div id="divLabelAr">
                  <label>Selectionnez le trib</label>
                </div>
                <div id="divLabelDa">
                  <label>Selectionnez le service</label>
                </div>
              </div>
              <div className="InputSection">
                <div className="divSelect">
                  <select id="selectnomTrib" onChange={GetServices}>
                    <option hidden>-- Sélectionnez --</option>
                    {dataTribs.map((opts, i) => (
                      <option value={i}>{opts.trib}</option>
                    ))}
                  </select>
                </div>
                <div className="divDate">
                  <select id="selectnomService">
                    <option hidden>-- Sélectionnez --</option>
                    {dataServices.map((opts, i) => (
                      <option value={i}>{opts.service}</option>
                    ))}
                  </select>
                </div>
              </div>
              <br />
              <div className="LabelSection">
                <div id="divLabelAr">
                  <label>Selectionnez l'article</label>
                </div>
                <div id="divLabelDa">
                  <label>Selectionnez la date</label>
                </div>
              </div>
              <div className="InputSection">
                <div className="divSelect">
                  <select id="selectnomProduit">
                    <option hidden>-- Sélectionnez --</option>
                    {dataProducts.map((opts, i) => (
                      <option value={i}>{opts.designation_article}</option>
                    ))}
                  </select>
                </div>
                <div className="divDate">
                  <input type="month" name="date" id="dateSortie" />
                </div>
              </div>
              <br />
            </div>
            <button type="button" className="button" onClick={ButtonRechercher}>
              Rechercher
            </button>
          </form>
          <div className="container">
            <div id="myChart">
              <Bar data={chartData} />
            </div>
          </div>
        </div>
        <div className="Table-Recherche">
          <div className="container-table">
            <table className="Table-Info">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>:</th>
                  <th>{ChartLabel}</th>
                </tr>
                <tr>
                  <th>Catégorie</th>
                  <th>:</th>
                  <th>{produitCat}</th>
                </tr>
                <tr>
                  <th>Fournisseur</th>
                  <th>:</th>
                  <th>{produitFournisseur}</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="container-table">
            <table className="Table-Info">
              <thead>
                <tr>
                  <th>Date de Sortie</th>
                  <th>Quantité Total</th>
                </tr>
              </thead>
              <tbody id="table-tbody">
                {dataQteSorties.map((opts, i) => (
                  <tr id="tr-Body">
                    <td>{dataFullDate[i]}</td>
                    <td>{opts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ChartProduit;
