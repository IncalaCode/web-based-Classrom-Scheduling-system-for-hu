import { useEffect, useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  SelectInput,
  useNotify,
  useRefresh,
  useRedirect,
  TopToolbar,
  required,
  ReferenceField,
  ReferenceInput,
  useRecordContext,
  useDataProvider,
} from 'react-admin';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  ToggleButton, 
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * Redesigned Attendance Management Component
 * 
 * Features:
 * - Weekday selector at the top (Monday to Friday)
 * - Attendance list filtered by selected day
 * - Mark attendance functionality based on selected day
 * - Weekly date updates
 */

// Custom actions for the attendance list - removed CreateButton and ExportButton
const ListActions = () => (
  <TopToolbar>
    {/* No buttons here as requested */}
  </TopToolbar>
);

// Custom status field with icons
const StatusField = props => {
  const record = useRecordContext(props);
  if (!record) return null;
  
  return (
    <Box display="flex" alignItems="center">
      {record.status === 'present' ? (
        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
      ) : record.status === 'absent' ? (
        <CancelIcon color="error" sx={{ mr: 1 }} />
      ) : (
        <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
      )}
      <Typography>{record.status}</Typography>
    </Box>
  );
};

// Helper function to get the date for a specific weekday in the current week
const getDateForWeekday = (weekday) => {
  const today = new Date();
  
  // Get the current week's Monday
  const currentWeekMonday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
  currentWeekMonday.setDate(today.getDate() + diff);
  
  // Calculate the target day based on the selected weekday
  const weekdayOffset = {
    'monday': 0,
    'tuesday': 1,
    'wednesday': 2,
    'thursday': 3,
    'friday': 4
  };
  
  const targetDate = new Date(currentWeekMonday);
  targetDate.setDate(currentWeekMonday.getDate() + weekdayOffset[weekday.toLowerCase()]);
  
  return targetDate;
};

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Main Attendance Component with Weekday Selector
const AttendanceList = props => {
  const [selectedWeekday, setSelectedWeekday] = useState('monday');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(formatDate(getDateForWeekday('monday')));
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  // Update the target date when the selected weekday changes
  useEffect(() => {
    const newDate = getDateForWeekday(selectedWeekday);
    setTargetDate(formatDate(newDate));
  }, [selectedWeekday]);

  const handleWeekdayChange = (event, newWeekday) => {
    if (newWeekday !== null) {
      setSelectedWeekday(newWeekday);
    }
  };

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      // This should match your backend API endpoint for marking attendance
      await dataProvider.create('mark-attendance', { 
        data: { 
          date: targetDate
        } 
      });
      notify(`Attendance for ${selectedWeekday} (${targetDate}) marked successfully`, 'success');
      refresh();
    } catch (error) {
      notify(`Error: ${error.message || 'Could not mark attendance'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get the display name for the weekday (capitalize first letter)
  const getWeekdayDisplayName = (weekday) => {
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  return (
    <>
      {/* Weekday Selector and Mark Attendance Button */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>Attendance Management</Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>Select Day:</Typography>
            <ToggleButtonGroup
              value={selectedWeekday}
              exclusive
              onChange={handleWeekdayChange}
              aria-label="weekday selection"
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="monday" aria-label="monday">
                Monday
              </ToggleButton>
              <ToggleButton value="tuesday" aria-label="tuesday">
                Tuesday
              </ToggleButton>
              <ToggleButton value="wednesday" aria-label="wednesday">
                Wednesday
              </ToggleButton>
              <ToggleButton value="thursday" aria-label="thursday">
                Thursday
              </ToggleButton>
              <ToggleButton value="friday" aria-label="friday">
                Friday
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Date: {targetDate}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMarkAttendance}
              disabled={loading}
              fullWidth
              sx={{ height: '40px' }}
            >
              {loading ? <CircularProgress size={24} /> : `Mark ${getWeekdayDisplayName(selectedWeekday)} Attendance`}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance List filtered by selected date */}
      <List 
        {...props} 
        actions={<ListActions />}
        sort={{ field: 'date', order: 'DESC' }}
        filter={{ date: targetDate }}
        title={`${getWeekdayDisplayName(selectedWeekday)} Attendance (${targetDate})`}
      >
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <ReferenceField source="studentId" reference="students">
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="courseId" reference="courses">
            <TextField source="name" />
          </ReferenceField>
          <DateField source="date" />
          <StatusField source="status" />
          <TextField source="remarks" />
        </Datagrid>
      </List>
    </>
  );
};

// Attendance Edit Component
const AttendanceEdit = props => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('Attendance updated successfully');
    redirect('list', 'attendance');
    refresh();
  };

  return (
    <Edit {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <ReferenceInput source="studentId" reference="students">
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="courseId" reference="courses">
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>
        <DateInput source="date" validate={required()} />
        <SelectInput 
          source="status" 
          choices={[
            { id: 'present', name: 'Present' },
            { id: 'absent', name: 'Absent' },
            { id: 'late', name: 'Late' },
          ]} 
          validate={required()} 
        />
        <TextInput source="remarks" multiline fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export { AttendanceList, AttendanceEdit };