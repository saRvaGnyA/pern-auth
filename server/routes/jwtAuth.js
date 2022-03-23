const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const jwtGenerator = require("../util/jwtGenerator");

// register
router.post("/register", validInfo, async (req, res) => {
  try {
    // Step 1. Destructure req.body
    const { name, email, password } = req.body;

    // Step 2. Check if user exists (if exists, throw error)
    const user = await pool.query("SELECT * FROM USERS WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      res.status(401).send("User already exists");
    }

    // Step 3. Bcrypt the user's password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPW = await bcrypt.hash(password, salt);

    // Step 4. Enter the user inside our DB
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPW]
    );

    // Step 5. Generate the JWT token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Login route
router.post("/login", validInfo, async (req, res) => {
  try {
    // Step 1. Destructure req.body
    const { email, password } = req.body;

    // Step 2. Check if user exists (if not, throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      res.status(401).send("Invalid credentials");
    }

    // Step 3. Check if incoming PW is the same as the DB PW
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    ); // returns a boolean

    if (!validPassword) {
      res.status(401).send("Incorrect Password");
    }

    // Step 4. Send them the JWT token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Verify JWT
router.get("/is-verify", authorization, async (req, res) => {
  try {
    console.log(req.user);
    res.send("true");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
