const currUserId = window.location.pathname.split("/")[2];
const handlers = {
	profileHandler: "/profile",
	subjectsHandler: "/subjects",
	notificationsHandler: "/notifications",
};
Object.entries(handlers).forEach(([id, path]) => {
	document.getElementById(id).addEventListener("click", () => {
		window.location.pathname = `/student/${currUserId}${path}`;
	});
});
document.getElementById("logout").addEventListener("click", () => {
	window.location.pathname = "/logout";
});
