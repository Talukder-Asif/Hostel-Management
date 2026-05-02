// src/modules/user/user.service.ts
import User from './user.model';
import { IUser } from '../../types';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await User.create(userData);
    return user;
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(query: any = {}): Promise<IUser[]> {
    const users = await User.find(query).select('-password');
    return users;
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
  }

  async getActiveUsers(): Promise<IUser[]> {
    const users = await User.find({ isActive: true }).select('-password');
    return users;
  }

  async getActiveUsersCount(): Promise<number> {
    const count = await User.countDocuments({ isActive: true });
    return count;
  }
}
