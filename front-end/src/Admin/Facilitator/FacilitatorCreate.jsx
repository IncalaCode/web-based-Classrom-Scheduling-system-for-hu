import React from "react";
import { 
  Create, 
  SimpleForm, 
  TextInput, 
  PasswordInput,
  required,
  email,
  minLength,
} from "react-admin";
import { useParams } from 'react-router-dom';
import InputVildcation from "../../components/inputvildcation";

const validatePassword = [required(), minLength(6, 'Password must be at least 6 characters')];

const validateFacilitatorName = (value) => {
  if (!value) {
    return 'Facilitator name is required';
  }
  if (!/^[A-Z][a-zA-Z\s]*$/.test(value)) {
    return 'Facilitator name must start with a capital letter and contain only letters and spaces';
  }
  return undefined;
};

const FacilitatorCreate = () => {
  return (
    <Create redirect="/facilitators">
      <SimpleForm >
        <TextInput 
          source="firstName" 
          label="First Name" 
          fullWidth 
          validate={[required()]} 
           parse={value => InputVildcation(value, "letter")}
        />
        <TextInput 
          source="lastName" 
          label="Last Name" 
          fullWidth 
          validate={[required()]} 
           parse={value => InputVildcation(value, "letter")}
        />
        <TextInput 
          source="FacilitatorName" 
          label="Facilitator Name" 
          fullWidth 
          validate={validateFacilitatorName}
          helperText="Must start with a capital letter and contain only letters and spaces"
        />
        <TextInput 
          source="email" 
          label="Email" 
          fullWidth 
          validate={[required(), email()]} 
        />
        <PasswordInput
          source="password"
          label="Password"
          fullWidth
          validate={validatePassword}
        />
      </SimpleForm>
    </Create>
  );
};

export default FacilitatorCreate;