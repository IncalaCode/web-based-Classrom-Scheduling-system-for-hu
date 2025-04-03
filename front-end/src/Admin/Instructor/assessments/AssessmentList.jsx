import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  NumberField,
  ReferenceField,
  EditButton,
  DeleteButton,
  useGetList,
  useNotify,
  useRefresh,
  TopToolbar,
  CreateButton,
  ExportButton,
  Button,
  Pagination
} from 'react-admin';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';

// Custom actions for the list
const ListActions = ({ basePath }) => (
  <TopToolbar>
    <CreateButton basePath={basePath} />
    <ExportButton />
  </TopToolbar>
);

// Custom card view for assessments
const AssessmentCard = ({ record }) => {
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'quiz': return 'info';
      case 'exam': return 'error';
      case 'assignment': return 'success';
      case 'project': return 'warning';
      default: return 'default';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderLeft: record.is_published ? '4px solid #4caf50' : '4px solid #f44336'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip 
            label={record.type} 
            color={getTypeColor(record.type)} 
            size="small" 
          />
          <Chip 
            label={record.is_published ? 'Published' : 'Draft'} 
            color={record.is_published ? 'success' : 'default'} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {record.title}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {record.description?.substring(0, 100) || 'No description'}
          {record.description?.length > 100 ? '...' : ''}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={2}>
          {/* <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Course
            </Typography>
            <Typography variant="body2">
              {record.Course?.name || record.Course?.course_code || 'Unknown'}
            </Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Max Score
            </Typography>
            <Typography variant="body2">
              {record.max_score}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Weight
            </Typography>
            <Typography variant="body2">
              {record.weight}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography 
              variant="caption" 
              color={isOverdue(record.due_date) ? 'error' : 'textSecondary'}
            >
              Due Date
            </Typography>
            <Typography 
              variant="body2"
              color={isOverdue(record.due_date) ? 'error' : 'inherit'}
            >
              {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'No due date'}
              {isOverdue(record.due_date) && ' (Overdue)'}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <EditButton record={record} />
          <DeleteButton record={record} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Grid view for assessments
const GridView = ({ ids, data, basePath }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {ids.map(id => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <AssessmentCard record={data[id]} />
        </Grid>
      ))}
    </Grid>
  );
};

// Main Assessment List component
const AssessmentList = (props) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const notify = useNotify();
  const refresh = useRefresh();
  
  // Custom data fetching to get assessments for the logged-in teacher
  const { data, total, isLoading, error } = useGetList(
    'Assessment',
    {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'due_date', order: 'ASC' },
      filter: {}
    }
  );
  
  if (error) {
    notify('Error loading assessments', 'error');
  }

  return (
    <List 
      {...props} 
      actions={<ListActions />}
      bulkActionButtons={false}
      pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
      title="Assessments"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1">
            <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Assessments
          </Typography>
        </Box>
        <Box>
          <Button
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
            startIcon={<ViewListIcon />}
          >
            List
          </Button>
          <Button
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
            startIcon={<ViewModuleIcon />}
          >
            Grid
          </Button>
        </Box>
      </Box>
      
      {viewMode === 'list' ? (
        <Datagrid>
          <TextField source="title" />
          {/* <ReferenceField 
            source="course_id" 
            reference="Course" 
            link={false}
          >
            <TextField source="name" />
          </ReferenceField> */}
          <TextField source="type" />
          <NumberField source="max_score" />
          <NumberField source="weight" label="Weight (%)" />
          <DateField source="due_date" showTime />
          <BooleanField source="is_published" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      ) : (
        <GridView ids={data ? Object.keys(data) : []} data={data} basePath={props.basePath} />
      )}
    </List>
  );
};

export default AssessmentList;
