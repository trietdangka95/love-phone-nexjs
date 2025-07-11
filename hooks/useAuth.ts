import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { loginStart, loginSuccess, loginFailure, logout } from '../lib/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(loginSuccess(data.user));
        return { success: true, message: data.message };
      } else {
        dispatch(loginFailure());
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch(loginFailure());
      return { success: false, message: 'Có lỗi xảy ra khi đăng nhập' };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout: logoutUser,
  };
} 