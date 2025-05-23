import { useState } from "react";
import authProvider from "./authProvider";
import { useNavigate } from "react-router-dom";

/**
 * Handles the login form state and submission.
 */
export const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (errors.auth) {
      setErrors((prev) => ({
        ...prev,
        auth: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const loginData = {
        email: formData.email,
        password: formData.password,
      };
      const response = await authProvider.login(loginData);

      if (response && response.message) {
        setSuccessMessage(response.message);
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error && error.message
          ? error.message
          : "Authentication failed. Please check your credentials.";
      setErrors({
        auth: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    successMessage,
    handleInputChange,
    handleSubmit,
  };
};
