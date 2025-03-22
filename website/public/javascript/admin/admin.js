document.addEventListener("DOMContentLoaded", function () {
    const currUserId = window.location.pathname.split("/")[2];
    document.getElementById(
        "header"
    ).textContent = `Welcome Admin ${currUserId}`;
    const handlers = {
        classHandler: "/class_manager",
        teacherHandler: "/teacher_manager",
        studentHandler: "/student_manager",
        subjectHandler: "/subject_manager",
        departmentHandler: "/department_manager",
    };
    Object.entries(handlers).forEach(([id, path]) => {
        document.getElementById(id).addEventListener("click", () => {
            window.location.pathname = `/admin/${currUserId}${path}`;
        });
    });
    document.getElementById("logout").addEventListener("click", () => {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log("logout");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});