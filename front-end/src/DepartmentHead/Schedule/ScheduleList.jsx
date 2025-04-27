import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  FunctionField,
  TopToolbar,
  CreateButton,
  ExportButton,
  useListContext,
} from 'react-admin';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

// Custom actions component with print button
const ListActions = () => {
  // Get the current records from the list context at the component level
  const { data } = useListContext();
  
  // Function to print the current page content
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print the schedule');
      return;
    }
    
    // Generate the HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: black;
              padding: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th {
              border: 1px solid #000;
              padding: 8px;
              background-color: #f2f2f2;
              color: black;
              text-align: left;
            }
            td {
              border: 1px solid #000;
              padding: 8px;
              color: black;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              text-align: center;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <h2>Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Course</th>
                <th>Classroom</th>
                <th>Time</th>
                <th>Room Number</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((record, index) => `
                <tr>
                  <td>${record.dayOfWeek || 'N/A'}</td>
                  <td>${record.course?.title || record.course?.Course_name || 'N/A'}</td>
                  <td>${record.classroom?.roomName || 'N/A'}</td>
                  <td>${record.startTime || ''} - ${record.endTime || ''}</td>
                  <td>${record.roomNumber || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            Printed on: ${new Date().toLocaleString()}
          </div>
          <script>
            // Automatically print when the page loads
            window.onload = function() {
              window.print();
              // Close the window after printing (optional)
              // setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <TopToolbar>
      <CreateButton />
      <ExportButton />
      <Button 
        onClick={handlePrint}
        startIcon={<PrintIcon />}
        color="primary"
      >
        Print
      </Button>
    </TopToolbar>
  );
};

const ScheduleList = (props) => {
  return (
    <List 
      {...props} 
      sort={{ field: 'dayOfWeek', order: 'ASC' }}
      perPage={25}
      actions={<ListActions />}
    >
      <Datagrid>
        <TextField source="dayOfWeek" />
        <FunctionField
          label="Course"
          render={record => record.course?.title || record.course?.Course_name || 'N/A'}
        />
        <FunctionField
          label="Classroom"
          render={record => record.classroom?.roomName || 'N/A'}
        />
        <FunctionField
          label="Time"
          render={record => `${record.startTime} - ${record.endTime}`}
        />
        <TextField source="roomNumber" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default ScheduleList;