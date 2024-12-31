const express = require("express");
const { sequelize, testConnection } = require("./database");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

testConnection();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, mobile_number, password } = req.body;

    const existingUser = await User.findOne({ where: { mobile_number } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      mobile_number,
      password: hashedPassword,
      created_by: "system", 
      updated_by: "system", 
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { mobile_number, password } = req.body;

  try {
    const user = await User.findOne({ where: { mobile_number } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, mobile_number: user.mobile_number },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.get("/auth/google", (req, res) => {
  res.send("Google login integration (OAuth)");
});

app.get("/auth/facebook", (req, res) => {
  res.send("Facebook login integration (OAuth)");
});

app.get("/auth/apple", (req, res) => {
  res.send("Apple ID login integration (OAuth)");
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
