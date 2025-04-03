import React from 'react';
import { Layout, useGetIdentity } from 'react-admin';
import { CircularProgress } from '@mui/material';
import { CustomAppBar } from './CustomAppBar';

export const CustomLayout = (props) => {
    const { isLoading } = useGetIdentity();
    
    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Layout 
            {...props} 
            appBar={CustomAppBar}
            className="flex flex-col h-screen"
        />
    );
};
