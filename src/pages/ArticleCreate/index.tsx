import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateArticleMutation } from "@/service/article";
import { useGetCategories } from "@/service/category";
import { useUploadMutation } from "@/service/upload";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, ImageUp, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CreateArticleFormValues {
	image: File | undefined;
	title: string;
	category: string;
	description: string;
}

export default function ArticleCreate() {
	const [imagePreview, setImagePreview] = useState<string>("");

	const {
		control,
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm<CreateArticleFormValues>({
		defaultValues: {
			image: undefined,
		},
	});
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: categories, isPending: isPendingCategories } =
		useGetCategories();
	const { mutate: doUploadFile, isPending: isPendingUploadFile } =
		useUploadMutation();
	const { mutate: doCreateArticle, isPending: isPendingCreateArticle } =
		useCreateArticleMutation();

	const onDrop = (acceptedFiles: File[]) => {
		setImagePreview(URL.createObjectURL(acceptedFiles[0]));
		setValue("image", acceptedFiles[0], { shouldValidate: true });
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/png": [".png"],
			"image/jpg": [".jpg"],
			"image/webp": [".webp"],
			"image/avif": [".webp"],
		},
	});

	const handleCreateArticle: SubmitHandler<CreateArticleFormValues> = (
		data,
	) => {
		doUploadFile(
			{
				files: data.image as File,
			},
			{
				onSuccess: (res) => {
					doCreateArticle(
						{
							data: {
								category: Number(data.category),
								cover_image_url: res.length > 0 ? res[0].url : "",
								description: data.description,
								title: data.title,
							},
						},
						{
							onSuccess: () => {
								queryClient.invalidateQueries({ queryKey: ["articles"] });
								toast("Article Created", {
									description: "Your article has been successfully created.",
								});
								navigate("/dashboard/article");
							},
							onError: (error) => {
								toast.error("Failed to Create New Article", {
									description: `${error.message}. Please try again later.`,
								});
								import.meta.env.DEV && console.error("Error occured", error);
							},
						},
					);
				},
				onError: (error) => {
					toast.error("Failed to Upload an Image", {
						description: `${error.message}. Please try again later.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<main className="p-4 md:gap-8 md:p-8">
			<form
				className="grid grid-cols-1 gap-5"
				onSubmit={handleSubmit(handleCreateArticle)}
			>
				{imagePreview ? (
					<div className="w-full max-w-[500px] lg:w-2/5 lg:max-w-none mx-auto aspect-video relative group">
						<img
							src={imagePreview}
							alt="Preview"
							className="absolute w-full h-full object-cover"
						/>
						<button
							type="button"
							onClick={() => {
								setValue("image", undefined, { shouldValidate: false });
								setImagePreview("");
							}}
							className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						>
							<Trash2 className="w-5 h-5 text-destructive" />
						</button>
					</div>
				) : (
					<div
						id="dropzone-container"
						{...getRootProps()}
						className={cn(
							"w-full max-w-[500px] lg:w-2/5 lg:max-w-none mx-auto aspect-video border-dashed border-border border-2 flex items-center justify-center text-center text-sm",
							!!errors.image && "border-destructive dark:border-destructive",
						)}
					>
						<Controller
							control={control}
							name="image"
							rules={{
								required: "Please insert an image!",
							}}
							render={() => <input {...getInputProps()} />}
						/>
						{isDragActive ? (
							<div className="flex flex-col space-y-2 items-center">
								<ImagePlus className="w-10 h-10" />
								<p>Drop the files here ...</p>
							</div>
						) : (
							<div className="flex flex-col space-y-2 items-center">
								<ImageUp className="w-10 h-10" />
								<p>Drag 'n' drop some files here, or click to select files</p>
							</div>
						)}
					</div>
				)}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
					<fieldset className="grid gap-2 auto-rows-min">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							aria-invalid={!!errors.title}
							{...register("title", {
								required: "Title can't be empty!",
								minLength: {
									value: 10,
									message: "Title must contains atleast 10 character length!",
								},
							})}
						/>
						{errors.title && (
							<p role="alert" className="-mt-1 text-destructive">
								{errors.title.message}
							</p>
						)}
					</fieldset>
					<fieldset className="grid gap-2 auto-rows-min">
						<Label id="category">Category</Label>
						{isPendingCategories && !categories ? (
							<Input disabled className="mt-2 disabled:cursor-not-allowed" />
						) : (
							<Controller
								name="category"
								control={control}
								rules={{ required: "Please select a category!" }}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger
											className="w-full"
											aria-invalid={!!errors.category}
										>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{categories?.data?.map((category) => (
												<SelectItem
													key={category.documentId}
													value={category.documentId}
												>
													{category?.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						)}
						{errors.category && (
							<p role="alert" className="-mt-1 text-destructive">
								{errors.category.message}
							</p>
						)}
					</fieldset>
				</div>
				<fieldset className="grid gap-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						aria-invalid={!!errors.description}
						{...register("description", {
							required: "Description can't be empty!",
							minLength: {
								value: 20,
								message:
									"Description must contains atleast 20 character length!",
							},
						})}
					/>
					{errors.description && (
						<p role="alert" className="-mt-1 text-destructive">
							{errors.description.message}
						</p>
					)}
				</fieldset>
				<div className="flex justify-end gap-2 mt-5">
					<Button
						type="button"
						variant="destructive"
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isPendingUploadFile || isPendingCreateArticle}
					>
						Save{" "}
						{(isPendingUploadFile || isPendingCreateArticle) && (
							<Loader2 className="w-5 h-5 animate-spin" />
						)}
					</Button>
				</div>
			</form>
		</main>
	);
}
