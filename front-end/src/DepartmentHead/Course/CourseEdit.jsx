import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue
} from 'react-admin';

const validateCourseCode = [required(), minLength(2), maxLength(10)];
const validateTitle = [required(), minLength(3), maxLength(100)];
const validateSemester = [required(), minValue(1), maxValue(12)];
const validateECTS = [required(), minValue(1)];
const validateCreditHours = [required(), minValue(1), maxValue(6)];
const validateLectureHours = [required(), minValue(0)];
const validateLabHours = [required(), minValue(0)];

const CourseEdit = (props) => {
  return (
    <Edit 
      {...props}
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <TextInput source="code" validate={validateCourseCode} />
        <TextInput source="title" validate={validateTitle} />
        <NumberInput source="semester" validate={validateSemester} />
        <NumberInput source="ects" label="ECTS" validate={validateECTS} />
        <NumberInput source="crHours" label="Credit Hours" validate={validateCreditHours} />
        <NumberInput source="lecHours" label="Lecture Hours" validate={validateLectureHours} />
        <NumberInput source="labHours" label="Lab Hours" validate={validateLabHours} />
        <SelectInput 
          source="program" 
          choices={[
            { id: 'Regular', name: 'Regular' },
            { id: 'Extension', name: 'Extension' },
            { id: 'Summer', name: 'Summer' }
          ]}
        />
        <SelectInput 
          source="academicDegree" 
          choices={[
            { id: 'Bachelor', name: 'Bachelor' },
            { id: 'Master', name: 'Master' },
            { id: 'PhD', name: 'PhD' }
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};

export default CourseEdit;
