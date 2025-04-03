import React from 'react';
import { Title, useGetIdentity } from 'react-admin';
import { Box, Card, CardContent, Typography, Grid, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Assignment, MenuBook, Group, Schedule, Assessment } from '@mui/icons-material';

export const TeacherDashboard = () => {
    const { identity } = useGetIdentity();
    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Teacher-specific statistics
    const stats = [
        { icon: <Group fontSize="large" color="primary" />, title: 'My Students', count: 127, link: '#/students' },
        { icon: <MenuBook fontSize="large" color="secondary" />, title: 'My Classes', count: 5, link: '#/courses' },
        { icon: <Assignment fontSize="large" style={{ color: '#4caf50' }} />, title: 'Assignments', count: 14, link: '#/assignments' },
        { icon: <Assessment fontSize="large" style={{ color: '#f44336' }} />, title: 'Exams', count: 3, link: '#/exams' },
    ];

    // Mock schedule data
    const todaysSchedule = [
        { time: '08:00 - 08:45', class: 'Physics', room: 'Lab 3', grade: 'Grade 10 B' },
        { time: '09:00 - 09:45', class: 'Physics', room: 'Lab 3', grade: 'Grade 11 A' },
        { time: '10:00 - 10:45', class: 'Math', room: 'Room 15', grade: 'Grade 10 A' },
        { time: '11:15 - 12:00', class: 'Math', room: 'Room 15', grade: 'Grade 11 B' },
    ];

    // Pending tasks
    const pendingTasks = [
        { task: 'Grade Physics mid-term exams', deadline: 'Tomorrow' },
        { task: 'Prepare lab materials for Grade 10', deadline: 'Today' },
        { task: 'Submit monthly progress report', deadline: 'Friday' },
        { task: 'Parent-teacher meeting preparation', deadline: 'Next Monday' },
    ];

    return (
        <Box p={3}>
            <Title title="Teacher Dashboard" />
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Welcome, {identity?.fullName}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{currentDate}</Typography>
            </Box>
            
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Teaching Overview</Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {stats.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' },
                                        height: '100%'
                                    }}
                                    component="a"
                                    href={stat.link}
                                >
                                    {stat.icon}
                                    <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                                        {stat.count}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {stat.title}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Schedule color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Today's Schedule</Typography>
                            </Box>
                            <List>
                                {todaysSchedule.map((schedule, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between">
                                                        <Typography variant="body1">{schedule.class}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {schedule.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={`${schedule.grade} • ${schedule.room}`}
                                            />
                                        </ListItem>
                                        {index < todaysSchedule.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Assignment color="secondary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Pending Tasks</Typography>
                            </Box>
                            <List>
                                {pendingTasks.map((task, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between">
                                                        <Typography variant="body1">{task.task}</Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            color={task.deadline === 'Today' ? 'error' : 'textSecondary'}
                                                        >
                                                            Due: {task.deadline}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < pendingTasks.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeacherDashboard;