import { AuthLayout } from "@/components/layout/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/global/user";
import { useLoginMutation } from "@/service/authentication";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface LoginFormValues {
	email: string;
	password: string;
}

export function Login() {
	const setUser = useUserStore((state) => state.setUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>();
	const navigate = useNavigate();
	const { mutate: doLogin, isPending: isPendingLogin } = useLoginMutation();

	const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
		doLogin(
			{
				identifier: data.email,
				password: data.password,
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
					toast("Login Successful", {
						description: "Welcome back! You have successfully logged in.",
					});
					navigate("/article");
				},
				onError: (error) => {
					toast.error("Login Failed", {
						description: `${error.message}. Please check your credentials and try again.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<AuthLayout
			variant="login"
			title="Login to Dashboard"
			description="Enter your email and password below to login to your account"
		>
			<form className="grid gap-4" onSubmit={handleSubmit(handleLogin)}>
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
						})}
					/>
					{errors.password && (
						<span role="alert" className="text-destructive text-sm -mt-1">
							{errors.password?.message}
						</span>
					)}
				</fieldset>
				<Button type="submit" className="w-full" disabled={isPendingLogin}>
					Login
					{isPendingLogin && <Loader2 className="w-4 h-4 animate-spin" />}
				</Button>
			</form>
		</AuthLayout>
	);
}
