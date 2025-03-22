const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const generator = require("generate-password");
const { Pool } = require("pg");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const funcs = require("../db-helpers/main.js");
const db = require("../db-helpers/const-local.js");
const email = require("../utils/email.js");

const pool = new Pool({
	user: db.user,
	host: db.host,
	database: db.database,
	password: db.password,
	port: db.port,
	ssl: db.ssl,
});

router.get("/getSingleStudent", async (req, res) => {
	const client = await pool.connect();
	console.log(req.body.student_id);
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

router.post("/addClass", async (req, res) => {
	const client = await pool.connect();
	funcs
		.addClasses(client, req.body.className, req.body.classId)
		.then((result) => {
			console.log(result.rows);
			res.send("added class");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.post("/editClass", async (req, res) => {
	const client = await pool.connect();
	funcs
		.editClass(
			client,
			req.body.oldClass,
			req.body.className,
			req.body.oldClassId,
			req.body.classId
		)
		.then((result) => {
			res.status(200).send("edited class");
			console.log(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});

router.post("/addDepartment", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addDepartments(client, req.body.departmentId, req.body.departmentName)
		.then((result) => {
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.post("/addSubject", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addSubjects(
			client,
			req.body.department_id,
			req.body.subject_name,
			req.body.subject_id,
			req.body.subject_type
		)
		.then((result) => {
			console.log(result.rows);
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.post("/addTeacher", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addTeachers(
			client,
			req.body.department_id,
			req.body.teacher_name,
			req.body.teacher_id,
			req.body.teacher_email
		)
		.then((result) => {
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	const passcode = generator.generate({
		length: 10,
		numbers: true,
	});
	console.log(passcode);
	funcs
		.addUser(
			client,
			req.body.teacher_id,
			req.body.teacher_email,
			passcode,
			"teacher"
		)
		.then(async (result) => {
			console.log(result);
			console.log(result);
			const login_details = {
				username: req.body.teacher_email,
				password: passcode,
			};
			const transporter = email.transporter;
			const html = email.generateLoginDetailsTemplate(login_details);
			await email.sendEmail(req.body.teacher_email, transporter, html);
		})
		.catch((error) => {
			console.error(error);
		});
	client.release();
});
router.post("/addAssignment", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addAssignment(
			client,
			req.body.class_id,
			req.body.teacher_id,
			req.body.subject_id
		)
		.then((result) => {
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.post("/addStudent", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addStudents(
			client,
			req.body.department_id,
			req.body.student_name,
			req.body.student_id,
			req.body.student_email
		)
		.then((result) => {
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	const passcode = generator.generate({
		length: 10,
		numbers: true,
	});
	console.log(passcode);
	funcs
		.addUser(
			client,
			req.body.student_id,
			req.body.student_email,
			passcode,
			"student"
		)
		.then(async (result) => {
			console.log(result);
			const login_details = {
				username: req.body.student_email,
				password: passcode,
			};
			const transporter = email.transporter;
			const html = email.generateLoginDetailsTemplate(login_details);
			await email.sendEmail(req.body.student_email, transporter, html);
		})
		.catch((error) => {
			console.error(error);
		});
	client.release();
});
router.post("/addEnrollment", async (req, res) => {
	console.log(req.body);
	const client = await pool.connect();
	funcs
		.addEnrollment(client, req.body.class_id, req.body.student_id)
		.then((result) => {
			res.send("OK");
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});

router.get("/getClass", async (req, res) => {
	const client = await pool.connect();
	funcs
		.getClass(client)
		.then((result) => {
			res.send(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.get("/getDepartments", async (req, res) => {
	const client = await pool.connect();
	funcs
		.getDepartments(client)
		.then((result) => {
			res.send(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.get("/getTeachers", async (req, res) => {
	const client = await pool.connect();
	funcs
		.getTeachers(client)
		.then((result) => {
			res.send(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});
router.get("/getSubjects", async (req, res) => {
	const client = await pool.connect();
	funcs
		.getSubjects(client)
		.then((result) => {
			res.send(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});

router.get("/getStudents", async (req, res) => {
	const client = await pool.connect();
	funcs
		.getStudents(client)
		.then((result) => {
			console.log(result.rows);
			res.send(result.rows);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error adding subject");
		});
	client.release();
});

router.delete("/deleteClass", async (req, res) => {
	const client = await pool.connect();
	funcs
		.deleteClass(client, req.body.class_id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			res.json(error);
		});
});

router.delete("/deleteTeacher", async (req, res) => {
	const client = await pool.connect();
	funcs
		.deleteTeacher(client, req.body.teacher_id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			res.json(error);
		});
});
router.delete("/deleteSubject", async (req, res) => {
	const client = await pool.connect();
	funcs
		.deleteSubject(client, req.body.subject_id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			res.json(error);
		});
});

router.delete("/deleteStudent", async (req, res) => {
	const client = await pool.connect();
	funcs
		.deleteStudent(client, req.body.student_id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			res.json(error);
		});
});

router.delete("/deleteDepartment", async (req, res) => {
	const client = await pool.connect();
	funcs
		.deleteDepartment(client, req.body.department_name)
		.then((result) => {
			res.json("DONE");
		})
		.catch((error) => {
			res.json(error);
		});
});
router.put("/editTeacher", async (req, res) => {
	const client = await pool.connect();
	let updateParams = [];
	if (req.body.department_id) {
		updateParams.push("department_id = " + req.body.department_id);
	}
	if (req.body.teacher_name) {
		updateParams.push(`teacher_name = '${req.body.teacher_name}'`);
	}
	const string = updateParams.join();
	if (string) {
		funcs
			.editTeacher(client, string, req.body.teacher_id)
			.then((result) => {
				res.send("edited");
			})
			.catch((error) => {
				res.status(500).send(error.detail);
			});
	}
});

router.put("/editStudent", async (req, res) => {
	const client = await pool.connect();
	let updateParams = [];
	if (req.body.department_id) {
		updateParams.push("department_id = " + req.body.department_id);
	}
	if (req.body.student_name) {
		updateParams.push(`student_name = '${req.body.student_name}'`);
	}
	const string = updateParams.join();
	console.log(string);
	if (string) {
		funcs
			.editStudent(client, string, req.body.student_id)
			.then((result) => {
				res.send("edited");
			})
			.catch((error) => {
				res.send(error.detail);
			});
	}
});
router.put("/changeClass", async (req, res) => {
	const client = await pool.connect();
	funcs
		.changeClass(client, req.body.student_id, req.body.newClassId)
		.then((result) => {
			res.send("edited");
		})
		.catch((error) => {
			console.log(error);
			res.send(error);
		});
});
router.post("/signUp", async (req, res) => {
	const client = await pool.connect();
	console.log(req.body);
	funcs
		.getSecKeys(client)
		.then((result) => {
			result.rows.forEach((row) => {
				console.log(row);
			});
			funcs
				.addUser(client, req.body.user_id,req.body.username, req.body.password, "admin")
				.then(()=>{
					res.send("Added");
				})
				.catch((error) => {
					console.error(error);
				});
			client.release();
		})
		.catch((error) => {
			console.log(error);
			res.send(error);
		});
});
router.get("/get",async (req,res)=>{
	const client = await pool.connect();
	funcs.get(client).then((result)=>{
		res.send(result.rows);
	})
	.catch((error) => {
		console.log(error);
		res.send(error);
	});
});
router.post("/deleteAssignment", async (req,res)=>{
	const client= await pool.connect();
	funcs.deleteAssignment(client, req.body.teacher_id).then((result)=>{
		res.send("Deleted ");

	})
	.catch((error)=>{
		res.send("Not deleted");
	});
});
router.put("/updateTeacherName", async(req,res)=>{
	const client= await pool.connect();
	console.log(req.body);
	funcs.updateTeacherName(client, req.body.teacher_id ,req.body.teacher_name).then((result)=>{
		res.send("updated");
	})
    .catch((error)=>{
		res.send(error);
	});

});
module.exports = router;