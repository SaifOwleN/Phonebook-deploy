require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Entry = require("./models/entries");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("Data", function (request, ) {
    return JSON.stringify(request.body);
});

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :Data")
);

const ErrorHandler = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

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

app.get("/api/persons/:id", (req, res, next) => {
    Entry.findById(req.params.id)
        .then((entry) => {
            if (entry) {
                return res.json(entry);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    Entry.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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

    entry
        .save()
        .then((entry) => res.json(entry))
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const entry = {
        name: req.body.name,
        number: req.body.number,
    };
    console.log("entry", entry);

    Entry.findByIdAndUpdate(req.params.id, entry)
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.use(ErrorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
