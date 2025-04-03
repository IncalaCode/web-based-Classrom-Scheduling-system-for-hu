import { fetchUtils } from 'react-admin';
import { API_ENDPOINT_FUNCTION, GET_HEADER } from "../config/config";
import extendedDataProvider from './dataProviderExtensions';


const get_path_list = {
    students: "/students",
    teachers : "/teachers",
    parents : "/parents",
    course : "/courses",
    Notfication : "/notifications",
    CourseMaterial : "/CourseMaterial",
    courseEnrollments : "/courseenrollments" ,
    Assessment : "/Assessment/teacher",
    attendance: "/Attendance",
};

const create_path = {
    students: "/students/register",
    teachers :"/teachers/register",
    parents : "/parents/register",
    course : "/courses",
    CourseMaterial : "/CourseMaterial",
    "attendance/attendance/bulk": "/attendance/bulk"
};

const get_one_path = {  
    students: "/students/profile",
    teachers : "/teachers/profile",
    parents : "/parents/profile",
    course : "/courses",
    CourseMaterial : "/CourseMaterial",
    Assessment : "/Assessment"

};


const delete_path = {
    students: "/students",
    teachers : "/teachers",
    parents : "/parents",
    course  : "/courses",
    CourseMaterial : "/CourseMaterial",
    Assessment : "/Assessment"
};

const update_path = {
    students: "/students/update",
    teachers : "/teachers/update",
    parents : "/parents/update",
    course : "/courses",
        CourseMaterial : "/CourseMaterial"
};

const get_one_dashboard_path = {
    Admindashboard : "/dashboard/admin"
}

const get_update_password = {
    default : "/auth/update-password"
}


const dataProvider = {
    getList: async (resource, params) => {
        // Special handling for attendance resources
        if (resource === 'attendance') {
            // For fetching attendance records by course and date
            const { courseId, date } = params.filter || {};
            if (courseId && date) {
                const url = `${API_ENDPOINT_FUNCTION('/attendance/records')}?courseId=${courseId}&date=${date}`;
                const options = await GET_HEADER();
                
                return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
                    data: json.data || [],
                    total: json.total || 0,
                }));
            }
        }
        
        const url = API_ENDPOINT_FUNCTION(get_path_list[resource]);
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ headers, json }) => ({
            data: json.data,
            total: parseInt(headers.get('content-range')?.split('/')?.pop(), 10) || json.length,
        }));
    },

    getOne: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(get_one_path[resource])}/${params.id}`;
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json.data,
        }));
    },

    getMany: async (resource, params) => {
        const url = API_ENDPOINT_FUNCTION(get_path_list[resource]);
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => {
            const filteredData = Array.isArray(json.data) 
                ? json.data.filter(item => params.ids.includes(item.id))
                : [];
            
            return {
                data: filteredData,
            };
        });
    },
    create: async (resource, params) => {
        const url = API_ENDPOINT_FUNCTION(create_path[resource]);
        const options = await GET_HEADER({
            method: 'POST',
            body: JSON.stringify(params.data)
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        }));
    },
    
    update: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(update_path[resource])}/${params.id}`;
        const options = await GET_HEADER({
            method: 'PUT',
            body: JSON.stringify(params.data)
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json.data,
        }));
    },
    
    delete: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(delete_path[resource])}/${params.id}`;
        const options = await GET_HEADER({
            method: 'DELETE'
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json,
        }));
    },
    getDashboard : async (resource ,params) =>{
        const url = API_ENDPOINT_FUNCTION(get_one_dashboard_path[resource]);
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json.data,
        }));
    },

    updatePassword: async (params) => {
        const { oldPassword, newPassword, confirmPassword } = params.data;
        const url = API_ENDPOINT_FUNCTION(get_update_password.default);
        const options = await GET_HEADER({
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        });
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json.data,
        }));
      },
      // Custom methods for attendance management
      getAttendanceByDate: async (courseId, date) => {
          const url = `${API_ENDPOINT_FUNCTION('/attendance/records')}?courseId=${courseId}&date=${date}`;
          const options = await GET_HEADER();
          
          return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
              data: json.data || [],
          }));
      },
      
      getTeacherCourses: async () => {
          const url = API_ENDPOINT_FUNCTION('/attendance/teacher/courses');
          const options = await GET_HEADER();
          
          return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
              data: json.data || [],
          }));
      },
      
      getStudentsForAttendance: async (courseId) => {
          const url = `${API_ENDPOINT_FUNCTION('/attendance/teacher/students')}?courseId=${courseId}`;
          const options = await GET_HEADER();
          
          return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
              data: json.data || [],
          }));
      },
      
      bulkMarkAttendance: async (data) => {
          const url = API_ENDPOINT_FUNCTION('/attendance/bulk');
          const options = await GET_HEADER({
              method: 'POST',
              body: JSON.stringify(data)
          });
          
          return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
              data: json.data || {},
          }));
      },
      
      ...extendedDataProvider
};

export default dataProvider;
