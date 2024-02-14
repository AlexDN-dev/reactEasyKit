const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./router/users.router");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
