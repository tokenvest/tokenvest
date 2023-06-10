import mongoose from 'mongoose';

export async function establishDatabaseConnection() {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(import.meta.env.VITE_MONGODB_URL || '', {
      dbName: import.meta.env.VITE_MONGODB_DATABASE || 'tokenvest',
      retryWrites: true,
      writeConcern: {
        w: 'majority',
      },
    });

    console.log('Database connected');
  } catch (e) {
    console.error(e);
  }
}
