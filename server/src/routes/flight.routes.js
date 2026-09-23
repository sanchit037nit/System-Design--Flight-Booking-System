const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Get all flights"
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: `Get flight ${req.params.id}`
  });
});

router.post("/", (req, res) => {
  res.status(201).json({
    message: "Create flight",
    data: req.body
  });
});

module.exports = router;