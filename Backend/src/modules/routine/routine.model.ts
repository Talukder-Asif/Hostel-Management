// src/modules/routine/routine.model.ts
import mongoose, { Schema } from 'mongoose';
import { IMonthlyRoutine } from '../../types';

const dailyMealSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  morning: {
    foodName: String,
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  evening: {
    foodName: String,
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  night: {
    foodName: String,
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
});

const monthlyRoutineSchema = new Schema<IMonthlyRoutine>(
  {
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    routine: [dailyMealSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for month and year
monthlyRoutineSchema.index({ month: 1, year: 1 }, { unique: true });

const MonthlyRoutine = mongoose.model<IMonthlyRoutine>(
  'MonthlyRoutine',
  monthlyRoutineSchema,
);
export default MonthlyRoutine;
