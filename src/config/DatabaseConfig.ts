import logger from '@utils/logger';
import mongoose from 'mongoose';

const ConnectDatabase = async () => {
  try {
    const url: string = process.env.DATABASE_URL as string;
    const conn = await mongoose.connect(url);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`${error.message}`);
    process.exit(1);
  }
};

export default ConnectDatabase;
