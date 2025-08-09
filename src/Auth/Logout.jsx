// components/Auth/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("currentUser");
    navigate("/Login");
  }, [navigate]);

  return null; // ما نحتاج نعرض شيء
};

export default Logout;
