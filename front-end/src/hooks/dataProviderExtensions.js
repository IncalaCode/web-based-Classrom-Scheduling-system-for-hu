import { fetchUtils } from 'react-admin';
import dataProvider from './dataProvider';
import { API_ENDPOINT_FUNCTION, GET_HEADER } from "../config/config";

/**
 * Extended data provider with specialized functionality for different resources
 * Keeps the main dataProvider clean while adding custom API endpoints
 */
const extendedDataProvider = {
  // Assessment specific methods
  Assessmentgetone: async (resource, params) => {
    if (resource === 'Assessment') {
      const url = API_ENDPOINT_FUNCTION(`/Assessment/${params.id}`);
      const options = await GET_HEADER();
      
      try {
        const { json } = await fetchUtils.fetchJson(url, options);
        
        return {
          data: {
            ...json.data,
            id: params.id 
          }
        };
      } catch (error) {
        console.error('Error fetching assessment details:', error);
        throw error;
      }
    }

    return dataProvider.getOne(resource, params);
  },
  
  Assessmentcreate: async (resource, params) => {
    if (resource === 'Assessment') {
      const url = API_ENDPOINT_FUNCTION(`/Assessment/courses`);
      const options = await GET_HEADER({
        method: 'POST',
        body: JSON.stringify(params.data)
      });
      
      if (!options.headers) {
        options.headers = new Headers();
      }
      options.headers.set('Content-Type', 'application/json');
      
      try {
        const { json } = await fetchUtils.fetchJson(url, options);
        
        return {
          data: { ...params.data, id: json.data.id },
        };
      } catch (error) {
        console.error('Error creating assessment:', error);
        throw error;
      }
    }
    
    return dataProvider.create(resource, params);
  },

  Assessmentupdate: async (resource, params) => {
    if (resource === 'Assessment') {
      const url = API_ENDPOINT_FUNCTION(`/Assessment/${params.id}`);
      const options = await GET_HEADER({
        method: 'PUT',
        body: JSON.stringify(params.data)
      });
      
      if (!options.headers) {
        options.headers = new Headers();
      }
      options.headers.set('Content-Type', 'application/json');
      
      try {
        const { json } = await fetchUtils.fetchJson(url, options);
        
        return {
          data: { 
            ...params.data, 
            id: params.id
          },
        };
      } catch (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }
    }
    
    return dataProvider.update(resource, params);
  },
  
  // Attendance specific methods
  getAttendanceRecords: async (courseId, date) => {
    const url = `${API_ENDPOINT_FUNCTION('/attendance/records')}?courseId=${courseId}&date=${date}`;
    const options = await GET_HEADER();
    
    try {
      const { json } = await fetchUtils.fetchJson(url, options);
      return {
        data: json.data || [],
      };
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },
  
  // Method to get all students for a specific course
  getCourseStudents: async (courseId) => {
    const url = `${API_ENDPOINT_FUNCTION('/courses')}/${courseId}/students`;
    const options = await GET_HEADER();
    
    try {
      const { json } = await fetchUtils.fetchJson(url, options);
      return {
        data: json.data || [],
      };
    } catch (error) {
      console.error('Error fetching course students:', error);
      throw error;
    }
  },
  
  // Method to get attendance statistics
  getAttendanceStats: async (courseId, startDate, endDate) => {
    const url = `${API_ENDPOINT_FUNCTION('/attendance/stats')}?courseId=${courseId}&startDate=${startDate}&endDate=${endDate}`;
    const options = await GET_HEADER();
    
    try {
      const { json } = await fetchUtils.fetchJson(url, options);
      return {
        data: json.data || {},
      };
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      throw error;
    }
  }
};

export default extendedDataProvider;
