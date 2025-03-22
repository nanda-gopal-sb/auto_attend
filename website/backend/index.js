const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminPaths = require("./htmlHandlers/admin.js");
const adminApis = require("./apiEndPoints/admin_api.js");
const studentApis = require("./apiEndPoints/student_api.js");
const teacherApis = require("./apiEndPoints/teacher_api.js");
const login = require("./auth/auth.js");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('',adminPaths);
app.use('',adminApis);
app.use('',login);
app.use('',studentApis);
app.use('',teacherApis);
app.use(express.static(path.join(__dirname,"../public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../public", "index.html"));
});
app.get("/signup",(req,res)=>{
	res.sendFile(path.join(__dirname, "../public", "signUp.html"));
});
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
