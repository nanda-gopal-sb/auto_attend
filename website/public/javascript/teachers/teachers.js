const currUserId = window.location.pathname.split("/")[2];
const handlers = {
	reportsHandler: "/reports",
	profileHandler: "/profile",
	subjectHandler: "/subjects",
};
Object.entries(handlers).forEach(([id, path]) => {
	document.getElementById(id).addEventListener("click", () => {
		window.location.pathname = `/teacher/${currUserId}${path}`;
	});
});
