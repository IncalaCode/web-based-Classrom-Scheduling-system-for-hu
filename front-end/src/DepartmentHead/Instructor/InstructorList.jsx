import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ReferenceField,
  EditButton,
  DeleteButton,
} from 'react-admin';


const InstructorList = (props) => {
  return (
    <List 
      {...props} 
      sort={{ field: 'lastName', order: 'ASC' }}
    >
      <Datagrid>
        <TextField source="firstName" />
        <TextField source="lastName" />
        <EmailField source="email" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default InstructorList;