// src/components/DepartmentFileCreate.tsx
import React from "react";
import { Create, SimpleForm, TextInput, required ,SelectInput} from "react-admin";

  const gradeChoices = [
    { id: '9', name: 'Grade 9' },
    { id: '10', name: 'Grade 10' },
  ];
  

const TeacherCreate = () => {

  return (
    <Create>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]} />
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]} />
        <TextInput source="email" label="Email" fullWidth validate={[required()]} />
        <TextInput source="phone" type="tel" label="phone Number" fullWidth validate={[required()]} />
        <SelectInput 
          source="grade" 
          label="Grade" 
          choices={gradeChoices} 
          fullWidth 
          validate={[required()]} 
        />

      </SimpleForm>
    </Create>
  );
};

export default TeacherCreate;