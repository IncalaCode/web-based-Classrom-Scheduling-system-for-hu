
import React, { useState } from 'react';
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  required,
  TimeInput,
  useDataProvider,
  FormDataConsumer,
} from 'react-admin';

const validateRequired = [required()];

const dayOfWeekChoices = [
  { id: 'Monday', name: 'Monday' },
  { id: 'Tuesday', name: 'Tuesday' },
  { id: 'Wednesday', name: 'Wednesday' },
  { id: 'Thursday', name: 'Thursday' },
  { id: 'Friday', name: 'Friday' },
  { id: 'Saturday', name: 'Saturday' },
  { id: 'Sunday', name: 'Sunday' },
];

const ScheduleCreate = (props) => {
  const [roomChoices, setRoomChoices] = useState([]);
  const dataProvider = useDataProvider();
  const fetchRoomChoices = async (classroomId) => {
    if (!classroomId) {
      setRoomChoices([]);
      return;
    }

    try {
      const { data } = await dataProvider.getOne('Allocation', { id: classroomId });
      
      if (data && data.classRoomInterval) {
        const intervalStr = data.classRoomInterval;
        const matches = intervalStr.match(/\[(\d+),(\d+)\]/);
        
        if (matches && matches.length === 3) {
          const start = parseInt(matches[1], 10);
          const end = parseInt(matches[2], 10);
          const rooms = [];
          for (let i = start; i < end; i++) {
            rooms.push({ id: i.toString(), name: i.toString() });
          }
          
          setRoomChoices(rooms);
        }
      }
    } catch (error) {
      console.error('Error fetching classroom data:', error);
      setRoomChoices([]);
    }
  };

  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceInput source="courseId" reference="courses">
          <SelectInput optionText="title" validate={validateRequired} fullWidth />
        </ReferenceInput>
        
        <FormDataConsumer>
          {({ formData, ...rest }) => (
            <>
              <ReferenceInput 
                source="classroomId" 
                reference="AllocationByDepartment"
                {...rest}
              >
                <SelectInput 
                  optionText="roomName" 
                  fullWidth 
                  onChange={(e) => {
                    fetchRoomChoices(e.target.value);
                  }}
                  validate={required()}
                />
              </ReferenceInput>
              
              <SelectInput 
                source="roomNumber" 
                choices={roomChoices}
                fullWidth
                disabled={roomChoices.length === 0}
                helperText={roomChoices.length === 0 ? "Select a classroom first to see available room numbers" : ""}
                {...rest}
                validate={required()}
              />
            </>
          )}
        </FormDataConsumer>
        
        <SelectInput 
          source="dayOfWeek" 
          choices={dayOfWeekChoices} 
          validate={validateRequired} 
          fullWidth 
        />
        <TimeInput source="startTime" validate={validateRequired} fullWidth />
        <TimeInput source="endTime" validate={validateRequired} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default ScheduleCreate;
