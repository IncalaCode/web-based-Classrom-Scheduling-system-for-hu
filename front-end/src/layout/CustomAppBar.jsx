import React, { useRef, useEffect } from 'react';
import { AppBar, UserMenu, useGetIdentity } from 'react-admin';
import { Typography, Box, Chip, useMediaQuery, useTheme } from '@mui/material';
import Image from "../assets/hwu_logo.png";

export const CustomAppBar = (props) => {
    const { identity, isLoading } = useGetIdentity();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const previousIdentityRef = useRef(null);

    // Log identity changes for debugging
    useEffect(() => {
        if (identity && previousIdentityRef.current) {
            const identityChanged =
                (previousIdentityRef.current?.id !== identity?.id) ||
                (previousIdentityRef.current?.role !== identity?.role);

            if (identityChanged) {
                console.log('Identity changed in AppBar:',
                    previousIdentityRef.current?.role, '->', identity?.role);
            }
        }

        previousIdentityRef.current = identity;
    }, [identity]);

    return (
        <AppBar
            {...props}
            color="primary"
            elevation={1}
            sx={{
                '& .RaAppBar-title': {
                    flex: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                },
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                sx={{ marginRight: '1rem' }}
            >
                <img
                    src={Image}
                    alt="School Logo"
                    width={40}
                    height={40}
                    style={{
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '2px'
                    }}
                />
            </Box>
            {/* School name - hidden on mobile */}
            <Typography
                variant="h6"
                color="inherit"
                sx={{
                    flex: 1,
                    display: isMobile ? 'none' : 'block'
                }}
            >
                HU Model Community School
            </Typography>

            {/* Empty flex spacer for mobile view */}
            {isMobile && <Box sx={{ flex: 1 }} />}

            {!isLoading && identity && (
                <Chip
                    label={identity.role?.toUpperCase()}
                    color="secondary"
                    size="small"
                    sx={{ marginRight: '1rem' }}
                />
            )}

            {props.children}
        </AppBar>
    );
};
