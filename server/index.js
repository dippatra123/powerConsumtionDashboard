const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = 5030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getData", async (req, res) => {
  try {
    const [rows] = await pool.query(`select* from vw_all_machine_consumption`);

    if (rows.length === 0) {
      return res.json({ massege: "No data Found" });
    }
    newRows = rows.map((ele) => {
      const date = new Date(ele.date);
      return {
        ...ele,
        date:
          String(date.getDate()).padStart(2, "0") +
          "-" +
          String(date.getMonth()).padStart(2, "0") +
          "-" +
          date.getFullYear(),
      };
    });

    res.json(newRows);
  } catch (err) {
    console.error("Error fetching completed cycles:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`my app is running on :${port}`);
});
