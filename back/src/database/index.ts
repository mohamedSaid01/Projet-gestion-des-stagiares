import mongoose  from 'mongoose'

const db = process.env.DB_URI
if (db) {
  mongoose.connect(db)
  .then(() => {
    console.log("Mongoose connection done 😄");
  })
  .catch(() => {
    console.log("Mongoose connection failed 😢");
  })
} else {
  console.error("DB_URI is not defined in the environment variables");
}