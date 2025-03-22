function showNotification(message, duration) {
	const notification = document.getElementById("notification");
	notification.textContent = message;
	notification.classList.remove("hidden");
	setTimeout(() => {
		notification.classList.add("hidden");
	}, duration);
}
var ids = ["#selectClassForEdit", "#selectClassForDelete"];
function getClass(id) {
	$.get("/getClass", function (data, status) {
		if (data.length == 0) {
			id.forEach((ids) => {
				$(ids).append(`<option>No Classes Found</option>`);
			});
			return;
		} else {
			classExist = true;
			data.forEach((element) => {
				id.forEach((ids) => {
					$(ids).append(`<option>${element.class_name}</option>`);
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

$("#submitClass").click(() => {
	const className = $("#className").val();
	const classId = extractAndConvert(className);
	if (!className || classId == null) {
		alert("Please enter a proper class name");
		return;
	}
	$.ajax({
		url: "/addClass",
		method: "POST",
		data: {
			classId,
			className,
		},
		success: (res) => {
			console.log(res);
			deleteAll(ids);
			getClass(ids);
			showNotification("Added Class successfully", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});
$("#editSubmitClass").click(() => {
	const className = $("#editClassName").val();
	const classId = extractAndConvert(className);
	const oldClass = $("#selectClassForEdit").val();
	const oldClassId = extractAndConvert(oldClass);
	if (!className || classId == null) {
		alert("Please enter a proper class name");
		return;
	}
	$.ajax({
		url: "/editClass",
		method: "POST",
		data: {
			oldClassId,
			oldClass,
			classId,
			className,
		},
		success: (res) => {
			console.log(res);
			deleteAll(ids);
			getClass(ids);
			showNotification("Edited Class successfully", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});
$("#deleteSubmitClass").click(() => {
	const className = $("#selectClassForDelete").val();
	const class_id = extractAndConvert(className);
	if (!className || class_id == null) {
		alert("Please enter a proper class name");
		return;
	}
	$.ajax({
		url: "/deleteClass",
		method: "DELETE",
		data: {
			class_id,
		},
		success: () => {
			deleteAll(ids);
			getClass(ids);
			showNotification("Deleted Class successfully", 3000);
		},
		error: (err) => {
			console.log(err);
		},
	});
});

getClass(ids);
