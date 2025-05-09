import { KyInstance } from "@/config/ky";
import type {
	LoginReqBody,
	LoginResBody,
	RegisterReqBody,
	RegisterResBody,
} from "@/types/authentication";
import type { ResponseError } from "@/types/response";
import { type DefaultError, useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";

export const useLoginMutation = () => {
	return useMutation<LoginResBody, DefaultError, LoginReqBody>({
		mutationFn: async (data) => {
			try {
				return await KyInstance(false)
					.post("api/auth/local", { json: data })
					.json();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ?? "Login failed, please try again",
						);
					}
				}
				throw new Error("Login failed");
			}
		},
	});
};

export const useRegisterMutation = () => {
	return useMutation<RegisterResBody, DefaultError, RegisterReqBody>({
		mutationFn: async (data) => {
			try {
				return await KyInstance(false)
					.post("api/auth/local/register", { json: data })
					.json();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Register failed, please try again",
						);
					}
				}
				throw new Error("Registre failed");
			}
		},
	});
};
