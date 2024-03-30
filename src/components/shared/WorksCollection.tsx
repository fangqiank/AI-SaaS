'use client'

import { IImage } from "@/lib/models/image.model";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { Card } from "./Card";
import { Search } from "./Search";

type WorksCollectionProps = {
	images: IImage[],
	totalPages?: number,
	page: number,
	hasSearch?: boolean
};

export const WorksCollection = ({
	hasSearch=false,
	images,
	totalPages=1,
	page
}: WorksCollectionProps) => {
	const router = useRouter()
	const params = useSearchParams()

	const onPageChange = (action: string) => {
		const pageValue = action === 'next' ? Number(page) + 1 : Number(page) - 1
		
		const newUrl = formUrlQuery({
			searchParams: params.toString(),
			key: 'page',
			value: pageValue
		})

		router.push(newUrl, {
			scroll: false
		})
	}

	return (
		<>
			<div className="collection-heading">
				<h2 className="h2-bold text-dark-600">Recent Works</h2>
				{hasSearch && (<Search />)}
			</div>

			{images.length > 0 ? (
				<ul className="collection-list">
					{images.map(image => (
						<Card
							image={image}
							key={image._id} 
						/>
					))}
				</ul>
			) : (
				<div className="collection-empty">
					<p className="p-20-semibold">Empty</p>
				</div>
			)}

			{totalPages > 1 && (
				<Pagination className="mt-10">
					<PaginationContent className="flex w-full">
						<Button
							disabled={Number(page) <= 1}
							className="collection-btn"
							onClick={() => onPageChange('prev')}
						>
							<PaginationPrevious
								className="hober:bg-transparent hover:text-white" 
							/>
						</Button>

						<p className="flex-center p-16-medium w-fit flex-1">{page} / {totalPages}</p>

						<Button
							disabled={Number(page) >= totalPages}
							className="button w-32 bg-purple-gradient bg-cover text-white"
							onClick={() => onPageChange('next')}
						>
							<PaginationNext
								className="hober:bg-transparent hover:text-white" 
							/>
						</Button>
					</PaginationContent>
				</Pagination>
			)}
		</>
	)
};
