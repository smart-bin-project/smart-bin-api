import mongoose, { Schema, Document } from 'mongoose';
import { Connection } from '../connection.ts';
import dotenv from 'dotenv';

dotenv.config();

interface SmartBin {
  fullTime: string;
  emptyTime: string;
  binNumber: number;
}

interface SmartBinDocument extends SmartBin, Document {}

const SmartBinSchema = new Schema<SmartBinDocument>(
  {
    fullTime: {
      type: String,
      required: true,
    },
    emptyTime: {
      type: String,
      required: true,
    },
    binNumber: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const SmartBinModel = mongoose.model<SmartBinDocument>('SmartBin', SmartBinSchema);

export class MongoDBSmartBinService {
  constructor(private readonly connection: Connection) {}

  async connect(): Promise<void> {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      throw new Error('DB URL not found in environment variables.');
    }

    const isConnected = await this.connection.connect(dbUrl);

    if (!isConnected) {
      throw new Error('DB not connected');
    }
  }

  async createSmartBin(fullTime: string, emptyTime: string, binNumber: number): Promise<SmartBinDocument> {
    await this.connect();

    const newSmartBin = await SmartBinModel.create({
      fullTime,
      emptyTime,
      binNumber,
    });

    return newSmartBin;
  }

  async getSmartBinByNumber(binNumber: number): Promise<SmartBinDocument | null> {
    await this.connect();
    return SmartBinModel.findOne({ binNumber });
  }

  async getAllSmartBins(): Promise<SmartBinDocument[]> {
    await this.connect();
    return SmartBinModel.find({});
  }

  async deleteSmartBinByNumber(binNumber: number): Promise<boolean> {
    try {
      await this.connect();
      const deletedBin = await SmartBinModel.findOneAndDelete({ binNumber });
      return !!deletedBin; // Returns true if the bin was successfully deleted, false otherwise
    } catch (error) {
      console.error('Error deleting SmartBin:', error);
      return false;
    }
  }

  async updateFullTimeByNumber(binNumber: number, fullTime: string): Promise<SmartBinDocument | null> {
    try {
      await this.connect();
      const updatedBin = await SmartBinModel.findOneAndUpdate(
        { binNumber },
        { fullTime },
        { new: true }
      );
      if (!updatedBin) {
        throw new Error('SmartBin not found');
      }
      return updatedBin;
    } catch (error) {
      console.error('Error updating SmartBin full time:', error);
      return null;
    }
  }

  async updateEmptyTimeByNumber(binNumber: number, emptyTime: string): Promise<SmartBinDocument | null> {
    try {
      await this.connect();
      const updatedBin = await SmartBinModel.findOneAndUpdate(
        { binNumber },
        { emptyTime },
        { new: true }
      );
      if (!updatedBin) {
        throw new Error('SmartBin not found');
      }
      return updatedBin;
    } catch (error) {
      console.error('Error updating SmartBin empty time:', error);
      return null;
    }
  }
  
}
