import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, profile, register } from "../services/auth.api.js";
import toast from "react-hot-toast";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ userName, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ userName, email, password });
      setUser(data.createdUser);
      toast.success(data.message);
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await profile();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
