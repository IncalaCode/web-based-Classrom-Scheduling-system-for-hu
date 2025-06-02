
// src/components/DepartmentFileCreate.tsx
import React from "react";
import { Create, SimpleForm, TextInput, ReferenceArrayInput, required, SelectArrayInput ,minLength ,maxLength, email} from "react-admin";
import InputVildcation from "../../components/inputvildcation";

const anotherStudentCreate = () => {

  return (
    <Create>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]}    parse={value => InputVildcation(value, "letter")} />
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]}    parse={value => InputVildcation(value, "letter")} />
        <TextInput source="email" label="Email" fullWidth validate={[required() , email()]} />
        <TextInput source="semester" type="number" label="semester" fullWidth validate={[required() ,maxLength(2) ,minLength(1)]} />
        <TextInput source="year" type="number" label="year" fullWidth validate={[required(),maxLength(6) ,minLength(1)]} />
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
    </Create>
  );
};

export default anotherStudentCreate;
