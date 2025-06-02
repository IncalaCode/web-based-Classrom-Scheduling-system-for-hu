import React from "react";
import {   
  Edit,
  SimpleForm, 
  TextInput,
  required,
  email,
} from "react-admin";
import { useParams } from 'react-router-dom';
import InputVildcation from "../../components/inputvildcation";

const validateFacilitatorName = (value) => {
  if (!value) {
    return 'Facilitator name is required';
  }
  if (!/^[A-Z][a-zA-Z\s]*$/.test(value)) {
    return 'Facilitator name must start with a capital letter and contain only letters and spaces';
  }
  return undefined;
};

const FacilitatorEdit = () => {
  const { id } = useParams();

  return (
    <Edit id={id} resource="facilitators">
      <SimpleForm>
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
      </SimpleForm>
    </Edit>
  );
};

export default FacilitatorEdit;