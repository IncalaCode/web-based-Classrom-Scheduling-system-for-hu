import { Title, useGetIdentity, useDataProvider } from 'react-admin';
import { Box, Card, CardContent, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { School, People, MenuBook, FamilyRestroom } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
export const AdminDashboard = () => {
    const { identity } = useGetIdentity();
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            students: 0,
            teachers: 0,
            courses: 0,
            assignments: 0,
            announcements: 0,
            parents: 0
        }
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dataProvider.getDashboard('Admindashboard');
                setDashboardData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [dataProvider]);

    const stats = [
        { 
            name: 'students', 
            value: dashboardData.stats.students, 
            icon: <School color="primary" />, 
            color: '#2196f3', 
            link: 'students'
        },
        { 
            name: 'Department Heads', 
            value: dashboardData.stats.teachers, 
            icon: <People color="secondary" />, 
            color: '#f50057', 
            link: 'departmentHeads'
        },
        { 
            name: 'Lab Assistants', 
            value: dashboardData.stats.parents, 
            icon: <PersonIcon style={{ color: '#9c27b0' }} />, 
            color: '#9c27b0', 
            link: 'labAssistants'
        },
        { 
            name: 'facilitators', 
            value: dashboardData.stats.courses, 
            icon: <MenuBook style={{ color: '#ff9800' }} />, 
            color: '#ff9800', 
            link: 'facilitators'
        },
    ];
    
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Title title="Admin Dashboard" />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Welcome, {identity?.fullName}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{currentDate}</Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>users Overview</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {stats.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Paper
                                    elevation={3    }
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
                                    href={`#/${stat.link}`}
                                >
                                    {stat.icon}
                                    <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {stat.name}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>School Statistics Overview</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3f51b5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Distribution Overview</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
