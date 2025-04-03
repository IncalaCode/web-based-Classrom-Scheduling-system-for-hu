import React, { useEffect, useState } from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./hooks/dataProvider";
import authProvider from "./hooks/authProvider";
import { CustomLayout } from "./layout/CustomLayout";
import LoginPage from "./Auth/LoginPage";
import { getResources, DashboardSelector } from "./layout/resources";
import { Loading } from "./components/Loading";

const App = () => {
  const [role, setRole] = useState(null);
  
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
        console.log("User role set to:", userRole);
      } catch (error) {
        console.error("Auth check failed:", error);
        setRole(null);
      }
    };
    
    checkAuth();
    
    const handleStorageChange = () => {
      const userRole = getUserRole();
      setRole(userRole);
      console.log("Storage changed, user role updated to:", userRole);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={DashboardSelector}
      layout={CustomLayout}
      loginPage={LoginPage}
      defaultTheme={false}
      requireAuth
      loading={Loading}
      disableTelemetry
    >
      {() => {
        const currentRole = role || getUserRole();
        console.log("Rendering resources for role:", currentRole);
        
        if (!currentRole) {
          return [<Resource key="dummy" name="dummy" />];
        }
        
        const resources = getResources(currentRole);
        console.log("Resources to render:", resources.length);
        return resources;
      }}
    </Admin>
  );
};

export default App;
