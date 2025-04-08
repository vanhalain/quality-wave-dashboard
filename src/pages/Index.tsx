
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

// This is just a redirect to the main dashboard
const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // If authenticated, redirect to dashboard, otherwise to login
  return isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default Index;
