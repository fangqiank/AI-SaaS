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

export async function addImage({image, userId, path}: AddImageParams){
  try{
    await connectDB()

    const author = await User.findById(userId)

    if(!author)
      throw new Error('User not found')

    const newImage = await Image.create({
      ...image,
      author: author._id
    })

    revalidatePath(path)

    return JSON.parse(JSON.stringify(newImage))
  }catch(err){
    handleError(err)
  }
}

export async function updateImage({image, userId, path}: UpdateImageParams){
  try{
    await connectDB()

    const updImage = await Image.findById(image._id)

    if(!updImage || updImage.author.toHexString() !== userId){
      throw new Error('Unauthorized or image not found')
    }

    const updatedImage = await Image.findByIdAndUpdate(
      updImage._id, 
      image, 
      {
        new: true
      }
    )

    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedImage))
  }catch(err){
    handleError(err)
  }
}
export async function deleteImage(imageId: string){
  try{
    await connectDB()

    await Image.findByIdAndDelete(imageId)
  }catch(err){
    handleError(err)
  }finally{
    redirect('/')
  }
}

export async function getImageById(imageId: string){
  try{
    await connectDB()

    const image = await populateUser(Image.findById(imageId))

    if(!image)
      throw new Error('Image not found')

    return JSON.parse(JSON.stringify(image))
  }catch(err){
    handleError(err)
  }
}

export async function getImages({limit = 9, page = 1, searchQuery = ''} : {
  limit?: number,
  page: number,
  searchQuery?: string
}) {
  try{
    await connectDB()

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUNDINARY_API_KEY,
      api_secret: process.env.CLOUNDINARY_API_SECRET,
      secure: true
    })

    let exp = 'folder=ai_saas'

    if(searchQuery)
      exp += `AND ${searchQuery}`

    const {resources} = await cloudinary.search
      .expression(exp)
      .execute()

    const resourcesIds = resources.map((item: any) => item.public_id)

    let query = {

    }
    
    if(searchQuery){
      query = {
        publicId: {
          $in: resourcesIds //include
        }
      }
    }

    const skipAmount =(Number(page) - 1) * limit

    const images = await populateUser(Image.find(query))
      .sort({updatedAt: -1})
      .skip(skipAmount)
      .limit(limit)

    const totalImages = await Image.find(query).countDocuments()
    const savedImages = await Image.find().countDocuments()

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages
    }

  }catch(err){
    handleError(err)
  }
}

export async function getImagesByUser({limit = 9, page = 1, userId}: {
  limit?: number,
  page: number,
  userId: string
}){
  try{
    await connectDB()

    const skip = (Number(page) - 1) * limit

    const images = await populateUser(Image.find({author: userId}))
      .sort({updatedAt: -1})
      .skip(skip)
      .limit(limit)

    const totalImages = await Image.find({author: userId})
      .countDocuments()

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit)
    }
  }catch(err){
    handleError(err)
  }
}