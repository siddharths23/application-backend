const express = require("express");
const Destination = require("../models/Destination");
const auth = require("../utils/auth");
const User = require("../models/User");

const router = express.Router();

// Get all destinations
router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    let destinations;

    if (query) {
      const regex = new RegExp(escapeRegex(query), "gi");
      destinations = await Destination.find({ title: regex });
    } else {
      destinations = await Destination.find();
    }

    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// Get destination by ID
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    res.json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create a new destination
router.post("/", auth, async (req, res) => {
  const { title, description, dayPlans } = req.body;

  try {
    const newDestination = new Destination({
      title,
      description,
      dayPlans,
    });

    const destination = await newDestination.save();

    res.json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update destination
router.put("/:id", auth, async (req, res) => {
  const { title, description, dayPlans } = req.body;

  const destinationFields = { title, description, dayPlans };

  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: destinationFields },
      { new: true }
    );

    res.json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete destination
router.delete("/:id", auth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    await Destination.findByIdAndRemove(req.params.id);

    res.json({ message: "Destination removed." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
