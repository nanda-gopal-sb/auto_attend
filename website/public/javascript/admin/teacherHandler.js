function deleteAll(id) {
	id.forEach((ids) => {
		$(ids).empty();
	});
}
let dictionary = new Map();
dictionary.set("IT", "1");
dictionary.set("CS", "2");
dictionary.set("SF", "3");
dictionary.set("CE", "4");
dictionary.set("ME", "5");
dictionary.set("EC", "6");
dictionary.set("EEE", "7");
function extractAndConvert(className) {
	const regex = /^S([1-8])(IT|CS|SF|CE|ME|EC|EEE).?$/;
	const match = className.match(regex);
	if (match) {
		const last = className.charAt(className.length - 1);
		const number = match[1];
		const department = match[2];
		const departmentNumber = dictionary.get(department);
		if (last === "A") {
			return number + departmentNumber + "0";
		}
		if (last === "B") {
			return number + departmentNumber + "1";
		}
		return number + departmentNumber + "9";
	}
	return null;
}
var deptID = ["#addDepartmentList"];
var teachID = ["#deleteTeacherList", "#teacherAssignList"];
var subsID = ["#subjectList"];
var classID = ["#classList"];
function getString(input) {
	const periodIndex = input.indexOf(".");
	if (periodIndex === -1) {
		return input;
	}
	return input.substring(0, periodIndex);
}
function showNotification(message, duration) {
	var notification = $("#notification");
	notification.text(message);
	notification.fadeIn();

	setTimeout(function () {
		notification.fadeOut();
	}, duration);
}
function getClass(id) {
	$.get("/getClass", function (data, status) {
		if (data.length == 0) {
			id.forEach((ids) => {
				$(ids).append(`<option>No Classes Found</option>`);
			});
			return;
		} else {
			data.forEach((element) => {
				id.forEach((ids) => {
					$(ids).append(`<option>${element.class_name}</option>`);
				});
			});
		}
	});
}
function getDepartments(id) {
	$.get("/getDepartments", function (data, status) {
		if (data.length == 0) {
			id.forEach((ids) => {
				$(ids).append(`<option>No Classes Found</option>`);
			});
			return;
		} else {
			classExist = true;
			data.forEach((element) => {
				id.forEach((ids) => {
					$(ids).append(
						`<option>${element.department_id}.${element.department_name}</option>`
					);
				});
			});
		}
	});
}
function getSubjects(id) {
	$.get("/getSubjects", function (data, status) {
		if (data.length == 0) {
			id.forEach((ids) => {
				$(ids).append(`<option>No Classes Found</option>`);
			});
			return;
		} else {
			data.forEach((element) => {
				id.forEach((ids) => {
					$(ids).append(
						`<option>${element.subject_id} - ${element.subject_name}</option>`
					);
				});
			});
		}
	});
}
function getTeachers(id) {
	$.get("/getTeachers", function (data, status) {
		if (data.length == 0) {
			id.forEach((ids) => {
				$(ids).append(`<option>No Classes Found</option>`);
			});
			return;
		} else {
			data.forEach((element) => {
				id.forEach((ids) => {
					$(ids).append(
						`<option>${element.teacher_id}. ${element.teacher_name}</option>`
					);
				});
			});
		}
	});
}
$("#addTeacher").click(() => {
	const teacher_name = $("#teacherName").val();
	const department_id = $("#addDepartmentList").val().split("")[0];
	const teacher_id = $("#teacherId").val();
	const teacher_email = $("#teacherEmail").val();
	if (teacher_name == null || department_id == null || teacher_id == null) {
		alert("Please fill details");
		return;
	}
	$.ajax({
		url: "/addTeacher",
		method: "POST",
		data: {
			teacher_id,
			teacher_name,
			department_id,
			teacher_email,
		},
		success: (data) => {
			deleteAll(teachID);
			showNotification("Added teacher", 2000);
			getTeachers(teachID);
		},
		error: (err) => {},
	});
});
$("#assignClass").click(() => {
	const teacher_id = getString($("#teacherAssignList").val());
	const class_id = extractAndConvert(getString($("#classList").val()));
	const subject_id = getString($("#subjectList").val()).split(" ")[0];
	console.log(teacher_id + " " + class_id + " " + subject_id);
	$.ajax({
		url: "/addAssignment",
		method: "POST",
		data: {
			teacher_id,
			class_id,
			subject_id,
		},
		success: (data) => {
			console.log(data);
			showNotification("Added the assignment", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});
$("#deleteTeacher").click(() => {
	const teacher_id = getString($("#deleteTeacherList").val()).split(".")[0];
	$.ajax({
		url: "/deleteTeacher",
		method: "DELETE",
		data: {
			teacher_id,
		},
		success: (data) => {
			deleteAll(teachID);
			getTeachers(teachID);
			showNotification("Deleted Assignment", 3000);
		},
		error: (err) => {},
	});
});
getTeachers(teachID);
getDepartments(deptID);
getClass(classID);
getSubjects(subsID);
