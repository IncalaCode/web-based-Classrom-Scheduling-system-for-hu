import React, { useEffect, useState } from 'react';
import { Layout, useGetIdentity } from 'react-admin';
import { CircularProgress } from '@mui/material';
import { CustomAppBar } from './CustomAppBar';
import { useLocation } from 'react-router-dom';

export const CustomLayout = (props) => {
    const { isLoading } = useGetIdentity();
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    
    // Update currentPath when location changes
    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location.pathname]);
    
    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Layout 
            {...props} 
            appBar={CustomAppBar}
            className="flex flex-col h-screen"
            // Force re-render of menu when path changes by using key
            key={`layout-${currentPath}`}
        />
    );
};
