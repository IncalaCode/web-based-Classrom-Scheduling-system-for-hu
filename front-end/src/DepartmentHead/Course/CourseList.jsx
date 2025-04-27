import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  DeleteButton,
  Filter,
  TextInput,
  NumberField
} from 'react-admin';


const CourseList = (props) => {
  return (
    <List 
      {...props} 
      sort={{ field: 'courseCode', order: 'ASC' }}
    >
      <Datagrid>
        <TextField source="code" label="Course Code" />
        <TextField source="title" label="Title" />
        <TextField source="semester" label="Semester" />
        <NumberField source="ects" label="ECTS" />
        <NumberField source="crHours" label="Credit Hours" />
        <NumberField source="lecHours" label="Lecture Hours" />
        <NumberField source="labHours" label="Lab Hours" />
        <TextField source="program" label="Program" />
        <TextField source="academicDegree" label="Academic Degree" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default CourseList;
