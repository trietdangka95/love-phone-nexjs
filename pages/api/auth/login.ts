import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Mock authentication - replace with database query
    if (email === 'admin@example.com' && password === 'password') {
      const user = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
      };

      res.status(200).json({
        success: true,
        user,
        message: 'Đăng nhập thành công',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 