function previewImage(event) {
	const reader = new FileReader();
	reader.onload = function () {
		const imgElement = document.getElementById("profilePic");
		imgElement.src = reader.result;
	};
	reader.readAsDataURL(event.target.files[0]);
}
const teacher_id = window.location.pathname.split("/")[2];
fetch("/getTeacherDetails", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({ teacher_id }),
})
	.then((response) => response.json())
	.then((data) => {
		const obj = data[0];
		const subjectsElement = document.getElementById("subjects");
		const departmentElement = document.getElementById("departments");
		const subjectsParagraph = document.createElement("p");
		subjectsParagraph.textContent = obj.subject_name;
		subjectsElement.appendChild(subjectsParagraph);
		const departmentPara = document.createElement("p");
		departmentPara.textContent = obj.department_name;
		departmentElement.appendChild(departmentPara);
		const name = (document.getElementById("name").innerHTML = obj.teacher_name);
	})
	.catch((error) => {
		console.error("Error fetching teacher details:", error);
	});
