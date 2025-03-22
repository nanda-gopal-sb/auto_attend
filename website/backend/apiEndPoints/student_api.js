
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Pool } = require("pg");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const funcs = require("../db-helpers/main.js");
const db = require("../db-helpers/const-local.js");
const pool = new Pool({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
    ssl: db.ssl,
});

router.post("/getSingleStudent", async (req, res) => {
    const client = await pool.connect();
    funcs
        .getSingleStudents(client, req.body.student_id)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});
router.post("/getAttendanceDetails", async (req, res) => {
    const client = await pool.connect();
    funcs
        .getAttandance(client, req.body.student_id)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});
router.post("/dangerSubject", async (req, res) => {
    const client = await pool.connect();
    funcs
        .getDangerSubjects(client, req.body.student_id)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});

module.exports = router;