import React, { useEffect, useState } from "react";
import { Admin } from "react-admin";
import { useLocation } from "react-router-dom";
import dataProvider from "./hooks/dataProvider";
import authProvider from "./hooks/authProvider";
import { CustomLayout } from "./layout/CustomLayout";
import LoginPage from "./Auth/LoginPage";
import { getResources } from "./layout/resources";
import { Loading } from "./components/Loading";

const App = () => {
  const [role, setRole] = useState(null);
  const [key, setKey] = useState(Date.now());
  
  const getUserRole = () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) return null;
      
      const parsedAuth = JSON.parse(auth);
      return parsedAuth.user?.role || null;
    } catch (error) {
      console.error("Error parsing auth from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authProvider.checkAuth();
        const userRole = getUserRole();
        setRole(userRole);
      } catch (error) {
        console.error("Auth check failed:", error);
        setRole(null);
      }
    };
    
    checkAuth();
    
    const handleStorageChange = () => {
      const userRole = getUserRole();
      setRole(userRole);
      // Force refresh when auth changes
      setKey(Date.now());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const RefreshOnNavigate = () => {
    const location = useLocation();
    
    useEffect(() => {
      setKey(Date.now());
    }, [location.pathname]);
    
    return null;
  };
  
  return (
    <Admin
      key={key}
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={CustomLayout}
      loginPage={LoginPage}
      defaultTheme={false}
      requireAuth
      loading={Loading}
      disableTelemetry
    >
      {() => {
        const currentRole = role || getUserRole();
        
        if (!currentRole) {
          return null;
        }
        
        return (
          <>
            <RefreshOnNavigate />
            {getResources(currentRole)}
          </>
        );
      }}
    </Admin>
  );
};

export default App;
