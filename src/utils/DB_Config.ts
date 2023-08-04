import mongoose from 'mongoose'

const url: string = process.env.DB_CONNECTION!.replace('<password>', process.env.DB_PASSWORD!)

export const conn = mongoose.connect(url)
