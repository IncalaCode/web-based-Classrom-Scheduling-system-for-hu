import React from "react";
import { Edit, SimpleForm, TextInput, required ,ReferenceArrayInput,SelectArrayInput} from "react-admin";

const StudentEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]} />
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]} />
        <TextInput source="email" label="Email" fullWidth validate={[required()]} />
        <TextInput source="semester" type="number" label="semester" fullWidth validate={[required()]} />
        <TextInput source="year" type="number" label="year" fullWidth validate={[required()]} />
        <ReferenceArrayInput 
          source="departmentId" 
          reference="department" 
          label="Children"
          filter={{ isActive: true }}
        >
          <SelectArrayInput 
            optionText={(record) => 
              record ? `${record.name}` : ''
            }
            filter={{ isActive: true }}
            filterToQuery={searchText => ({
              q: searchText,
              _sort: 'name',
              _order: 'ASC',
            })}
            fullWidth
            label="Select department"
            validate={required()}
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export default StudentEdit;
