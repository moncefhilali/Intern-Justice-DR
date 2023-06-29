const sql = require("mssql");
const express = require("express");
const app = express();

// ADD THIS CORS !!!
var cors = require("cors");
app.use(cors());

// Port :
const port = 5000;
app.listen(port, () => console.log(`listening on port ${port}...`));

// Config :
var config = {
  server: "10.10.23.116",
  database: "sdr_achat_back",
  user: "webAppUser",
  password: "124599",
  options: {
    trustServerCertificate: true,
  },
};

var request;
// Connect to Sql Server :
sql
  .connect(config)
  .then(() => {
    console.log("Connected!");
    request = new sql.Request();
  })
  .catch((err) => {
    console.log("connecting error", err);
  });

// Api get products :
app.get("/Produits", (req, res) => {
  request.query(
    "select top 40 id_article, designation_article, q_sortie, cat, nom_four from sdr_achat_back.dbo.web_app_stat_view",
    function (err, records) {
      if (err) console.log(err);
      else res.send(records.recordset);
    }
  );
});

// Api get Tribs :
app.get("/Tribs", (req, res) => {
  request.query(
    "select distinct top 50 trib from sdr_achat_back.dbo.web_app_stat_view",
    function (err, records) {
      if (err) console.log(err);
      else res.send(records.recordset);
    }
  );
});

// Api get Services :
app.get("/Services", (req, res) => {
  request.query(
    `select distinct service from sdr_achat_back.dbo.web_app_stat_view where trib = '${req.query.trib}'`,
    function (err, records) {
      if (err) console.log(err);
      else res.send(records.recordset);
    }
  );
});

// Api get total quantity :
app.get("/get", (req, res) => {
  request.query(
    `SELECT CAST(date_sortie AS DATE) as 'date_sortie', sum(q_sortie) as 'Quantite Total' FROM sdr_achat_back.dbo.web_app_stat_view WHERE id_article = ${req.query.id_article} AND service = '${req.query.service}' AND DATEPART(MONTH,date_sortie) = '${req.query.monthSortie}' AND DATEPART(YEAR,date_sortie) = '${req.query.yearSortie}' group by CAST(date_sortie AS DATE) order by CAST(date_sortie AS DATE)`,
    function (err, records) {
      if (err) console.log(err);
      else res.send(records.recordset);
    }
  );
});

// Post :

// Api post Produit :
app.get("/post/Produit", (req, res) => {
  request.query(
    `Insert into Produit values('${req.query.nomProduit}',${req.query.qteProduit})`,
    function (err) {
      if (err) console.log(err);
      else res.send(true);
    }
  );
});

// Api post Service :
app.get("/post/Service", (req, res) => {
  request.query(
    `Insert into _Service values(${req.query.idTrib},'${req.query.nomService}')`,
    function (err) {
      if (err) console.log(err);
      else res.send(true);
    }
  );
});

// Api post Sortie :
app.get("/post/Sortie", (req, res) => {
  request.query(
    `Insert into Sortie values(${req.query.idProduit},${req.query.idService},${req.query.qteSortie},'${req.query.dateSortie}')`,
    function (err) {
      if (err) console.log(err);
      else res.send(true);
    }
  );
});
