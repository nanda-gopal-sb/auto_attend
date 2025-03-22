function getSecKeys(client){
	const query = `SELECT * FROM special_keys;`;
	return client.query(query);
}


function getAttandanceReport(client, class_name, subject_name) {
	const query = `
    SELECT 
        st.student_id,
        st.student_name,
        COUNT(CASE WHEN a.present = TRUE THEN 1 END) AS present_count,
        COUNT(a.attendance_id) AS total_classes,
        CASE 
            WHEN COUNT(a.attendance_id) = 0 THEN 0
            ELSE (COUNT(CASE WHEN a.present = TRUE THEN 1 END) * 100.0 / COUNT(a.attendance_id))
        END AS attendance_percentage
    FROM 
        students st
    JOIN 
        student_enrollments se ON st.student_id = se.student_id
    JOIN 
        teacher_assignments ta ON se.class_id = ta.class_id
    JOIN 
        classes c ON ta.class_id = c.class_id
    JOIN 
        subjects sub ON ta.subject_id = sub.subject_id
    LEFT JOIN 
        attendance a ON ta.assignment_id = a.assignment_id AND st.student_id = a.student_id
    WHERE 
        c.class_name = '${class_name}'  
    AND
        sub.subject_name = '${subject_name}'
    GROUP BY 
        st.student_id, st.student_name
    ORDER BY 
        st.student_name;
`;
	return client.query(query);
}

async function addAttendance(client, studentIds, assignmentId, currentDate) {
	client.query("BEGIN");
	const allStudentsQuery = `
      SELECT DISTINCT se.student_id
      FROM student_enrollments se
      JOIN teacher_assignments ta ON se.class_id = ta.class_id
      WHERE ta.assignment_id = $1
    `;
	const res = await client.query(allStudentsQuery, [assignmentId]);

	const allStudentIds = res.rows.map((row) => row.student_id);
	studentIds = studentIds.map((ids) => Number(ids));
	const presentStudentIds = new Set(studentIds);
	const absentStudentIds = allStudentIds.filter(
		(id) => !presentStudentIds.has(id)
	);

	console.log(studentIds);
	console.log(allStudentIds);
	console.log(presentStudentIds);
	console.log(absentStudentIds);

	const insertQuery = `
      INSERT INTO attendance (assignment_id, student_id, attendance_date, present)
      VALUES ($1, $2, $3, $4)
    `;
	for (const studentId of studentIds) {
		client.query(insertQuery, [assignmentId, studentId, currentDate, true]);
	}

	for (const studentId of absentStudentIds) {
		client.query(insertQuery, [assignmentId, studentId, currentDate, false]);
	}
	return client.query("COMMIT");
}
function getAssignmentId(client, student_id, subject_name, teacher_id) {
	const query = `
	SELECT ta.assignment_id
	FROM teacher_assignments ta
	JOIN student_enrollments se ON ta.class_id = se.class_id
	JOIN subjects sub ON ta.subject_id = sub.subject_id
	WHERE ta.teacher_id = ${teacher_id}  
  	AND se.student_id = ${student_id}
  	AND sub.subject_name = '${subject_name}';
	`;
	return client.query(query);
}
function getTeacher_Classes(client, teacher_id) {
	const query = `
	SELECT DISTINCT
    t.teacher_name,
    c.class_name,
    s.subject_name,
	c.class_id,
	s.subject_id 
	FROM teacher_assignments ta
	JOIN teachers t ON ta.teacher_id = t.teacher_id
	JOIN classes c ON ta.class_id = c.class_id
	JOIN subjects s ON ta.subject_id = s.subject_id
	WHERE ta.teacher_id = ${teacher_id};`;
	return client.query(query);
}
function getStudents_Classes(client, subject_name, class_name) {
	const query = `
	SELECT DISTINCT s.student_id, s.student_name
	FROM student_enrollments se
	JOIN students s ON se.student_id = s.student_id
	JOIN teacher_assignments ta ON ta.class_id = se.class_id
	JOIN classes c ON c.class_id = ta.class_id
	JOIN subjects sub ON sub.subject_id = ta.subject_id
	WHERE sub.subject_name = '${subject_name}'
	AND c.class_name = '${class_name}';`;
	return client.query(query);
}
function getStudentsUsers(client) {
	const query = `SELECT user_id,username,password FROM user_accounts WHERE user_role = 'student';`;
	return client.query(query);
}
function getTeachersUsers(client) {
	const query = `SELECT user_id,username,password FROM user_accounts WHERE user_role = 'teacher';`;
	return client.query(query);
}
function getAdminUsers(client) {
	const query = `SELECT user_id,username,password FROM user_accounts WHERE user_role = 'admin';`;
	return client.query(query);
}
function addClasses(client, class_name, class_id) {
	const query = `INSERT INTO classes(class_id,class_name) VALUES(${class_id},'${class_name}');`;
	return client.query(query);
}
function editClass(client, class_name, new_class_name, class_id, new_class_id) {
	const query = `UPDATE classes SET class_id = ${new_class_id}, class_name = '${new_class_name}' WHERE class_id = ${class_id} AND class_name = '${class_name}';`;
	return client.query(query);
}
function getClass(client) {
	const query = `SELECT * from classes;`;
	return client.query(query);
}
function addDepartments(client, department_id, department_name) {
	const query = `INSERT INTO departments (department_id,department_name) VALUES(${department_id},'${department_name}');`;
	return client.query(query);
}
function getDepartments(client) {
	const query = `SELECT * from departments;`;
	return client.query(query);
}
function addSubjects(
	client,
	department_id,
	subject_name,
	subject_id,
	subject_type
) {
	const query = `INSERT INTO subjects (subject_id,subject_name,department_id,subject_type) 
	VALUES(${subject_id},'${subject_name}',${department_id},'${subject_type}');`;
	return client.query(query);
}
function getSubjects(client) {
	const query = `SELECT * FROM subjects`;
	return client.query(query);
}

function addTeachers(
	client,
	department_id,
	teacher_name,
	teacher_id,
	teacher_email
) {
	const query = `INSERT INTO teachers (teacher_id,teacher_name,department_id,teacher_email) 
	VALUES(${teacher_id},'${teacher_name}','${department_id}','${teacher_email}');`;
	console.log(query);
	return client.query(query);
}

function addUser(client, id, user_name, passwords, user_role) {
	const query = `INSERT INTO user_accounts (user_id, username, password, user_role) 
	VALUES(${id},'${user_name}','${passwords}','${user_role}');`;
	console.log(query);
	return client.query(query);
}
function getTeachers(client) {
	const query = `SELECT * FROM teachers`;
	return client.query(query);
}
function addAssignment(client, class_id, teacher_id, subject_id) {
	const query = `INSERT INTO teacher_assignments (teacher_id,class_id,subject_id) 
	VALUES(${teacher_id},${class_id},${subject_id});`;
	return client.query(query);
}
function addStudents(
	client,
	department_id,
	student_name,
	student_id,
	student_email
) {
	const query = `INSERT INTO students (student_id,student_name,department_id,student_email) 
	VALUES(${student_id},'${student_name}','${department_id}','${student_email}');`;
	return client.query(query);
}
function getStudents(client) {
	const query = `SELECT * FROM students`;
	return client.query(query);
}
function retrieveStudentInfo(client, student_id) {
	const query = `
    SELECT
        c.class_name,
        s.student_name,
        d.department_name
    FROM
        students AS s
    JOIN
        student_enrollments AS se ON s.student_id = se.student_id
    JOIN
        classes AS c ON se.class_id = c.class_id
    JOIN
        departments AS d ON s.department_id = d.department_id
    WHERE
        s.student_id = ${student_id};
  `;
	console.log(query);
	return client.query(query);
}
function getAttandance(client, student_id) {
	const query = `    
	SELECT
    s.subject_name,
    COUNT(CASE WHEN a.present = TRUE THEN 1 END) AS present_count,
    COUNT(a.attendance_id) AS total_classes,
    CASE 
        WHEN COUNT(a.attendance_id) = 0 THEN 0
        ELSE (COUNT(CASE WHEN a.present = TRUE THEN 1 END) * 100.0 / COUNT(a.attendance_id))
    END AS attendance_percentage
	FROM
    	subjects AS s
	JOIN
    	teacher_assignments AS ta ON s.subject_id = ta.subject_id
	JOIN
    	student_enrollments AS se ON ta.class_id = se.class_id
	JOIN
    	students AS st ON se.student_id = st.student_id
	LEFT JOIN
    	attendance AS a ON ta.assignment_id = a.assignment_id AND st.student_id = a.student_id
	WHERE
    	st.student_id = ${student_id}
	GROUP BY
    	s.subject_name
	ORDER BY
    	s.subject_name;`;
	return client.query(query);
}
function getDangerSubjects(client, student_id) {
	const query = `
	SELECT
    s.subject_name,
    COUNT(CASE WHEN a.present = TRUE THEN 1 END) AS present_count,
    COUNT(a.attendance_id) AS total_classes,
    CASE
        WHEN COUNT(a.attendance_id) = 0 THEN 0
        ELSE (COUNT(CASE WHEN a.present = TRUE THEN 1 END) * 100.0 / COUNT(a.attendance_id))
    END AS attendance_percentage
	FROM
		subjects AS s
	JOIN
		teacher_assignments AS ta ON s.subject_id = ta.subject_id
	JOIN
		student_enrollments AS se ON ta.class_id = se.class_id
	JOIN
		students AS st ON se.student_id = st.student_id
	LEFT JOIN
		attendance AS a ON ta.assignment_id = a.assignment_id AND st.student_id = a.student_id
	WHERE
		st.student_id = ${student_id}
	GROUP BY
		s.subject_name
	HAVING
		COUNT(a.attendance_id) > 0
		AND (COUNT(CASE WHEN a.present = TRUE THEN 1 END) * 100.0 / COUNT(a.attendance_id)) < 75
	ORDER BY
		s.subject_name;
	`;
	return client.query(query);
}
function addEnrollment(client, class_id, student_id) {
	const query = `INSERT INTO student_enrollments (student_id,class_id) 
	VALUES(${student_id},${class_id});`;
	return client.query(query);
}
function deleteClass(client, class_id) {
	const query = `DELETE FROM classes WHERE class_id=${class_id};`;
	console.log(query);
	return client.query(query);
}
function deleteTeacher(client, teacher_id) {
	const query = `DELETE FROM teachers WHERE teacher_id=${teacher_id};`;
	return client.query(query);
}
function deleteSubject(client, subject_id) {
	const query = `DELETE FROM subjects WHERE subject_id=${subject_id};`;
	return client.query(query);
}
function deleteStudent(client, student_id) {
	const query = `DELETE FROM students WHERE student_id=${student_id};`;
	return client.query(query);
}
function deleteDepartment(client, department_name) {
	const query = `DELETE FROM departments WHERE department_name='${department_name}';`;
	return client.query(query);
}
function editTeacher(client, updateFields, teacher_id) {
	const query = ` UPDATE teachers SET ${updateFields} WHERE teacher_id = ${teacher_id}`;
	return client.query(query);
}
function editStudent(client, updateFields, student_id) {
	const query = `UPDATE students SET ${updateFields} WHERE student_id = ${student_id};`;
	return client.query(query);
}
function changeClass(client, student_id, newClassId) {
	const query = `UPDATE student_enrollments SET class_id = ${newClassId} WHERE student_id = ${student_id};`;
	console.log(query);
	return client.query(query);
}

function deleteAssignment(client, teacher_id) {
	const query = `DELETE from teacher_assignments WHERE teacher_id=${teacher_id}`;
	return client.query(query);
}
function updateTeacherName(client, teacher_id, teacher_name) {
	const query = `UPDATE teachers set teacher_name='${teacher_name}' where teacher_id=${teacher_id};`;
	return client.query(query);
}
function getTeacherDetails(client, teacher_id) {
	const query = `
	SELECT DISTINCT
	t.teacher_name,
    d.department_name,
    s.subject_name
	FROM 
		teachers t
	JOIN 
		departments d ON t.department_id = d.department_id
	JOIN 
		teacher_assignments ta ON t.teacher_id = ta.teacher_id
	JOIN 
		subjects s ON ta.subject_id = s.subject_id
	WHERE 
		t.teacher_id = ${teacher_id};
	`;
	return client.query(query);
}
module.exports = {
	getSecKeys,
	getTeacherDetails,
	getDangerSubjects,
	updateTeacherName,
	deleteAssignment,
	getAttandanceReport,
	addAttendance,
	getAssignmentId,
	getStudents_Classes,
	getTeacher_Classes,
	getTeachersUsers,
	getAttandance,
	getSingleStudents: retrieveStudentInfo,
	deleteSubject,
	getStudentsUsers,
	addUser,
	changeClass,
	editStudent,
	editTeacher,
	deleteDepartment,
	deleteStudent,
	deleteTeacher,
	deleteClass,
	getClass,
	editClass,
	getAdminUsers,
	addClasses,
	addDepartments,
	getDepartments,
	addSubjects,
	addTeachers,
	getTeachers,
	getSubjects,
	addAssignment,
	addStudents,
	getStudents,
	addEnrollment,
};
