import React, { useState, useEffect } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ChipField,
  FunctionField,
  useGetIdentity,
  useGetOne,
  TopToolbar,
  ExportButton,
  useRecordContext,
  Button,
} from 'react-admin';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import dataProvider from '../../hooks/dataProvider';

// Custom actions component
const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

// View button that opens the feedback details dialog
const ViewButton = ({ record }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        label="View"
        onClick={handleOpen}
        color="primary"
      >
        <VisibilityIcon />
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="feedback-dialog-title"
      >
        <DialogTitle id="feedback-dialog-title">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{record.title}</Typography>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleClose} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <FeedbackContent record={record} />
        </DialogContent>
        <DialogActions>
          <Button label="Close" onClick={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};

// Feedback content panel
const FeedbackContent = ({ record }) => {
  if (!record) return null;

  // Course Info Component using useGetOne hook
  const CourseInfo = ({ courseId }) => {
    if (!courseId) return null;
    
    const { data: course, isLoading } = useGetOne(
      'courses',
      { id: courseId },
      { enabled: !!courseId }
    );
    
    if (isLoading || !course) return <Chip size="small" label="Loading course..." />;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <MenuBookIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="body2">
          Course: <strong>{course.code || course.Course_name || course.title}</strong>
        </Typography>
      </Box>
    );
  };
  
  // Schedule Info Component using dataProvider directly
  const ScheduleInfo = ({ scheduleId }) => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      const fetchSchedule = async () => {
        if (!scheduleId) return;
        
        setLoading(true);
        try {
          const response = await dataProvider.getOne('schedule', { id: scheduleId });
          setSchedule(response.data);
        } catch (error) {
          console.error('Error fetching schedule:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSchedule();
    }, [scheduleId]);
    
    if (!scheduleId) return null;
    if (loading) return <Chip size="small" label="Loading schedule..." />;
    if (!schedule) return <Chip size="small" label="Schedule not found" />;
    
    // Convert numeric day to day name
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = schedule.dayOfWeek > 0 && schedule.dayOfWeek <= 7 
      ? days[schedule.dayOfWeek - 1] 
      : schedule.dayOfWeek;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <EventIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="body2">
          Schedule: <strong>{dayName}, {schedule.startTime} - {schedule.endTime}</strong>
        </Typography>
      </Box>
    );
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        borderRadius: 1 
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip 
          label={record.priority} 
          size="small" 
          color={
            record.priority === 'high' ? 'error' : 
            record.priority === 'medium' ? 'warning' : 
            'success'
          }
        />
        <Chip 
          label={record.status} 
          size="small" 
          color={
            record.status === 'pending' ? 'warning' : 
            record.status === 'in-progress' ? 'info' : 
            record.status === 'resolved' ? 'success' : 
            'error'
          }
        />
      </Box>
      
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Feedback Content:
      </Typography>
      <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-wrap' }}>
        {record.content}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="body2">
          From: <strong>{record.senderType}</strong> 
          {record.senderId && (
            <span> (ID: {record.senderId.substring(0, 8)}...)</span>
          )}
        </Typography>
      </Box>
      
      <CourseInfo courseId={record.courseId} />
      <ScheduleInfo scheduleId={record.scheduleId} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="body2">
          Submitted on: <strong>{new Date(record.createdAt).toLocaleString()}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

// Custom view button field
const ViewButtonField = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  return <ViewButton record={record} />;
};

// Custom field to display priority with color
const PriorityField = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const getColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };
  
  return (
    <Chip 
      label={record.priority} 
      size="small"
      sx={{ 
        backgroundColor: `${getColor(record.priority)}20`,
        color: getColor(record.priority),
        fontWeight: 'bold'
      }}
    />
  );
};

// Custom field to display status with color
const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const getColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#757575';
    }
  };
  
  return (
    <Chip 
      label={record.status} 
      size="small"
      sx={{ 
        backgroundColor: `${getColor(record.status)}20`,
        color: getColor(record.status),
        fontWeight: 'bold'
      }}
    />
  );
};

// Main FeedbackList component for department heads
const DepartmentHeadFeedbackList = (props) => {
  // Get the current user's identity to filter by department
  const { identity, isLoading: identityLoading } = useGetIdentity();
  
  // If identity is loading, render a loading state
  if (identityLoading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Filter to only show feedback for the department head's department
  const departmentFilter = identity?.departmentId ? 
    { departmentId: identity.departmentId } : 
    {};
  
  return (
    <List 
      {...props} 
      actions={<ListActions />}
      sort={{ field: 'createdAt', order: 'DESC' }}
      perPage={10}
      filter={departmentFilter}
      title="Department Feedback"
    >
      <Datagrid
        bulkActionButtons={false}
      >
        <TextField source="title" />
        <FunctionField
          label="From"
          render={record => record.senderType}
        />
        <FunctionField
          label="Priority"
          render={() => <PriorityField />}
        />
        <DateField source="createdAt" showTime sortByOrder="DESC" />
        <FunctionField
          label="Actions"
          render={() => <ViewButtonField />}
        />
      </Datagrid>
    </List>
  );
};

export default DepartmentHeadFeedbackList;
