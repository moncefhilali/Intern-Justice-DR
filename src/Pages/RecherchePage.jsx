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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ChartProduit() {
  const [ChartLabel, setChartLabel] = useState("");
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
      alert("veuillez remplir tout les champs svp!");
    } else {
      var MydateArray = D.split("-");
      console.log(MydateArray);
      axios
        .get("http://localhost:5000/get", {
          params: {
            idProduit: dataProducts[P.value].idProduit,
            idService: dataServices[S.value].idService,
            yearSortie: MydateArray[0],
            monthSortie: MydateArray[1],
          },
        })
        .then((result) => {
          result.data.forEach((opts, i) => {
            var dateLower = format(new Date(opts.dateSortie), "MMMM d", {
              locale: fr,
            });
            xValues[i] = dateLower.charAt(0).toUpperCase() + dateLower.slice(1);
            yValues[i] = opts["Quantite Total"];
            var Dtable = format(new Date(opts.dateSortie), "MMMM", {
              locale: fr,
            });
            dValues[i] =
              format(new Date(opts.dateSortie), "d", {
                locale: fr,
              }) +
              " " +
              Dtable.charAt(0).toUpperCase() +
              Dtable.slice(1) +
              " " +
              format(new Date(opts.dateSortie), "Y", {
                locale: fr,
              });
          });
          setChartLabel(dataProducts[P.value].nomProduit);
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
                      <option value={i}>{opts.nomTrib}</option>
                    ))}
                  </select>
                </div>
                <div className="divDate">
                  <select id="selectnomService">
                    <option hidden>-- Sélectionnez --</option>
                    {dataServices.map((opts, i) => (
                      <option value={i}>{opts.nomService}</option>
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
                      <option value={i}>{opts.nomProduit}</option>
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
        <div className="container-table">
          <table className="Table-Info">
            <thead>
              <tr id="tr-Titre">
                <th colSpan="2">Produit : {ChartLabel}</th>
              </tr>
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
  );
}

export default ChartProduit;
