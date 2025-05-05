import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const ProtectedPage = ({ children }) => {
  const captoken = localStorage.getItem("captoken");
  const navigate = useNavigate();
  const { setcaptain} = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If no token, redirect to login
    if (!captoken) {
      navigate("/captain-login");
      return;
    }

    // Fetch user profile if token exists
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
        headers: {
          Authorization: `Bearer ${captoken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setcaptain(response.data.captain);
        } else {
          localStorage.removeItem("captoken");
          navigate("/captain-login");
        }
      })
      .catch((err) => {
        console.log("Error fetching captain:", err);
        localStorage.removeItem("captoken");
        navigate("/captain-login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, setcaptain, setLoading]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
  
};

export default ProtectedPage;
