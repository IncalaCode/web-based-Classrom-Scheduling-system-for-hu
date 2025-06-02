
import React from "react";
import { Resource } from "react-admin";

// Import Material-UI icons
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


// Dashboard components
import AdminDashboard from "../Admin/AdminDashboard";
import DepartmentHeadDashboard from "../DepartmentHead/DepartmentHeadDashboard";

// importing the update password
import {UpdatePasswordEdit } from "../components/UpdatePassword"
// importing the DepartmentHead
import DepartmentHeadList from "../Admin/DepartmentHead/DepartmentHeadList";
import departmentHeadCreate from "../Admin/DepartmentHead/DepartmentHeadCreate";
import departmentHeadEdit from "../Admin/DepartmentHead/DepartmentHeadEdit";
// importing the Student
import StudentCreate from "../Admin/Student/StudentCreate";
import StudentList from "../Admin/Student/StudentList";
import StudentEdit from "../Admin/Student/StudentEdit";
// importing the LabAssistant
import LabAssistantList from "../Admin/LabAssistant/LabAssistantList";
import LabAssistantCreate from "../Admin/LabAssistant/LabAssistantCreate";
import LabAssistantEdit from "../Admin/LabAssistant/LabAssistantEdit";
// importing the facilitatorEdit
import facilitatorEdit from "../Admin/Facilitator/FacilitatorEdit";
import facilitatorList from "../Admin/Facilitator/InstructorList";
import FacilitatorCreate from "../Admin/Facilitator/FacilitatorCreate";
import InstructorList from "../DepartmentHead/Instructor/InstructorList";
import InstructorCreate from "../DepartmentHead/Instructor/InstructorCreate";
import InstructorEdit from "../DepartmentHead/Instructor/InstructorEdit";
import CourseList from "../DepartmentHead/Course/CourseList";
import CourseCreate from "../DepartmentHead/Course/CourseCreate";
import CourseEdit from "../DepartmentHead/Course/CourseEdit";
import ClassroomList from "../facilitator/Classroom/ClassroomList";
import ClassroomCreate from "../facilitator/Classroom/ClassroomCreate";
import ScheduleList from "../DepartmentHead/Schedule/ScheduleList";
import ScheduleCreate from "../DepartmentHead/Schedule/ScheduleCreate";
import ScheduleEdit from "../DepartmentHead/Schedule/ScheduleEdit";
import ClassroomEdit from "../facilitator/Classroom/ClassroomEdit";
import DepartmentHeadFeedbackList from "../DepartmentHead/Feedback/FeedbackList";
import UserSchedulesView from "../user/UserSchedulesView";
import FeedbackManagement from "../user/Feedback/FeedbackManagement";

import anotherStudentList from "../Admin/anothereStudent/StudentList"
import anothereStudentEdit from "../Admin/anothereStudent/StudentEdit"
import anotherStudentCreate from "../Admin/anothereStudent/StudentCreate"
// const DASHBOARDS = {
//   admin: AdminDashboard,
//   // departmentHead: DepartmentHeadDashboard,
//   instructor: DepartmentHeadDashboard,
//   labAssistant: DepartmentHeadDashboard,
//   student: DepartmentHeadDashboard,
//   // facilitator: DepartmentHeadDashboard,
// };

const RESOURCES = {
  admin: [
    {key : "dashboard", name: "dashboard", options: { label: "Dashboard" }, icon: PeopleIcon, list: AdminDashboard },
    { key: "facilitators", name: "facilitators", options: { label: "Facilitators" }, icon: PersonIcon, list: facilitatorList, edit: facilitatorEdit, create: FacilitatorCreate },
    { key: "departmentHeads", name: "departmentHeads", options: { label: "Department Heads" }, icon: PeopleIcon, list: DepartmentHeadList, create: departmentHeadCreate, edit: departmentHeadEdit },
    { key: "students", name: "students", options: { label: "Students" }, icon: SchoolIcon, list: StudentList, create: StudentCreate, edit: StudentEdit },
    { key: "anothere", name: "anothere", options: { label: "anothere" }, icon: SchoolIcon, list: anotherStudentList, create: anotherStudentCreate, edit: anothereStudentEdit },
    { key: "labAssistants", name: "labAssistants", options: { label: "Lab Assistants" }, icon: HowToRegIcon, list: LabAssistantList, create: LabAssistantCreate, edit: LabAssistantEdit },
    { key: "Settings", name: "Settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
  departmentHead: [
    { key: "instructors", name: "instructors", options: { label: "Instructors" }, icon: PeopleIcon , list :  InstructorList , create : InstructorCreate, edit : InstructorEdit},
    { key: "courses", name: "courses", options: { label: "Courses" }, icon: MenuBookIcon , list : CourseList , create : CourseCreate , edit : CourseEdit},
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: CalendarMonthIcon , list :ScheduleList , create : ScheduleCreate , edit : ScheduleEdit},
    { key: "feedbacks", name: "feedbacks", options: { label: "Feed back" }, icon: FeedbackIcon , list :DepartmentHeadFeedbackList },
    { key: "settings", name: "settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
  instructor: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: CalendarMonthIcon  , list : UserSchedulesView},
    { key: "feedbacks", name: "feedbacks", options: { label: "Feed back" }, icon: FeedbackIcon ,list : FeedbackManagement },
    { key: "settings", name: "settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
  labAssistant: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: CalendarMonthIcon , list : UserSchedulesView },
    { key: "feedbacks", name: "feedbacks", options: { label: "Feed back" }, icon: FeedbackIcon  ,list : FeedbackManagement},
    { key: "settings", name: "settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
  student: [
    { key: "schedule", name: "schedule", options: { label: "schedule" }, icon: CalendarMonthIcon , list : UserSchedulesView },
    { key: "feedbacks", name: "feedbacks", options: { label: "Feed back" }, icon: FeedbackIcon  ,list : FeedbackManagement},
    { key: "settings", name: "settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
  facilitator: [
    { key: "Allocation", name: "Allocation", options: { label: "Allocation" }, icon: FeedbackIcon  , list : ClassroomList , create: ClassroomCreate , edit : ClassroomEdit},
    { key: "settings", name: "settings", options: { label: "Settings" }, list: UpdatePasswordEdit, icon: SettingsIcon },
  ],
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
