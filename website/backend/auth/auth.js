const session = require("express-session");
const express = require("express");
const pgSession = require('connect-pg-simple')(session);
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

router.use(                           // saved
	session({
		store: new pgSession({
			pool: pool, 
			tableName: "session",
		}),
		secret: "THE KEY",
		resave: false,
		saveUninitialized: false,
	})
);

router.post("/login", async (req, res) => {
	const client = await pool.connect();
	if (req.body.userType === "admin") { // got from the frontend 
		const dataToSend = {
			user_id: "no_user_found",
			user_type:"",
			loginStatus: false,
		};
		funcs
			.getAdminUsers(client)
			.then((result) => {
				console.log(result.rows);
				for (let i = 0; i < result.rows.length; i++) {
					if (req.body.username === result.rows[i].username &&
						req.body.password === result.rows[i].password) 
					{
						dataToSend.user_id = result.rows[i].user_id;
						dataToSend.loginStatus = true;
						dataToSend.user_type="admin"
						req.session.isAuth = true;
						break;
					}
				}
				res.send(dataToSend);
			})
			.catch((e) => {
				console.error("Error getting admin users", e);
				res.send("Error getting admin users");
			});
	}
	if (req.body.userType === "student") {
		const dataToSend = {
			user_id: "no_user_found",
			user_type:"",
			loginStatus: false,
		};
		funcs
			.getStudentsUsers(client)
			.then((result) => {
				console.log(result.rows);
				for (let i = 0; i < result.rows.length; i++) {
					if (
						req.body.username === result.rows[i].username &&
						req.body.password === result.rows[i].password
					) {
						dataToSend.user_id = result.rows[i].user_id;
						dataToSend.loginStatus = true;
						dataToSend.user_type="student"
						req.session.isAuth = true;
						break;
					}
				}
				res.send(dataToSend);
			})
			.catch((e) => {
				console.error("Error getting students users", e);
				res.send("Error getting students users");
			});
	}
	if (req.body.userType === "teacher") {
		const dataToSend = {
			user_id: "no_user_found",
			user_type:"",
			loginStatus: false,
		};
		funcs
			.getTeachersUsers(client)
			.then((result) => {
				console.log(result.rows);
				for (let i = 0; i < result.rows.length; i++) {
					if (
						req.body.username === result.rows[i].username &&
						req.body.password === result.rows[i].password
					) {
						dataToSend.user_id = result.rows[i].user_id;
						dataToSend.loginStatus = true;
						dataToSend.user_type="teacher"
						req.session.isAuth = true;
						break;
					}
				}
				res.send(dataToSend);
			})
			.catch((e) => {
				console.error("Error getting students users", e);
				res.send("Error getting students users");
			});
	}
	client.release();
});
router.post("/logout", async (req, res) => {
	req.session.destroy((err)=>{
		if(err) console.log(err);
	});
	res.redirect("/");
});
module.exports = router;