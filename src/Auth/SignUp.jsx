import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // جلب المستخدمين المخزنين (إذا وجد)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // التحقق من وجود بريد إلكتروني مستخدم مسبقًا
    const userExists = users.find(user => user.email === formData.email);
    if (userExists) {
      alert("This email is already registered.");
      return;
    }

    // حفظ المستخدم الجديد
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // تسجيل الدخول تلقائيًا
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Account created and logged in successfully!");
    navigate("/"); // تحويل للمسار الرئيسي بعد التسجيل
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
