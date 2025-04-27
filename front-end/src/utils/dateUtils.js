/**
 * Format time from 24-hour format to 12-hour format
 * @param {string} time - Time in 24-hour format (HH:MM:SS)
 * @returns {string} Time in 12-hour format (hh:mm AM/PM)
 */
export const formatTime = (time) => {
  if (!time) return 'N/A';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time; 
  }
};

/**
 * Format date to a readable format
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};