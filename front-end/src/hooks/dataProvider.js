import { fetchUtils } from 'react-admin';
import { API_ENDPOINT_FUNCTION, GET_HEADER } from "../config/config";

const get_path_list = {
    departmentHeads: "/department-heads",
    facilitators : "/facilitators",
    students : "/students",
    anothere : "/students",
    labAssistants : "/labAssistants",
    department : "/department",
    instructors  : "/instructors",
    courses : "/courses",
    Allocation : "/classrooms",
    schedule : "/schedules",
    AllocationByDepartment : "/classrooms/dep",
    feedbacks : "/feedbacks",
    userSchedules: "/users/schedules",
};

const create_path = {
    departmentHeads: "/department-heads/register",
    facilitators : "/facilitators/register",
    students : "/students/register",
     anothere : "/students/register",
    labAssistants : "/labAssistants/register",
    instructors  : "/instructors/register",
    courses : "/courses",
    Allocation : "/classrooms",
    schedule : "/schedules",
    feedbacks : "/feedbacks",
};

const get_one_path = {  
    departmentHeads: "/department-heads",
    facilitators : "/facilitators",
    students : "/students",
     anothere : "/students",
    labAssistants : "/labAssistants",
    department : "/department",
    instructors  : "/instructors",
    courses : "/courses",
    Allocation : "/classrooms",
    schedule : "/schedules",
    feedbacks : "/feedbacks",
    
};

const delete_path = {
    departmentHeads: "/department-heads",
    facilitators :"/facilitators",
    students : "/students",
    anothere : "/students",
    labAssistants : "/labAssistants",
    instructors  : "/instructors",
    courses : "/courses",
    Allocation : "/classrooms",
    schedule : "/schedules",
    feedbacks : "/feedbacks",
};

const update_path = {
    departmentHeads: "/department-heads",
    facilitators : "/facilitators",
    students : "/students",
    anothere : "/students",
    labAssistants : "/labAssistants",
    instructors  : "/instructors",
    courses : "/courses",
    Allocation : "/classrooms",
    schedule : "/schedules",
    feedbacks : "/feedbacks",
};

const dashboard_path = {
    Admindashboard : "/dashboard/admin"
}

const dataProvider = {
    getList: async (resource, params) => {
        const url = API_ENDPOINT_FUNCTION(get_path_list[resource]);
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ headers, json }) => ({
            data: json.data || [],
            total: parseInt(headers.get('content-range')?.split('/')?.pop(), 10) || json.count,
        }));
    },

    getOne: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(get_one_path[resource])}/${params.id}`;
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json.data,
        }));
    },

    create: async (resource, params) => {
        const url = API_ENDPOINT_FUNCTION(create_path[resource]);
        const options = await GET_HEADER({
            method: 'POST',
            body: JSON.stringify(params.data)
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: { ...params.data, id: json?.user?.id },
        }));
    },
    
    update: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(update_path[resource])}/${params.id}`;
        const options = await GET_HEADER({
            method: 'PUT',
            body: JSON.stringify(params.data)
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: json?.data,
        }));
    },
    
    delete: async (resource, params) => {
        const url = `${API_ENDPOINT_FUNCTION(delete_path[resource])}/${params.id}`;
        const options = await GET_HEADER({
            method: 'DELETE'
        });
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => ({
            data: { id: params.id },
        }));
    },

    getMany: async (resource, params) => {
        const url = API_ENDPOINT_FUNCTION(get_path_list[resource]);
        const options = await GET_HEADER();
        
        return fetchUtils.fetchJson(url, { ...options }).then(({ json }) => {
            const filteredData = Array.isArray(json.departmentHeads) 
                ? json.departmentHeads.filter(item => params.ids.includes(item.id))
                : [];
            
            return {
                data: filteredData,
            };
        });
    
    },

    getDashboard: async (resource) => {
        const url =  API_ENDPOINT_FUNCTION(dashboard_path[resource]);
        const options = await GET_HEADER();

        return fetchUtils.fetchJson(url, options)
            .then(({ json }) => ({
                data: json.data
            }))
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                throw error;
            });
    },

    getUserSchedules: async (userType) => {
        const url = `${API_ENDPOINT_FUNCTION(get_path_list.userSchedules)}?user=${userType}`;
        const options = await GET_HEADER();

        return fetchUtils.fetchJson(url, options)
            .then(({ json }) => ({
                data: json.data || [],
                count: json.count || 0,
                success: json.success
            }))
            .catch(error => {
                console.error('Error fetching user schedules:', error);
                throw error;
            });
    },

    updatePassword: async ({ data }) => {
        const url = API_ENDPOINT_FUNCTION('/auth/update-password');
        const options = await GET_HEADER({
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return fetchUtils.fetchJson(url, options).then(({ json }) => ({
            data: json,
        }));
    },
};

export default dataProvider;
