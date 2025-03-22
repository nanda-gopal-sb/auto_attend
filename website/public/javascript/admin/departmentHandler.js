function showNotification(message, duration) {
	const notification = document.getElementById("notification");
	notification.textContent = message;
	notification.classList.remove("hidden");
	setTimeout(() => {
		notification.classList.add("hidden");
	}, duration);
}
var ids = ["#selectDepartmentForDelete", "#currDepartments"];
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
					$(ids).append(`<option>${element.department_name}</option>`);
				});
			});
		}
	});
}
function deleteAll(id) {
	id.forEach((ids) => {
		$(ids).empty();
	});
}
$("#submitDepartment").click(() => {
	const departmentName = $("#departmentName").val();
	const departmentId = $("#departmentId").val();
	if (!departmentName || departmentId == null) {
		alert("Please enter a proper department name");
		return;
	}
	$.ajax({
		url: "/addDepartment",
		method: "POST",
		data: {
			departmentId,
			departmentName,
		},
		success: (data, textStatus, jqXHR) => {
			deleteAll(ids);
			getDepartments(ids);
			showNotification("Added Department Sucessfully", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});
$("#deleteDepartment").click(() => {
	const department_name = $("#selectDepartmentForDelete").val();
	if (!departmentName) {
		alert("Please enter a proper department name");
		return;
	}
	$.ajax({
		url: "/deleteDepartment",
		method: "DELETE",
		data: {
			department_name,
		},
		success: (data, textStatus, jqXHR) => {
			deleteAll(ids);
			getDepartments(ids);
			console.log(data);
			showNotification("Deleted Notification Sucessfully", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});
getDepartments(ids);
