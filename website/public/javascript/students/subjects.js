const student_id = window.location.pathname.split("/")[2];
$.ajax({
    url: "/getAttendanceDetails",
    method: "POST",
    data: {
        student_id
    },
    success: (data, textStatus, jqXHR) => {
        console.log(data);
        data.forEach(subject => {
            console.log(subject);
            const card = `
                <div class="card">
                    <span class="subject">${subject.subject_name}</span>
                    <div class="circle">
                        <div class="percentage">${Math.floor(subject.attendance_percentage)}%</div>
                    </div>
                    <div class="fraction">${subject.present_count}/${subject.total_classes}</div>
                </div>
            `;
            $('.container').append(card);
        });
    },
    error: (err) => {
        console.log(err);
    },
});