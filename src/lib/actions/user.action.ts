'use server'

import {revalidatePath} from 'next/cache'
import User from '../models/user.model'
import { connectDB } from '../mongoose'
import { handleError } from '../utils'

//Create
export async function createUser(user: CreateUserParams){
	try{
		await connectDB()

		const newUser = await User.create(user)

		return JSON.parse(JSON.stringify(newUser))
	}catch(err){
		handleError(err)
	}
}

//Read
export async function getUserById(userId: string){
	try{
		await connectDB()

		const user = await User.findOne({clerkId: userId})

		if(!user)
			throw new Error('user not found')
	}catch(err){
		handleError(err)
	}
}

//Update
export async function updateUser(clerkId: string, user: UpdateUserParams){
	try{
		await connectDB()

		const updUser = await User.findOneAndUpdate(
			{clerkId},
			user,
			{
				new: true
			}
		)

		if(!updUser)
			throw new Error("User update failed")

		return JSON.parse(JSON.stringify(updUser))
	}catch(err){
		handleError(err)
	}
}

//Delete
export async function deleteUser(clerkId: string){
	try{
		await connectDB()

		const user = await User.findOne({clerkId})

		if(!user)
			throw new Error("User not found")

		const result = await User.findByIdAndDelete(user._id)
		revalidatePath('/')

		return result ? JSON.parse(JSON.stringify(user)) : null
	} catch (err) {
    handleError(err)
  }
}

//Update User Credits
export async function updateCredit(	userId: string, credit: Number){
	try{
		await connectDB()

		const updUserCredits = await User.findOneAndUpdate(
			{
				_id: userId
			},

			{
				$inc: {creditBalance: credit}
			},

			{
				new: true
			}
		)

		if(!updUserCredits)
			throw new Error("User credits update failed")

		return JSON.parse(JSON.stringify(updUserCredits))
	}catch (err) {
    handleError(err)
  }
}
