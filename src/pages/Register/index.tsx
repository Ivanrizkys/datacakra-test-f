import { AuthLayout } from "@/components/layout/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/global/user";
import { useRegisterMutation } from "@/service/authentication";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface RegisterFormValues {
	username: string;
	email: string;
	password: string;
}

export function Register() {
	const setUser = useUserStore((state) => state.setUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>();
	const navigate = useNavigate();
	const { mutate: doRegister, isPending: isPendingRegister } =
		useRegisterMutation();

	const handleRegister: SubmitHandler<RegisterFormValues> = async (data) => {
		doRegister(
			{
				email: data.email,
				password: data.password,
				username: data.username,
			},
			{
				onSuccess: (res) => {
					Cookies.set("token", res.jwt, { expires: 0.25 }); // 6 hours = 0.25 days
					setUser({
						id: res.user.id,
						blocked: res.user.blocked,
						confirmed: res.user.confirmed,
						documentId: res.user.documentId,
						email: res.user.email,
						provider: res.user.provider,
						username: res.user.username,
					});
					toast("Register Successful", {
						description: "Welcome! You have successfully registered.",
					});
					navigate("/dashboard/article");
				},
				onError: (error) => {
					toast.error("Register Failed", {
						description: `${error.message}. Please check your input and try again.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<AuthLayout
			variant="register"
			title="Register Account"
			description="Enter your information bellow to create an account"
		>
			<form className="grid gap-4" onSubmit={handleSubmit(handleRegister)}>
				<fieldset className="grid gap-2">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="Your username"
						autoComplete="username"
						aria-invalid={errors.username ? "true" : "false"}
						{...register("username", {
							required: "Username can't be empty!",
							minLength: {
								value: 5,
								message: "Username must contains atleast 5 character length!",
							},
						})}
					/>
					{errors.username && (
						<span role="alert" className="text-destructive text-sm -mt-1">
							{errors.username?.message}
						</span>
					)}
				</fieldset>
				<fieldset className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						autoComplete="email"
						aria-invalid={errors.email ? "true" : "false"}
						{...register("email", {
							required: "Email can't be empty!",
							pattern: {
								value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
								message: "Email must be valid!",
							},
						})}
					/>
					{errors.email && (
						<span role="alert" className="text-destructive text-sm -mt-1">
							{errors.email?.message}
						</span>
					)}
				</fieldset>
				<fieldset className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="******"
						autoComplete="current-password"
						aria-invalid={errors.password ? "true" : "false"}
						{...register("password", {
							required: "Password can't be empty!",
							minLength: {
								value: 5,
								message: "Password must contains atleast 5 character length!",
							},
						})}
					/>
					{errors.password && (
						<span role="alert" className="text-destructive text-sm -mt-1">
							{errors.password?.message}
						</span>
					)}
				</fieldset>
				<Button type="submit" className="w-full" disabled={isPendingRegister}>
					Register
					{isPendingRegister && <Loader2 className="w-4 h-4 animate-spin" />}
				</Button>
			</form>
		</AuthLayout>
	);
}
