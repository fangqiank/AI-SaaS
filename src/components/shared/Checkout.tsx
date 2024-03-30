'use client'

import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";
import { CheckoutCredits } from "@/lib/actions/transaction.action";

type CheckoutProps = {
	plan: string,
	amount: number,
	credits: number,
	buyerId: string
};

export const Checkout = ({
	plan,
	amount,
	credits,
	buyerId
}: CheckoutProps) => {
	const {toast} = useToast()

	useEffect(() => {
		loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
	}, [])

	useEffect(() => {
		const query = new URLSearchParams(window.location.search)

		if(query.get('success')){
			toast({
				title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
			})
		}

		if(query.get('canceled')){
			toast({
				title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
			})
		}
	}, [])

	const onCheckout = async () => {
		const transaction = {
			plan,
      amount,
      credits,
      buyerId,
		}

		await CheckoutCredits(transaction)
	} 

	return (
		<form 
			action={onCheckout}
			method="POST"
		>
			<section>
				<Button
					type="submit"
					role="link"
					className="w-full rounded-full bg-purple-gradient bg-cover"
				>
					Buy Credit
				</Button>
			</section>
		</form>
	)
};