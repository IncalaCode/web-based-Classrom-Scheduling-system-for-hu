import React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  useDataProvider,
} from "react-admin";
import { Card, CardContent, Typography, Box } from '@mui/material';

const validatePasswordMatch = (value, allValues) => {
  if (value !== allValues.newPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

const validatePassword = (value) => {
  if (!value) return 'Required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return undefined;
};

const CustomToolbar = props => (
  <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'center' }}>
    <SaveButton label="Update Password" />
  </Toolbar>
);

export const UpdatePasswordEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const handleSubmit = async (values) => {
    try {
      await dataProvider.updatePassword({ data: values });
      notify('Password updated successfully', { type: 'success' });
      redirect('/');
    } catch (error) {
      notify(error.message || 'Error updating password', { type: 'error' });
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Update Password
          </Typography>
          
          <SimpleForm 
            onSubmit={handleSubmit}
            toolbar={<CustomToolbar />}
            sx={{
              '& .RaSimpleForm-form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
            }}
          >
            <TextInput
              source="oldPassword"
              label="Current Password"
              type="password"
              fullWidth
              validate={[required()]}
              sx={{ mb: 2 }}
            />
            <TextInput
              source="newPassword"
              label="New Password"
              type="password"
              fullWidth
              validate={[required(), validatePassword]}
              helperText="Password must be at least 8 characters"
              sx={{ mb: 2 }}
            />
            <TextInput
              source="confirmPassword"
              label="Confirm New Password"
              type="password"
              fullWidth
              validate={[required(), validatePasswordMatch]}
              sx={{ mb: 2 }}
            />
          </SimpleForm>
        </CardContent>
      </Card>
    </Box>
  );
};