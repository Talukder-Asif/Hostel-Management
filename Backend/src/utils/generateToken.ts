// src/utils/generateToken.ts
import jwt from 'jsonwebtoken';

const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '30d' },
  );
};

export default generateToken;
