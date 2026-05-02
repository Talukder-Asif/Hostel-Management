// src/modules/utility/utility.model.ts
import mongoose, { Schema } from 'mongoose';
import { IUtilityBill } from '../../types';

const billItemSchema = new Schema({
  billType: {
    type: String,
    enum: ['gas', 'electricity', 'water', 'wifi', 'other'],
    required: [true, 'Bill type is required'],
  },
  billName: {
    type: String,
    required: [true, 'Bill name is required'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  description: String,
  billDate: {
    type: Date,
    required: [true, 'Bill date is required'],
  },
});

const paidBySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

const utilityBillSchema = new Schema<IUtilityBill>(
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
    bills: [billItemSchema],
    totalActiveUsers: {
      type: Number,
      required: true,
    },
    perPersonAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    paidBy: [paidBySchema],
  },
  {
    timestamps: true,
  },
);

// Compound index for month and year
utilityBillSchema.index({ month: 1, year: 1 }, { unique: true });

const UtilityBill = mongoose.model<IUtilityBill>(
  'UtilityBill',
  utilityBillSchema,
);
export default UtilityBill;
