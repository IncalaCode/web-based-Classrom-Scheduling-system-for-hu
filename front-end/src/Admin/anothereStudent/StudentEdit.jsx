import React from "react";
import { Edit, SimpleForm, TextInput, required ,ReferenceArrayInput,SelectArrayInput, email} from "react-admin";
import InputVildcation from "../../components/inputvildcation";

const anothereStudentEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]}     parse={value => InputVildcation(value, "letter")}/>
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]}     parse={value => InputVildcation(value, "letter")}/>
        <TextInput source="email" label="Email" fullWidth validate={[required() , email()]} />
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

export default anothereStudentEdit;
