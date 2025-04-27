import React, { useState } from "react";
import { 
  Create, 
  SimpleForm, 
  TextInput, 
  NumberInput, 
  BooleanInput,
  SelectInput,
  ReferenceInput,
  required
} from "react-admin";
import { Grid, Typography, Box } from "@mui/material";

const ClassroomCreate = (props) => {
  const [startRoom, setStartRoom] = useState(100);
  const [endRoom, setEndRoom] = useState(101);

  // Transform the form values before submission
  const transform = (data) => {
    return {
      ...data,
      classRoomInterval: [parseInt(data.startRoom), parseInt(data.endRoom)]
    };
  };

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput 
          source="building" 
          label="Building" 
          validate={required()} 
          fullWidth
        />
        <NumberInput 
          source="floor" 
          label="Floor" 
          defaultValue={0}
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
        <TextInput 
          source="roomDescription" 
          label="Room Description" 
          multiline
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
              defaultValue={100}
              validate={required()}
              onChange={(e) => setStartRoom(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <NumberInput 
              source="endRoom" 
              label="End Room" 
              defaultValue={101}
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
              onChange={(e) => setEndRoom(e.target.value)}
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
          defaultValue="classroom"
          fullWidth
        />
        <NumberInput 
          source="capacity" 
          label="Capacity" 
          defaultValue={30}
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
          defaultValue={true}
        />
      </SimpleForm>
    </Create>
  );
};

export default ClassroomCreate;
