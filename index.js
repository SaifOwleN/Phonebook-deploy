require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Entry = require("./models/entries");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("Data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :Data")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const date = new Date().toLocaleString();
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone;

  response.send(
    `<p>Phonebook has info for ${Entry.length} people </p></br><p>${date} ${local}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Entry.find({}).then((entry) => res.json(entry));
});

app.get("/api/persons/:id", (req, res) => {
  Entry.findById(request.params.id).then((entry) => {
    if (entry) {
      return res.json(entry);
    } else {
      res.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id != id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const entry = new Entry({
    name: req.body.name,
    number: req.body.number,
  });
  if (!entry.name) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (!entry.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  entry.save().then((entry) => res.json(entry));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
