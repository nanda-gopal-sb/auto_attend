const teacher_id = window.location.pathname.split("/")[2];
let res = [];

function fill() {
	fetch("/getTeacherClasses", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ teacher_id: teacher_id }),
	})
		.then((response) => response.json())
		.then((data) => {
			res = data;
			const subjectSelect = document.getElementById("subject");
			data.forEach((item) => {
				const option = document.createElement("option");
				option.value = `${item.class_name}-${item.subject_name}`;
				option.textContent = `${item.class_name}-${item.subject_name}`;
				subjectSelect.appendChild(option);
			});
		})
		.catch((error) => console.error("Error:", error));
}

function generateReport() {
	const selectedOption = document.getElementById("subject").value;
	const [class_name, subject_name] = selectedOption.split("-");
	console.log(res);
	fetch("/getReport", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			class_name: class_name,
			subject_name: subject_name,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Report Data:", data);
			const { jsPDF } = window.jspdf;
			const doc = new jsPDF();
			doc.text(`Report for ${subject_name}`, 10, 10);
			doc.autoTable({
				head: [["Student ID", "Student Name", "Percentage"]],
				body: data.map((item) => [
					item.student_id,
					item.student_name,
					item.attendance_percentage,
				]),
			});
			doc.save(`${subject_name}_report.pdf`);
		})
		.catch((error) => console.error("Error:", error));
}
fill();
