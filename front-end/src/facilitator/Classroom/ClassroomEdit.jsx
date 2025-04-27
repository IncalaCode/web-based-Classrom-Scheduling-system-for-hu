import React from "react";
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  NumberInput, 
  BooleanInput,
  SelectInput,
  ReferenceInput,
  required,
  useRecordContext
} from "react-admin";
import { Grid, Typography } from "@mui/material";

// Create a component for the form content to access record context properly
const ClassroomEditForm = () => {
  const record = useRecordContext();
  let initialStartRoom = 100;
  let initialEndRoom = 101;
  
  if (record && record.ClassRoomIntrval) {
    try {
      const interval = typeof record.ClassRoomIntrval === 'string' 
        ? JSON.parse(record.ClassRoomIntrval) 
        : record.ClassRoomIntrval;
      
      if (Array.isArray(interval) && interval.length === 2) {
        initialStartRoom = interval[0];
        initialEndRoom = interval[1];
      }
    } catch (e) {
      console.error("Error parsing ClassRoomIntrval:", e);
    }
  }

  return (
    <>
      <TextInput 
        source="building" 
        label="Building" 
        validate={required()} 
        fullWidth
      />
      <NumberInput 
        source="floor" 
        label="Floor" 
        min={0}
        validate={required()} 
        fullWidth
      />
      <TextInput 
        source="roomName" 
        label="Room Name" 
        validate={required()} 
        fullWidth
      />
      <Typography variant="subtitle1" gutterBottom>
        Room Interval
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <NumberInput 
            source="startRoom" 
            label="Start Room" 
            defaultValue={initialStartRoom}
            validate={required()}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <NumberInput 
            source="endRoom" 
            label="End Room" 
            defaultValue={initialEndRoom}
            validate={[
              required(),
              (value, values) => {
                const start = parseInt(values.startRoom);
                const end = parseInt(value);
                if (end <= start) {
                  return 'End room must be greater than start room';
                }
                return undefined;
              }
            ]}
            fullWidth
          />
        </Grid>
      </Grid>
      <SelectInput 
        source="type" 
        label="Room Type" 
        choices={[
          { id: 'classroom', name: 'Classroom' },
          { id: 'lab', name: 'Laboratory' }
        ]} 
        validate={required()} 
        fullWidth
      />
      <NumberInput 
        source="capacity" 
        label="Capacity" 
        min={1}
        validate={required()} 
        fullWidth
      />
      <ReferenceInput 
        source="departmentId" 
        reference="department"
        fullWidth
      >
        <SelectInput 
          optionText="name" 
          label="Department" 
          validate={required()} 
        />
      </ReferenceInput>
      <BooleanInput 
        source="isAvailableForAllocation" 
        label="Available for Allocation" 
      />
    </>
  );
};

const ClassroomEdit = (props) => {
  const transform = (data) => {
    const { startRoom, endRoom, ...rest } = data;
    return {
      ...rest,
      classRoomInterval: [parseInt(startRoom), parseInt(endRoom)]
    };
  };

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <ClassroomEditForm />
      </SimpleForm>
    </Edit>
  );
};

export default ClassroomEdit;