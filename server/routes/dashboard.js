const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // we now have access to req.user once it passes the middleware
    res.json(req.user);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
