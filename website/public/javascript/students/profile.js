function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const imgElement = document.getElementById("profile-pic");
        imgElement.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}
const student_id = window.location.pathname.split("/")[2];
console.log(student_id);
$.ajax({
    url: "/getSingleStudent",
    method: "POST",
    data: {
        student_id
    },
    success: (data, textStatus, jqXHR) => {
        console.log(data);
        document.getElementById("name").textContent = data[0].student_name;
        document.getElementById("Class").textContent = data[0].class_name;
        document.getElementById("Department").textContent = data[0].department_name;
    },
    error: (err) => {
        console.log(err);
    },
});
