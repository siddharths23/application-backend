const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoutes = require("./routes/users");
const destinationRoutes = require("./routes/destinations");

const Destination = require("./models/Destination");
const sampleDestinations = require("./sampleDestinations");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const seedDB = async () => {
  try {
    await Destination.deleteMany({});
    console.log("Destinations removed.");

    await Destination.insertMany(sampleDestinations);
    console.log("Sample destinations added.");
  } catch (error) {
    console.log(error);
  }
};

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Atlas connected.");
    await seedDB();
  })
  .catch((error) => console.log(error));

app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
