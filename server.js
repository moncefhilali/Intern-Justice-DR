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
  server: "DESKTOP-3SA4E25",
  database: "Intrn_Justice_DR",
  user: "sa",
  password: "1234",
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
  request.query("Select * from Produit", function (err, records) {
    if (err) console.log(err);
    else res.send(records.recordset);
  });
});

// Api get Tribs :
app.get("/Tribs", (req, res) => {
  request.query("Select * from Trib", function (err, records) {
    if (err) console.log(err);
    else res.send(records.recordset);
  });
});

// Api get Services :
app.get("/Services", (req, res) => {
  request.query(
    `Select * from _Service where idTrib = '${req.query.idTrib}'`,
    function (err, records) {
      if (err) console.log(err);
      else res.send(records.recordset);
    }
  );
});

// Api get total quantity :
app.get("/get", (req, res) => {
  request.query(
    `SELECT dateSortie ,sum(qteSortie) as 'Quantite Total' FROM Sortie WHERE idProduit = ${req.query.idProduit} AND idService = ${req.query.idService} AND DATEPART(MONTH,dateSortie) = '${req.query.monthSortie}' AND DATEPART(YEAR,dateSortie) = '${req.query.yearSortie}' group by dateSortie order by dateSortie`,
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
