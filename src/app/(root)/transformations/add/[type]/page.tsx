import { Header } from "@/components/shared/Header";
import { TransformationForm } from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import {auth} from '@clerk/nextjs'
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const AddTransformationTypePage = async ({params: {type}}: SearchParamProps) => {
	const transformation = transformationTypes[type]
	const {userId} = auth()

	if(!userId)
		redirect('/sign-in')

	const user = await getUserById(userId)

	return (
		<>
			<Header 
				title = {transformation.title}
				subTitle = {transformation.subTitle}
			/>

			<section className='mt-10'>
				<TransformationForm 
					action="Add"
					userId={user._id}
					type={transformation.type as TransformationTypeKey}
					creditBalance={user.creditBalance}
				/>
			</section>
		</>
	)
};

export default AddTransformationTypePage;
