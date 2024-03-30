import { WorksCollection } from "@/components/shared/WorksCollection";
import { navLinks } from "@/constants";
import { getImages } from "@/lib/actions/image.action";
import Image from "next/image";
import Link from "next/link";

const Home =  async ({searchParams}: SearchParamProps) => {
	const page = Number(searchParams?.page) || 1
	const searchQuery = (searchParams?.query as string) || ''

	const images = await getImages({page, searchQuery})

	return (
		<>
			<section className="home">
				<h1 className="home-heading">
					Unleash Your Creative Vision with AI-SaaS
				</h1>
				<ul className="flex-center w-full gap-20">
					{navLinks.slice(1, 5).map(item => (
						<Link
							key={item.route}
							href={item.route}
							className="flex-center flex-col gap-2"
						>
							<li className="flex-center w-fit rounded-full bg-white p-4">
								<Image
									src={item.icon}
									alt="icon"
									width={24}
									height={24} 
								/>
							</li>
							<p className="p-14-medium text-center text-white">{item.label}</p>
						</Link>
					))}
				</ul>
			</section>

			<section className="sm:mt-12">
				<WorksCollection 
					hasSearch={true}
					images={images?.data}
					totalPages={images?.totalPage}
					page={page}
				/>
			</section>
		</>
	)
};

export default Home


