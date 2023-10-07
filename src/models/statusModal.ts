import mongoose, { Document, Model, Schema } from 'mongoose';

interface IStatus extends Document {
  user: Schema.Types.ObjectId;
  lastSeen: Date;
  online:boolean
}
const statusSchema: Schema = new Schema<IStatus>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  online:{},
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

const statusModel:Model<IStatus> = mongoose.model<IStatus>('status',statusSchema)

export {IStatus,statusModel}
