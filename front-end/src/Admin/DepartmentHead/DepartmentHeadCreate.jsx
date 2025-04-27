import React from "react";
import { 
    Create, 
    SimpleForm, 
    TextInput, 
    PasswordInput, 
    SelectInput,
    required, 
    email, 
    regex, 
    minLength,
    useGetList
} from "react-admin";

// Validation functions
const validateDepartmentName = (value) => {
    if (!value) return 'Department name is required';
    if (!/^[A-Z][a-zA-Z\s]*$/.test(value)) {
        return 'Department name must start with a capital letter and contain only letters and spaces';
    }
    return undefined;
};

const validateEmail = [
    required(),
    email('Invalid email format')
];

const validatePassword = [
    required(),
    minLength(8, 'Password must be at least 8 characters'),
    regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
];

const DepartmentHeadCreate = () => {
    // Fetch facilitators data
    const { data: facilitators, isLoading } = useGetList('facilitators', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'firstName', order: 'ASC' }
    });

    // Transform facilitators data for select input
    const facilitatorChoices = facilitators
        ? facilitators.map(facilitator => ({
            id: facilitator.id,
            name: ` ${facilitator.FacilitatorName} by ${facilitator.firstName} ${facilitator.lastName}`
        }))
        : [];

    return (
        <Create redirect="/departmentHeads">
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
                    validate={validateEmail}
                />
                <TextInput 
                    source="departmentName" 
                    label="Department Name" 
                    helperText="Must start with a capital letter (e.g., Computer Science)" 
                    fullWidth 
                    validate={validateDepartmentName}
                />
                <SelectInput
                    source="facilitatorId"
                    label="Facilitator"
                    choices={facilitatorChoices}
                    optionText="name"
                    optionValue="id"
                    fullWidth
                    validate={[required('Please select a facilitator')]}
                    isLoading={isLoading}
                />
            </SimpleForm>
        </Create>
    );
};

export default DepartmentHeadCreate;