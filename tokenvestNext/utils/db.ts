import mongoose from "mongoose";

const connection = {
  isConnected: 0,
};

const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI!);

  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
};

export default connectDB;
