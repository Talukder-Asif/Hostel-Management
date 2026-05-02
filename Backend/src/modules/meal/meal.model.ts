// src/modules/meal/meal.model.ts
import mongoose, { Schema } from 'mongoose';
import { IMeal } from '../../types';

const mealItemSchema = new Schema({
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
  },
  time: {
    type: String,
    enum: ['morning', 'evening', 'night'],
    required: [true, 'Meal time is required'],
  },
});

const mealStudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  isPresent: {
    type: Boolean,
    default: true,
  },
});

const mealSchema = new Schema<IMeal>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    meals: [mealItemSchema],
    students: [mealStudentSchema],
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

// Compound index for unique meal per date
mealSchema.index({ date: 1 }, { unique: true });

const Meal = mongoose.model<IMeal>('Meal', mealSchema);
export default Meal;
