const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { User } = require("./models/User");

async function register(req, res) {
  const { firstname, lastname, mobilenumber, password, createdBy } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ where: { mobilenumber } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await User.create({
      firstname,
      lastname,
      mobilenumber,
      password: hashedPassword,
      createdBy,
      updatedBy: createdBy,
    });

    
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    return res
      .status(201)
      .json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error registering user" });
  }
}

module.exports = { register };
