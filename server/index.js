const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieparse = require("cookie-parser");

const app = express();
const port = 5030;
const JWT_SECRET = "mySecretKey123";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieparse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//<----------login api----------->
app.post("/api/login", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({
      message: "Fill all fields",
    });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM user_table WHERE user_name = ?",
      [user_name],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "30m",
      },
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production with HTTPS
      maxAge: 30 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

//<----------auth middleware------------>
const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      messege: "No token found",
    });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
//<-------------auth check---------------->
app.get("/api/auth-check", authMiddleWare, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.user,
  });
});
//<-----------log out api----------->
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out",
  });
});
//<-------------get data for graph------------->
app.get("/getData", authMiddleWare, async (req, res) => {
  try {
    const [rows] = await pool.query(`select* from vw_all_machine_consumption`);

    if (rows.length === 0) {
      return res.json({ massege: "No data Found" });
    }
    const newRows = rows.map((ele) => {
      const date = new Date(ele.date);
      return {
        ...ele,
        date:
          String(date.getDate()).padStart(2, "0") +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
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
app.get(
  "/api/getData/everyDayPowerConsumtion",
  authMiddleWare,
  async (req, res) => {
    try {
      let { startDate, endDate } = req.query;

      // Default: Current month
      if (!startDate || !endDate) {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        startDate = `${year}-${month}-01`;
        endDate = `${year}-${month}-${day}`;
      }

      const [rows] = await pool.query(
        `
        SELECT *
        FROM vw_all_machine_consumption
        WHERE date BETWEEN ? AND ?
        ORDER BY date, machine_name
        `,
        [startDate, endDate],
      );

      if (rows.length === 0) {
        return res.json({
          message: "No data found",
          data: [],
        });
      }

      // Format Date
      const newRow = rows.map((ele) => {
        const dateCon = new Date(ele.date);

        return {
          ...ele,
          date:
            String(dateCon.getDate()).padStart(2, "0") +
            "-" +
            String(dateCon.getMonth() + 1).padStart(2, "0") +
            "-" +
            dateCon.getFullYear(),
        };
      });

      // Total Energy
      const totalEnergyConsumption = Number(
        newRow
          .reduce((acc, ele) => acc + Number(ele.consumption_kwh || 0), 0)
          .toFixed(2),
      );

      // Total Production
      const totalProduction = Number(
        newRow
          .reduce((acc, ele) => acc + Number(ele.production || 0), 0)
          .toFixed(2),
      );

      // Efficiency
      const efficiency =
        totalEnergyConsumption === 0
          ? 0
          : Number((totalProduction / totalEnergyConsumption).toFixed(2));

      // Total Days
      const days =
        Math.floor(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
        ) + 1;

      // Average Per Day
      const averagePerDay =
        days === 0 ? 0 : Number((totalEnergyConsumption / days).toFixed(2));

      // Daily Consumption
      const dailyConsumption = newRow.reduce((acc, ele) => {
        if (!acc[ele.date]) {
          acc[ele.date] = 0;
        }

        acc[ele.date] += Number(ele.consumption_kwh || 0);

        return acc;
      }, {});

      const dailyConsumptionArray = Object.entries(dailyConsumption).map(
        ([date, consumption]) => ({
          date,
          consumption: Number(consumption.toFixed(2)),
        }),
      );

      // Machine-wise Consumption
      const machineWiseConsumption = newRow.reduce((acc, ele) => {
        if (!acc[ele.machine_name]) {
          acc[ele.machine_name] = 0;
        }

        acc[ele.machine_name] += Number(ele.consumption_kwh || 0);

        return acc;
      }, {});

      const machineWiseConsumptionArray = Object.entries(
        machineWiseConsumption,
      ).map(([machine_name, consumption]) => ({
        machine_name,
        consumption: Number(consumption.toFixed(2)),
      }));

      return res.json({
        message: "success",

        summary: {
          totalEnergyConsumption,
          totalProduction,
          efficiency,
          averagePerDay,
          totalDays: days,
        },

        dailyConsumption: dailyConsumptionArray,

        machineWiseConsumption: machineWiseConsumptionArray,

        data: newRow,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  },
);
app.listen(port, () => {
  console.log(`my app is running on :${port}`);
});
