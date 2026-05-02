// src/modules/auth/auth.service.ts
import User from '../user/user.model';
import generateToken from '../../utils/generateToken';

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isManager: user.isManager,
        isActive: user.isActive,
        token: generateToken(user._id, user.email, user.role),
      };
    }

    throw new Error('Invalid email or password');
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!(await user.matchPassword(currentPassword))) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}
