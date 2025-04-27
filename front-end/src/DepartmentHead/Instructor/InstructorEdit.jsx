import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  email,
  Toolbar,
  SaveButton,
  DeleteButton
} from 'react-admin';

const validateFirstName = [required()];
const validateLastName = [required()];
const validateEmail = [required(), email()];

const InstructorEditToolbar = props => (
  <Toolbar {...props}>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
);

const InstructorEdit = (props) => {
  return (
    <Edit {...props}
      mutationMode="pessimistic"
    >
      <SimpleForm toolbar={<InstructorEditToolbar />}>
        <TextInput source="firstName" validate={validateFirstName} fullWidth />
        <TextInput source="lastName" validate={validateLastName} fullWidth />
        <TextInput source="email" validate={validateEmail} fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default InstructorEdit;