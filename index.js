const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const config = {
  user: "sanja",
  password: "helloworldnew",
  server: "localhost", // Use 'localhost\\instance' for named instances
  database: "xstoreArchive",
  options: {
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};

// Create the SQL Server connection pool
let poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Database Connected to SQL Server");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

async function connectAndQuery() {
  try {
    const pool = await sql.connect(config);
    let result = await pool
      .request()
      .query("SELECT * FROM xstoreArchive.dbo.data_comparison");
    return result;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
}

app.get("/", (req, res) => {
  res.send("hello world");
});
///////////////////////////////////////////??????????????????????????????????
// app.get("/dashboard", async (req, res) => {
//   try {
//     const result = await connectAndQuery();
//     res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
//   } catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// });
/////////////////////////////////////////??????????????????????????????

app.get("/dashboard", async (req, res) => {
  const { status, storeNo, startDate, endDate } = req.query;
  try {
    let query = "SELECT * FROM xstoreArchive.dbo.data_comparison WHERE 1=1";
    if (status && status !== "ALL") {
      query += ` AND status = ${status}`;
    }
    if (storeNo && storeNo !== "ALL") {
      query += ` AND store_no = ${storeNo}`;
    }
    if (startDate && endDate) {
      query += ` AND store_business_date BETWEEN '${startDate}' AND '${endDate}'`;
    }
    // console.log("SQL QUERY: ", query); // Log the query////////////////////////////////////////
    const pool = await sql.connect(config);
    let result = await pool.request().query(query);
    res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

//////////////////////////////////////////////??????????????????????????????????

app.get("/data", async (req, res) => {
  const { status } = req.query;
  try {
    let query = "SELECT * FROM xstoreArchive.dbo.data_comparison";
    if (status) {
      query += ` WHERE status = ${status}`;
    }
    const pool = await sql.connect(config);
    let result = await pool.request().query(query);
    res.json({ msg: "Fetch Users Successfully", data: result.recordsets });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/data", async (req, res) => {
  const {
    store_no,
    store_business_date,
    reg_no,
    store_trans_no,
    xcenter_business_date,
    xcenter_trans_no,
    status,
  } = req.body;
  try {
    const pool = await poolPromise;
    let result = await pool
      .request()
      .input("store_no", sql.Int, store_no)
      .input("store_business_date", sql.Date, store_business_date)
      .input("reg_no", sql.Int, reg_no)
      .input("store_trans_no", sql.Int, store_trans_no)
      .input("xcenter_business_date", sql.Date, xcenter_business_date)
      .input("xcenter_trans_no", sql.Int, xcenter_trans_no)
      .input("status", sql.Int, status)
      .query(`INSERT INTO xstoreArchive.dbo.data_comparison (
        store_no, store_business_date, reg_no, store_trans_no, xcenter_business_date,
        xcenter_trans_no, status) VALUES (@store_no, @store_business_date, @reg_no, @store_trans_no, @xcenter_business_date, @xcenter_trans_no, @status)`);

    res.json({ msg: "Data Inserted Successfully", data: result });
  } catch (err) {
    console.error("Error while inserting data: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/data", async (req, res) => {
  const {
    store_no,
    store_business_date,
    reg_no,
    store_trans_no,
    xcenter_business_date,
    xcenter_trans_no,
    status,
  } = req.body;
  try {
    const pool = await poolPromise;
    let result = await pool
      .request()
      .input("store_no", sql.Int, store_no)
      .input("store_business_date", sql.Date, store_business_date)
      .input("reg_no", sql.Int, reg_no)
      .input("store_trans_no", sql.Int, store_trans_no)
      .input("xcenter_business_date", sql.Date, xcenter_business_date)
      .input("xcenter_trans_no", sql.Int, xcenter_trans_no)
      .input("status", sql.Int, status)
      .query(`UPDATE xstoreArchive.dbo.data_comparison
        SET xcenter_business_date = @xcenter_business_date, xcenter_trans_no = @xcenter_trans_no, status = @status
        WHERE store_no = @store_no AND store_business_date = @store_business_date AND reg_no = @reg_no AND store_trans_no = @store_trans_no`);

    res.json({ msg: "Data Updated Successfully", data: result });
  } catch (err) {
    console.error("Error while updating data: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/data", async (req, res) => {
  const { store_no, store_business_date, reg_no, store_trans_no } = req.body;
  try {
    const pool = await poolPromise;
    let result = await pool
      .request()
      .input("store_no", sql.Int, store_no)
      .input("store_business_date", sql.Date, store_business_date)
      .input("reg_no", sql.Int, reg_no)
      .input("store_trans_no", sql.Int, store_trans_no)
      .query(`DELETE FROM xstoreArchive.dbo.data_comparison
        WHERE store_no = @store_no AND store_business_date = @store_business_date AND reg_no = @reg_no AND store_trans_no = @store_trans_no`);

    res.json({ msg: "Data Deleted Successfully", data: result });
  } catch (err) {
    console.error("Error while deleting data: ", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
