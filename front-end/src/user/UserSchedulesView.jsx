import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import dataProvider from '../hooks/dataProvider';
import { formatTime } from '../utils/dateUtils';

const UserSchedulesView = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);

  const getCurrentDay = () => {
    const today = new Date();
    return today.getDay() === 0 ? 7 : today.getDay();
  };

  // Get user role from localStorage
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

  useEffect(() => {
    // Set current day on component mount
    setCurrentDay(getCurrentDay());
    fetchSchedules();
    
    // Update current day every minute
    const intervalId = setInterval(() => {
      setCurrentDay(getCurrentDay());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    
    const userRole = getUserRole();
    if (!userRole) {
      setError('User role not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await dataProvider.getUserSchedules(userRole);
      if (response.success) {
        setSchedules(response.data);
      } else {
        setError('Failed to fetch schedules');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Schedule
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : schedules.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow 
                  key={schedule.id}
                  sx={{ 
                    backgroundColor: currentDay === schedule.dayOfWeek ? 'rgba(144, 202, 249, 0.2)' : 'inherit'
                  }}
                >
                  <TableCell>{schedule.dayOfWeek}</TableCell>
                  <TableCell>
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </TableCell>
                  <TableCell>
                    {schedule.course ? `${schedule.course.code} - ${schedule.course.title}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {schedule.classroom 
                      ? `${schedule.classroom.building}, Floor ${schedule.classroom.floor}, Room ${schedule.classroom.roomName}` 
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No schedules found.</Typography>
      )}
    </Box>
  );
};

export default UserSchedulesView;