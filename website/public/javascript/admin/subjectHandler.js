function fetchAndDisplaySubjects() {
	$.get("/getSubjects", function (data, status) {
		if (data.length == 0) {
			$("#selectSubjects").append(`<option>No Departments Found</option>`);
			return;
		} else {
			data.forEach((element) => {
				$("#selectSubjects").append(
					`<option>${element.subject_id}. ${element.subject_name}</option>`
				);
			});
		}
	});
}

function getDepartments() {
	$.get("/getDepartments", function (data, status) {
		if (data.length == 0) {
			$("#selectDepartment").append(`<option>No Departments Found</option>`);
			return;
		} else {
			data.forEach((element) => {
				$("#selectDepartment").append(
					`<option>${element.department_id}. ${element.department_name}</option>`
				);
			});
		}
	});
}
function showNotification(message, duration) {
	const notification = document.getElementById("notification");
	notification.textContent = message;
	notification.classList.remove("hidden");
	setTimeout(() => {
		notification.classList.add("hidden");
	}, duration);
}
function deleteAll(id) {
	id.forEach((ids) => {
		$(ids).empty();
	});
}

getDepartments();
fetchAndDisplaySubjects();

$("#submitSubject").click(() => {
	const subject_name = $("#subjectName").val();
	const department_id = $("#selectDepartment").val().split("")[0];
	var subject_type = $("#specialCourse").val();
	const subject_id = $("#subjectId").val();
	if (
		subject_name == null ||
		department_id == null ||
		subject_type == null ||
		subject_id == null
	) {
		alert("Please fill details");
		return;
	}
	subject_type = subject_type.toLowerCase();
	$.ajax({
		url: "/addSubject",
		method: "POST",
		data: {
			subject_id,
			subject_name,
			subject_type,
			department_id,
		},
		success: (data, textStatus, jqXHR) => {
			console.log("Sucess");
			showNotification("Added Subject", 3000);
		},
		error: (err) => {
			console.log(err.HEADERS_RECEIVED);
		},
	});
});
$("#deleteSubject").click(() => {
	const subject_id = $("#selectSubjects").val().split(".")[0];
	console.log(subject_id);
	$.ajax({
		url: "/deleteSubject",
		method: "DELETE",
		data: {
			subject_id,
		},
		success: (data, textStatus, jqXHR) => {
			console.log("Sucess");
			showNotification("Deleted Subject", 3000);
		},
		error: (err) => {
			console.log(err.HEADERS_RECEIVED);
		},
	});
});
