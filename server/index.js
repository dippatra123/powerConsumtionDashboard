const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieparse = require("cookie-parser");

const app = express();
const port = 5030;
const JWT_SECRET = "mySecretKey123";

app.use(cors());
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
        sucess: false,
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
      massege: "no token found",
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
  (res.clearCookie("token"),
    res.json({
      sucess: true,
      message: "Logged out",
    }));
});
//<-------------get data for graph------------->
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
