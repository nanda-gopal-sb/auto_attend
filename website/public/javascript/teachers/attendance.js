function showNotification(message, duration) {
	const notification = document.getElementById("notification");
	notification.textContent = message;
	notification.style.opacity = 1;

	setTimeout(() => {
		notification.style.opacity = 0;
	}, duration);
}
function extractClassAndSubject(url) {
	try {
		const urlObj = new URL(url);
		const searchParams = urlObj.searchParams;

		const classValue = searchParams.get("class");
		let subjectValue = searchParams.get("subject");

		if (subjectValue) {
			subjectValue = decodeURIComponent(subjectValue);
		}
		return { class: classValue, subject: subjectValue };
	} catch (error) {
		console.error("Invalid URL:", error);
		return { class: null, subject: null };
	}
}
document.addEventListener("DOMContentLoaded", function () {
	const param = extractClassAndSubject(window.location.toString());
	document.getElementById(
		"topText"
	).textContent = `${param.class} ${param.subject}`;
	const requestData = {
		class_name: param.class,
		subject_name: param.subject,
	};
	fetch("/getStudentClasses", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	})
		.then((response) => response.json())
		.then((data) => {
			const studentList = document.getElementById("studentList");
			data.forEach((student) => {
				const studentDiv = document.createElement("div");
				studentDiv.className = "student";
				studentDiv.innerHTML = `
                <div class="checkbox-wrapper">
                <input type="checkbox" id="${student.student_id}">
                </div>
                <label for="student${student.student_id}">${student.student_name}</label>
                <i class="fas fa-user status-icon"></i>`;
				studentList.appendChild(studentDiv);
			});
		})
		.catch((error) => console.error("Error fetching student data:", error));
	document
		.querySelector("button[type='submit']")
		.addEventListener("click", function () {
			const firstStudentCheckbox = document.querySelector(
				"#studentList input[type='checkbox']"
			);
			var student_id = "";
			if (firstStudentCheckbox) {
				console.log("First Student ID:", firstStudentCheckbox.id);
				student_id = firstStudentCheckbox.id;
			}
			const teacher_id = window.location.pathname.split("/")[2];
			console.log(teacher_id);
			const param = extractClassAndSubject(window.location.toString());
			const requestData = {
				student_id: student_id,
				subject_name: param.subject,
				teacher_id: teacher_id,
			};
			fetch("/getAssignmentId", {
				method: "POST",
				body: JSON.stringify(requestData),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((assignmentData) => {
					const checkedStudents = [];
					const date = new Date();
					const month = date.getMonth() + 1;
					const currDate =
						date.getFullYear().toString() +
						"-" +
						month.toString() +
						"-" +
						date.getDate().toString();
					document
						.querySelectorAll("#studentList input[type='checkbox']:checked")
						.forEach((checkbox) => {
							checkedStudents.push(checkbox.id);
						});
					fetch("/addAttendance", {
						method: "POST",
						body: JSON.stringify({
							studentIds: checkedStudents,
							currDate: currDate,
							assignmentId: assignmentData[0].assignment_id,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					})
						.then((response) => response.json())
						.then((result) => {
							console.log("Attendance submitted successfully:", result);
							showNotification("Added Successfully", 3000);
						})
						.catch((error) => {
							console.error("Error submitting attendance:", error);
							showNotification("Error Adding subjects", 3000);
						});
				})
				.catch((error) =>
					console.error("Error fetching assignment ID:", error)
				);
		});
});
