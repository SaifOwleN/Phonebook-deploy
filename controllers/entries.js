const sRouter = require('express').Router()
const Entry = require('../models/entries')
const express = require('express')
const app = express()

app.get("/info", (request, response) => {
    const date = new Date().toLocaleString();
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;

    response.send(
        `<p>Phonebook has info for ${Entry.length} people </p></br><p>${date} ${local}</p>`
    );
});

sRouter.get("/", (req, res) => {
    Entry.find({}).then((entry) => res.json(entry));
});

sRouter.get("/:id", (req, res, next) => {
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

sRouter.delete("/:id", (req, res, next) => {
    Entry.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

sRouter.post("/", (req, res, next) => {
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

sRouter.put("/:id", (req, res, next) => {
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

module.exports = sRouter
