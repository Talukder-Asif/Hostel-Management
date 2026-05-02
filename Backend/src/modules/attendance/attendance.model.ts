// src/modules/attendance/attendance.model.ts
import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../../types';

const attendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    isPresent: {
      type: Boolean,
      default: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by user is required'],
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure one attendance per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;
