import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton, 
} from "react-admin";

const LabAssistantList = () => (
  <List 
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid
    >
        <TextField source="firstName" label="First Name"  />
        <TextField source="lastName" label="Last Name"  />
        <TextField source="email" label="Email"  />
        <TextField source="address" label="address"  />
        {/* <TextField source="departmentId" type="tel" label="Department Name"  /> */}
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default LabAssistantList;