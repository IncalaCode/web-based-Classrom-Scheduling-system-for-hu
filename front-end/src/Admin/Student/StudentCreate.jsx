
// src/components/DepartmentFileCreate.tsx
import React from "react";
import { Create, SimpleForm, TextInput, SelectInput, required } from "react-admin";

const StudentCreate = () => {
  const gradeChoices = [
    { id: '9', name: 'Grade 9' },
    { id: '10', name: 'Grade 10' },
  ];

  return (
    <Create>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]} />
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]} />
        <TextInput source="student_id" label="Student Id" defaultValue="1746/14" fullWidth validate={[required()]} />
        <TextInput source="email" label="Email" fullWidth validate={[required()]} />
        <TextInput source="dateOfBirth" type="date" label="Date Of Birth" fullWidth validate={[required()]} />
        <TextInput source="enrollmentDate" type="date" label="Enrollment Date" fullWidth validate={[required()]} />
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

export default StudentCreate;
