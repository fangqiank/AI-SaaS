'use server'

import {revalidatePath} from 'next/cache'
import User from '../models/user.model'
import Image from '../models/image.model'
import { connectDB } from '../mongoose'
import { handleError } from '../utils'
import {redirect} from 'next/navigation'
import {v2 as cloudinary} from 'cloudinary'

const populateUser = (query: any) => query.populate({
	path: 'author',
  model: User,
  select: '_id firstName lastName clerkId'
})