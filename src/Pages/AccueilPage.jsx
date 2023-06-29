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

function Accueil() {
  const [ChartLabel, setChartLabel] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataNomProduits, setDataNomProduits] = useState([]);
  const [dataQteProduits, setDataQteProduits] = useState([]);
  var xValues = [];
  var yValues = [];

  useEffect(() => {
    GetProducts();
  }, []);

  const GetProducts = () => {
    axios
      .get("http://localhost:5000/Produits")
      .then((result) => {
        setDataProducts(result.data);
        result.data.forEach((opts, i) => {
          var dP = opts.designation_article.substring(0, 15);
          xValues[i] = dP;
          yValues[i] = opts.q_sortie;
        });
        setDataNomProduits(xValues);
        setDataQteProduits(yValues);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Chart Data
  const chartData = {
    labels: dataNomProduits,
    datasets: [
      {
        data: dataQteProduits,
        label: "Quantité Total des Produits",
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
      <div className="Main">
        <div className="Main-Chart">
          <div id="myChart">
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
