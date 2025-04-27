import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  ReferenceInput,
  SelectInput
} from 'react-admin';

const validateCourseCode = [required(), minLength(2), maxLength(10)];
const validateTitle = [required(), minLength(3), maxLength(100)];
const validateSemester = [required()];
const validateECTS = [required(), minValue(1)];
const validateCreditHours = [required(), minValue(1), maxValue(6)];
const validateLectureHours = [required(), minValue(0)];
const validateLabHours = [required(), minValue(0)];
const validateProgram = [required()];
const validateAcademicDegree = [required()];

const CourseCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="code" label="Course Code" validate={validateCourseCode} />
        <TextInput source="title" label="Title" validate={validateTitle} />
        <TextInput source="semester" label="Semester" validate={validateSemester} />
        <NumberInput source="ects" label="ECTS" validate={validateECTS} />
        <NumberInput source="crHours" label="Credit Hours" validate={validateCreditHours} />
        <NumberInput source="lecHours" label="Lecture Hours" validate={validateLectureHours} />
        <NumberInput source="labHours" label="Lab Hours" validate={validateLabHours} />
        <TextInput source="program" label="Program" validate={validateProgram} />
        <SelectInput 
          source="academicDegree" 
          label="Academic Degree" 
          validate={validateAcademicDegree}
          choices={[
            { id: 'Bachelor', name: 'Bachelor' },
            { id: 'Master', name: 'Master' },
            { id: 'PhD', name: 'PhD' }
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export default CourseCreate;