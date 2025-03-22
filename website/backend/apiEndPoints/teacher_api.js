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

router.post("/getTeacherClasses", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .getTeacher_Classes(client, req.body.teacher_id)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});
router.post("/getStudentClasses", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .getStudents_Classes(client, req.body.subject_name,req.body.class_name)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});

router.post("/getAssignmentId", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .getAssignmentId(client, req.body.student_id,req.body.subject_name, req.body.teacher_id)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});

router.post("/addAttendance", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .addAttendance(client, req.body.studentIds,req.body.assignmentId, req.body.currDate)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});

router.post("/getReport", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .getAttandanceReport(client, req.body.class_name,req.body.subject_name)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding subject");
        });
    client.release();
});
router.post("/getTeacherDetails", async (req, res) => {
    const client = await pool.connect();
    console.log(req.body);
    funcs
        .getTeacherDetails(client, req.body.teacher_id)
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