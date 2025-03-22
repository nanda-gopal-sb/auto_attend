function getString(input) {
    const periodIndex = input.indexOf(".");
    if (periodIndex === -1) {
        return input;
    }
    return input.substring(0, periodIndex);
}
function deleteAll(id) {
    id.forEach((ids) => {
        $(ids).empty();
    });
}
var classIDs = ["#selectClassAssign", "#selectClassChange"];
var departmentIDs = ["#selectDepartmentAdd", "#selectDepartmentDelete"];
var studentIDs = [
    "#selectStudentDelete",
    "#selectStudentAssign",
    "#selectStudentChange",
];
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
                    $(ids).append(
                        `<option>${element.department_id}.${element.department_name}</option>`
                    );
                });
            });
        }
    });
}
function getStudents(id) {
    $.get("/getStudents", function (data, status) {
        if (data.length == 0) {
            id.forEach((ids) => {
                $(ids).append(`<option>No Classes Found</option>`);
            });
            return;
        } else {
            data.forEach((element) => {
                id.forEach((ids) => {
                    $(ids).append(
                        `<option>${element.student_id}.${element.student_name}</option>`
                    );
                });
            });
        }
    });
}
getClass(classIDs);
getDepartments(departmentIDs);
getStudents(studentIDs);
$("#submitStudent").click(() => {
    const student_name = $("#studentName").val();
    const department_id = $("#selectDepartmentAdd").val().split("")[0];
    const student_id = $("#studentId").val();
    const student_email = $("#student_email").val();
    if (student_name == null || department_id == null || student_id == null) {
        alert("Please fill details");
        return;
    }
    $.ajax({
        url: "/addStudent",
        method: "POST",
        data: {
            student_id,
            student_name,
            department_id,
            student_email
        },
        success: (data, textStatus, jqXHR) => {
            console.log("Sucess");
            deleteAll(studentIDs);
            getStudents(studentIDs);
            showNotification("Student added successfully", 3000);
        },
        error: (err) => {
            console.log(err);
            showNotification("Error adding student", 3000);
        },
    });
});
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
$("#addAllotment").click(() => {
    const student_id = getString(
        $("#selectStudentAssign").val().split(".")[0]
    );
    const class_id = extractAndConvert($("#selectClassAssign").val());
    console.log(student_id);
    $.ajax({
        url: "/addEnrollment",
        method: "POST",
        data: {
            student_id,
            class_id,
        },
        success: (data, textStatus, jqXHR) => {
            console.log("Sucess");
            showNotification("Class assigned successfully", 3000);
        },
        error: (err) => {
            console.log(err);
            showNotification("Error assigning class", 3000);
        },
    });
});
$("#submitDelete").click(() => {
    const student_id = getString(
        $("#selectStudentDelete").val().split(".")[0]
    );
    $.ajax({
        url: "/deleteStudent",
        method: "DELETE",
        data: {
            student_id,
        },
        success: (data, textStatus, jqXHR) => {
            console.log("Sucess");
            deleteAll(studentIDs);
            getStudents(studentIDs);
            showNotification("Student deleted successfully", 3000);
        },
        error: (err) => {
            console.log(err);
            showNotification("Error deleting student", 3000);
        },
    });
});
$("#changeClass").click(() => {
    const student_id = getString(
        $("#selectStudentChange").val().split(".")[0]
    );
    const newClassId = extractAndConvert($("#selectClassChange").val());
    console.log(student_id);
    $.ajax({
        url: "/changeClass",
        method: "PUT",
        data: {
            student_id,
            newClassId,
        },
        success: (data, textStatus, jqXHR) => {
            console.log("Sucess");
            showNotification("Class changed successfully", 3000);
        },
        error: (err) => {
            console.log(err);
            showNotification("Error changing class", 3000);
        },
    });
});

function showNotification(message, duration) {
    const notification = $("#notification");
    notification.text(message);
    notification.fadeIn();

    setTimeout(() => {
        notification.fadeOut();
    }, duration);
}