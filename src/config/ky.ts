import Cookies from "js-cookie";
import ky from "ky";

export const KyInstance = (withAuth = true) => {
	return ky.create({
		prefixUrl: import.meta.env.VITE_BASE_API_URL,
		hooks: {
			beforeRequest: [
				(request) => {
					if (withAuth) {
						const token = Cookies.get("token");
						if (!token) {
							window.location.href = "/auth/login";
						}
						request.headers.set("Authorization", `Bearer ${token}`);
					}
				},
			],
			afterResponse: [
				(_request, _options, response) => {
					if (response.status === 401) {
						window.location.href = "/401";
					}
				},
			],
		},
		retry: {
			limit: 0,
		},
	});
};
