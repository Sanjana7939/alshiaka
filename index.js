const express = require("express");
const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const app = express();

var config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  driver: process.env.DRIVER,
  options: {
    trustedConnection: true,
  },
};

const db = sql.connect(config, function (err) {
  if (err) {
    console.error("Database connection failed:", err.message);
    // throw err;
    return;
  }
  console.log("Database Connected");
});

// app.get("/getUsersList", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query("SELECT * FROM TestTable");
//     res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
//   } catch (err) {
//     console.error("SQL error:", err.message);
//     res.status(500).send("An error occurred while fetching data.");
//   }
// });

app.get("/", (req, res) => {
  res.send("<p>Welcome to the project</p>");
});

app.get("/about", (req, res) => {
  res.send("<p>About page</p>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

// const express = require("express");
// const sql = require("mssql/msnodesqlv8");
// const { processError } = require("./utils");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const config = {
//   server: process.env.SERVER,
//   database: process.env.DATABASE,
//   driver: process.env.DRIVER,
//   options: {
//     trustedConnection: true,
//   },
// };

// // Function to connect to the SQL Server
// const connectToDatabase = () => {
//   return new Promise((resolve, reject) => {
//     sql.connect(config, (err) => {
//       if (err) {
//         reject(new Error(`Database connection failed: ${err.message}`));
//       } else {
//         console.log("Database Connected");
//         resolve();
//       }
//     });
//   });
// };

// // Configure routes
// app.get("/getUsersList", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query("SELECT * FROM TestTable");
//     res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
//   } catch (err) {
//     console.error("SQL error:", err.message);
//     res.status(500).send("An error occurred while fetching data.");
//   }
// });

// app.get("/", (req, res) => {
//   res.send("<p>Welcome to the project</p>");
// });

// app.get("/about", (req, res) => {
//   res.send("<p>About page</p>");
// });

// // Initialize the server after connecting to the database
// connectToDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is listening at port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error(processError(error, "Error initializing server"));
//   });
