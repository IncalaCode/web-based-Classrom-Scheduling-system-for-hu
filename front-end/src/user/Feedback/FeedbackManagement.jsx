import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { API_URL } from '../../config/config';
import dataProvider from '../../hooks/dataProvider';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    content: '',
    scheduleId: '',
    priority: 'medium'
  });
  
  const [schedules, setSchedules] = useState([]);
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getAuthToken = () => {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    
    try {
      const parsedAuth = JSON.parse(auth);
      return parsedAuth.token;
    } catch (error) {
      console.error('Error parsing auth token:', error);
      return null;
    }
  };

  const getUserInfo = () => {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    
    try {
      const parsedAuth = JSON.parse(auth);
      return parsedAuth.user;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  const getUserRole = () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) return null;
      
      const parsedAuth = JSON.parse(auth);
      return parsedAuth.user?.role || null;
    } catch (error) {
      console.error('Error parsing auth from localStorage:', error);
      return null;
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/feedbacks/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setFeedbacks(response.data.feedbacks);
        setTotalPages(Math.ceil(response.data.feedbacks.length / 10));
      } else {
        setError('Failed to fetch feedbacks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    const token = getAuthToken();
    const userRole = getUserRole();
    
    if (!token || !userRole) return;
    
    try {
      const response = await dataProvider.getUserSchedules(userRole);
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setNotification({
        open: true,
        message: 'Failed to load schedules',
        severity: 'error'
      });
    }
  };

  const createFeedback = async () => {
    const token = getAuthToken();
    if (!token) {
      setNotification({
        open: true,
        message: 'Authentication required',
        severity: 'error'
      });
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/feedbacks`, newFeedback, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotification({
        open: true,
        message: 'Feedback submitted successfully',
        severity: 'success'
      });
      
      setOpenCreateDialog(false);
      setNewFeedback({
        title: '',
        content: '',
        scheduleId: '',
        priority: 'medium'
      });
      
      fetchFeedbacks();
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to submit feedback',
        severity: 'error'
      });
      console.error('Error creating feedback:', err);
    }
  };

  const deleteFeedback = async (id) => {
    const token = getAuthToken();
    if (!token) {
      setNotification({
        open: true,
        message: 'Authentication required',
        severity: 'error'
      });
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotification({
        open: true,
        message: 'Feedback deleted successfully',
        severity: 'success'
      });
      
      fetchFeedbacks();
      
      if (viewDialogOpen) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to delete feedback',
        severity: 'error'
      });
      console.error('Error deleting feedback:', err);
    }
  };

  const viewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value
    });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  useEffect(() => {
    if (openCreateDialog) {
      fetchSchedules();
    }
  }, [openCreateDialog]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const paginatedFeedbacks = feedbacks.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Feedbacks</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          New Feedback
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : paginatedFeedbacks.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {paginatedFeedbacks.map((feedback) => (
              <Grid item xs={12} md={6} lg={4} key={feedback.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {feedback.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={feedback.priority} 
                        size="small" 
                        color={getPriorityColor(feedback.priority)} 
                      />
                      <Chip 
                        label={feedback.status} 
                        size="small" 
                        color={getStatusColor(feedback.status)} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {feedback.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton 
                      size="small" 
                      onClick={() => viewFeedback(feedback)}
                      aria-label="view feedback"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => deleteFeedback(feedback.id)}
                      aria-label="delete feedback"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, value) => setPage(value)} 
              color="primary" 
            />
          </Box>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No feedbacks found.</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ mt: 2 }}
          >
            Submit Your First Feedback
          </Button>
        </Paper>
      )}

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Feedback</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={newFeedback.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="content"
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={newFeedback.content}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={newFeedback.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Schedule (Optional)</InputLabel>
                <Select
                  name="scheduleId"
                  value={newFeedback.scheduleId}
                  onChange={handleInputChange}
                  label="Schedule (Optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {schedules.map((schedule) => (
                    <MenuItem key={schedule.id} value={schedule.id}>
                      {schedule.course?.code} - {daysOfWeek[schedule.dayOfWeek - 1]} {schedule.startTime}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={createFeedback} 
            variant="contained"
            disabled={!newFeedback.title || !newFeedback.content}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedFeedback && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedFeedback.title}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip 
                  label={selectedFeedback.priority} 
                  size="small" 
                  color={getPriorityColor(selectedFeedback.priority)} 
                />
                <Chip 
                  label={selectedFeedback.status} 
                  size="small" 
                  color={getStatusColor(selectedFeedback.status)} 
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" paragraph>
                {selectedFeedback.content}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Department:</Typography>
                  <Typography variant="body2">
                    {selectedFeedback.department?.name || 'N/A'}
                  </Typography>
                </Grid>
                {selectedFeedback.course && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Course:</Typography>
                    <Typography variant="body2">
                      {selectedFeedback.course.code} - {selectedFeedback.course.title}
                    </Typography>
                  </Grid>
                )}
                {selectedFeedback.schedule && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Schedule:</Typography>
                    <Typography variant="body2">
                      {daysOfWeek[selectedFeedback.schedule.dayOfWeek - 1]}, 
                      {selectedFeedback.schedule.startTime} - {selectedFeedback.schedule.endTime}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Submitted:</Typography>
                  <Typography variant="body2">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => deleteFeedback(selectedFeedback.id)} 
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default FeedbackManagement;