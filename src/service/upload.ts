import { KyInstance } from "@/config/ky";
import type { ResponseError } from "@/types/response";
import type { UploadReqBody, UploadResBody } from "@/types/upload";
import { type DefaultError, useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";

export const useUploadMutation = () => {
	return useMutation<UploadResBody[], DefaultError, UploadReqBody>({
		mutationFn: async (data) => {
			const formdData = new FormData();
			for (const [key, value] of Object.entries(data)) {
				formdData.append(key, value);
			}
			try {
				return await KyInstance()
					.post("api/upload", {
						body: formdData,
					})
					.json<UploadResBody[]>();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Upload file failed, please try again",
						);
					}
				}
				throw new Error("Upload file failed");
			}
		},
	});
};
