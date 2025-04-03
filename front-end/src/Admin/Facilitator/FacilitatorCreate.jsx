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
  minLength
} from "react-admin";

const relationChoices = [
  { id: 'father', name: 'Father' },
  { id: 'mother', name: 'Mother' },
  { id: 'guardian', name: 'Guardian' },
  { id: 'other', name: 'Other' }
];

const ParentCreate = () => {
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
        <TextInput 
          source="address" 
          label="Address" 
          fullWidth 
          validate={[required()]} 
        />
        <TextInput 
          source="phone" 
          type="tel" 
          label="Phone Number" 
          fullWidth 
          validate={[required()]} 
        />
        <SelectInput 
          source="relation" 
          label="Relation" 
          choices={relationChoices} 
          fullWidth 
          validate={[required()]} 
        />
        <TextInput 
          source="occupation" 
          label="Occupation" 
          fullWidth 
        />
        <ReferenceArrayInput 
          source="studentIds" 
          reference="students" 
          label="Children"
          filter={{ isActive: true }}
        >
          <SelectArrayInput 
            optionText={(record) => 
              record ? `${record.firstName} ${record.lastName} (Grade: ${record.grade})` : ''
            }
            filter={{ isActive: true }}
            filterToQuery={searchText => ({
              q: searchText,
              _sort: 'firstName',
              _order: 'ASC',
            })}
            fullWidth
            label="Select Students"
            helperText="Search by student name"
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};

export default ParentCreate;