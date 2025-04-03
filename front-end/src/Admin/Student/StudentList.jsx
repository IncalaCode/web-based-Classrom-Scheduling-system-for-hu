import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton, 
} from "react-admin";

const StudentList = () => (
  <List 
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid
    >
      <TextField source="firstName" label="First Name" />
      <TextField source="lastName" label="Last Name" />
      <TextField source="student_id" label="student Id" />
      <TextField source="email" label="Email" />
      <TextField source="enrollmentDate" label="Enrollment Date" />
      <TextField source="grade" label="Grade" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default StudentList;