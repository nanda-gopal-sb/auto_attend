const teacher_id = window.location.pathname.split("/")[2];
var ids = ["#subjectDropdown"];
function getTeacherClass(id) {
	$.ajax({
		url: "/getTeacherClasses",
		method: "POST",
		data: {
			teacher_id,
		},
		success: function (data) {
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
							`<option>${element.class_name}--${element.subject_name}</option>`
						);
					});
				});
			}
		},
		error: function (xhr, status, error) {
			console.error("Error fetching teacher classes:", error);
		},
	});
}
function deleteAll(id) {
	id.forEach((ids) => {
		$(ids).empty();
	});
}
getTeacherClass(ids);
document
	.getElementById("take-attendance-btn")
	.addEventListener("click", function () {
		window.location.href = "/teachers/attendance";
		const selectedOption = document.getElementById("subjectDropdown").value;
		const [className, subjectName] = selectedOption.split("--");
		window.location.href = `/teacher/${teacher_id}/attendance?class=${className}&subject=${subjectName}`;
	});
