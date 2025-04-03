
import React from "react";
import { Resource } from "react-admin";

// Import Material-UI icons
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HowToRegIcon from '@mui/icons-material/HowToReg';

// DepartmentHead components
import DepartmentHead from "../Admin/DepartmentHead/DepartmentHeadCreate";

// Dashboard components
import AdminDashboard from "../Admin/AdminDashboard";
import TeacherDashboard from "../Admin/Instructor/TeacherDashboard";

// importing the update password
import {UpdatePasswordEdit } from "../Admin/UpdatePassword"


const DASHBOARDS = {
  admin: AdminDashboard,
  departmentHead: TeacherDashboard,
  instructor: TeacherDashboard,
  labAssistant: TeacherDashboard,
  // student: StudentDashboard,
  // facilitator: ParentDashboard,
};

const RESOURCES = {
  systemAdministrator: [
    { key: "students", name: "students", options: { label: "Students" },   icon :SchoolIcon},
    { key: "departmentHeads", name: "departmentHeads", options: { label: "Department Heads" } },
    { key: "labAssistants", name: "labAssistants", options: { label: "Lab Assistants" }},
    { key: "facilitators", name: "facilitators", options: { label: "Facilitators" } },
    { key: "Settings", name: "Settings", options: { label: "Settings" } ,list :  UpdatePasswordEdit, icon: SettingsIcon },
  ],
  departmentHead: [
    { key: "instructors", name: "instructors", options: { label: "Instructors" } },
    { key: "courses", name: "courses", options: { label: "Courses" }, icon: MenuBookIcon },
    { key: "schedule", name: "schedule", options: { label: "schedule" }  },
    { key: "Feedback", name: "Feedback", options: { label: "Feed back" }  },
    { key: "settings", name: "settings", options: { label: "Settings" } , list:UpdatePasswordEdit, icon: SettingsIcon },
  ],
  instructor: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: NotificationsIcon },
    { key: "Feedback", name: "Feedback", options: { label: "Feed back" } },
    { key: "settings", name: "settings", options: { label: "Settings" } , list:UpdatePasswordEdit, icon: SettingsIcon },
  ],
  labAssistant: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: NotificationsIcon },
    { key: "Feedback", name: "Feedback", options: { label: "Feed back" } },
    { key: "settings", name: "settings", options: { label: "Settings" } , list:UpdatePasswordEdit, icon: SettingsIcon },
  ],
  student: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: NotificationsIcon },
    { key: "Feedback", name: "Feedback", options: { label: "Feed back" } },
    { key: "settings", name: "settings", options: { label: "Settings" } , list:UpdatePasswordEdit, icon: SettingsIcon },
  ],
  facilitator: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: NotificationsIcon },
    { key: "Feedback", name: "Feedback", options: { label: "Feed back" } },
    { key: "settings", name: "settings", options: { label: "Settings" } , list:UpdatePasswordEdit, icon: SettingsIcon },
  ],
};

export const DashboardSelector = () => {
  const role = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth')).user.role
    : 'student';
  
  const Dashboard = DASHBOARDS[role] || DASHBOARDS.student;
  return <Dashboard />;
};

export const getResources = (role) => {
  const roleConfig = RESOURCES[role] || RESOURCES.student;

  return roleConfig.map(resource => (
    <Resource
      key={resource.key}
      name={resource.name}
      options={resource.options}
      list={resource.list}
      create={resource.create}
      edit={resource.edit}
      icon={resource.icon}
    />
  ));
};
