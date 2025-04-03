import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import dataProvider from '../../hooks/dataProvider';

const AssessmentForm = ({ isEdit = false, record = null }) => {
  const { courseId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit && !record);
  const [error, setError] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  
  // Use the ID from either the record prop or the URL params
  const currentAssessmentId = record?.id || assessmentId;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'assignment',
    max_score: 100,
    weight: 10,
    due_date: dayjs().add(7, 'day'), // Default to 1 week from now
    is_published: false
  });

  useEffect(() => {
    // If we have a record from props, use that data
    if (record) {
      setFormData({
        id: record.id, // Make sure to include the ID
        title: record.title || '',
        description: record.description || '',
        type: record.type || 'assignment',
        max_score: record.max_score || 100,
        weight: record.weight || 10,
        due_date: record.due_date ? dayjs(record.due_date) : null,
        is_published: record.is_published || false
      });
      

      return; 
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If editing, fetch assessment details
        if (isEdit && currentAssessmentId) {
          const assessmentResponse = await dataProvider.Assessmentgetone('Assessment', { id: currentAssessmentId });
          if (assessmentResponse && assessmentResponse.data) {
            const assessment = assessmentResponse.data;
            setFormData({
              id: assessment.id, // Make sure to include the ID
              title: assessment.title || '',
              description: assessment.description || '',
              type: assessment.type || 'assignment',
              max_score: assessment.max_score || 100,
              weight: assessment.weight || 10,
              due_date: assessment.due_date ? dayjs(assessment.due_date) : null,
              is_published: assessment.is_published || false
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, currentAssessmentId, isEdit, record]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      due_date: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        max_score: Number(formData.max_score),
        weight: Number(formData.weight),
        // Convert dayjs object to ISO string for API
        due_date: formData.due_date ? formData.due_date.toISOString() : null
      };
      
      if (isEdit) {
        // Make sure we're passing the ID for update
        console.log('Updating assessment with ID:', currentAssessmentId);
        await dataProvider.Assessmentupdate('Assessment', {
          id: currentAssessmentId,
          data: payload
        });
      } else {
        // Create new assessment - backend will associate with teacher's course
        await dataProvider.Assessmentcreate('Assessment', {
          data: payload
        });
      }
      
      // Navigate back to assessment list
      navigate('/Assessment');
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError(err.message || 'An error occurred while saving the assessment');
      setLoading(false);
    }
  };

  if (loading && isEdit && !record) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Assessment' : 'Create Assessment'}
        {courseDetails && ` for ${courseDetails.Course_name || courseDetails.Course_code}`}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Assessment Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Assessment Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Assessment Type"
                >
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="max_score"
                label="Maximum Score"
                type="number"
                value={formData.max_score}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="weight"
                label="Weight (%)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                helperText="Percentage weight in the final grade calculation"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Publish Assessment (visible to students)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/Assessments')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AssessmentForm;
