import React from "react";
import { 
  List, 
  Datagrid, 
  TextField, 
  EditButton, 
  DeleteButton,
  ReferenceField,
  BooleanField,
  ChipField
} from "react-admin";

const ClassroomList = () => (
  <List 
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="building" label="Building" />
      <TextField source="floor" label="Floor" />
      <TextField source="roomName" label="Room Name" />
      <ChipField source="type" label="Type" />
      <TextField source="capacity" label="Capacity" />
      <BooleanField source="isAvailableForAllocation" label="Available" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ClassroomList;
