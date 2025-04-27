import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  email,
} from 'react-admin';

const validateFirstName = [required()];
const validateLastName = [required()];
const validateEmail = [required(), email()];


const InstructorCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="firstName" validate={validateFirstName} fullWidth />
        <TextInput source="lastName" validate={validateLastName} fullWidth />
        <TextInput source="email" validate={validateEmail} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default InstructorCreate;