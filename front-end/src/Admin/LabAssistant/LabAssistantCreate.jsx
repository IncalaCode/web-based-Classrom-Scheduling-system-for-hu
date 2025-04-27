import React from "react";
import { 
  Create, 
  SimpleForm, 
  TextInput, 
  SelectInput, 
  ReferenceArrayInput, 
  SelectArrayInput,
  required,
  email,
} from "react-admin";

const LabAssistantCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="firstName" 
          label="First Name" 
          fullWidth 
          validate={[required()]} 
        />
        <TextInput 
          source="lastName" 
          label="Last Name" 
          fullWidth 
          validate={[required()]} 
        />
        <TextInput 
          source="email" 
          label="Email" 
          fullWidth 
          validate={[required(), email()]} 
        />

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

export default LabAssistantCreate;