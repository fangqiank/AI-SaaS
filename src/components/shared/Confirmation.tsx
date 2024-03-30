'use client'

import { useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { deleteImage } from "@/lib/actions/image.action";

type ConfirmationProps = {
	imageId: string
};

export const Confirmation = ({imageId}: ConfirmationProps) => {
	const [isPending, startTransition] = useTransition()

	return (
		<AlertDialog>
			<AlertDialogTrigger
				asChild
				className="w-full rounded-full"
			>
				<Button
					type="button"
					className="button h-[44px] w-full md:h-[54px]"
					variant='destructive'
				>
					Delete Image
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="flex flex-col gap-10">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this image?
					</AlertDialogTitle>

					<AlertDialogDescription className="p-16-regular">
						This will permanently delete this image
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="border bg-red-500 text-white hover:bg-red-600"
						onClick={() => startTransition(async () => {
							await deleteImage(imageId)
						})}
					>
						{isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
};
