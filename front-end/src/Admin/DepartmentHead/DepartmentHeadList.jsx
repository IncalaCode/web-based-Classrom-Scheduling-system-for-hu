import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton,
  ReferenceField
} from "react-admin";

const DepartmentHeadList = () => (
  <List 
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
        <TextField source="firstName" label="First Name" />
        <TextField source="lastName" label="Last Name" />
        <TextField source="email" label="Email" />
        {/* <ReferenceField
          source="departmentId"
          reference="departments"
          label="Department"
        >
          <TextField source="name" />
        </ReferenceField> */}
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default DepartmentHeadList;
