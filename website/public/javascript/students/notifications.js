const student_id = window.location.pathname.split("/")[2];
fetch("/dangerSubject", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({ student_id }),
})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		const ul = document.querySelector("li");
		data.forEach((subject) => {
			const li = document.createElement("li");
			li.classList.add(
				"flex",
				"items-center",
				"bg-gray-100",
				"p-3",
				"rounded-lg",
				"shadow"
			);
			li.innerHTML = `<span class="text-blue-500 text-xl mr-3">🛑</span>
						<p class="text-gray-700">${subject.subject_name} -- ${Math.floor(
				subject.attendance_percentage
			)}</p>`;
			console.log(li.innerHTML);
			ul.appendChild(li);
		});
	})
	.catch((error) => {
		console.error("Error fetching danger subjects:", error);
	});
