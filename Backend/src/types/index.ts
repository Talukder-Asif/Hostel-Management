// src/types/index.ts
import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  isManager: boolean;
  isActive: boolean;
  address?: string;
  city?: string;
  contact?: string;
  fatherContact?: string;
  image?: string;
  roomNo?: string;
  blockNo?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance extends Document {
  user: string | IUser;
  date: Date;
  isPresent: boolean;
  markedBy: string | IUser;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealItem {
  foodName: string;
  time: 'morning' | 'evening' | 'night';
}

export interface IMealStudent {
  user: string | IUser;
  addedBy: string | IUser;
  addedAt: Date;
  isPresent: boolean;
}

export interface IMeal extends Document {
  date: Date;
  meals: IMealItem[];
  students: IMealStudent[];
  createdBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDailyMeal {
  date: Date;
  morning: {
    foodName: string;
    students: string[] | IUser[];
  };
  evening: {
    foodName: string;
    students: string[] | IUser[];
  };
  night: {
    foodName: string;
    students: string[] | IUser[];
  };
}

export interface IMonthlyRoutine extends Document {
  month: number;
  year: number;
  routine: IDailyMeal[];
  createdBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  createdBy: string | IUser;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBillItem {
  billType: 'gas' | 'electricity' | 'water' | 'wifi' | 'other';
  billName: string;
  totalAmount: number;
  description?: string;
  billDate: Date;
}

export interface IPaidBy {
  user: string | IUser;
  amount: number;
  paidAt: Date;
  isPaid: boolean;
}

export interface IUtilityBill extends Document {
  month: number;
  year: number;
  bills: IBillItem[];
  totalActiveUsers: number;
  perPersonAmount: number;
  createdBy: string | IUser;
  paidBy: IPaidBy[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
