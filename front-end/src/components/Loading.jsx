import React from 'react';

/**
 * Loading component displayed during authentication checks and data loading
 */
export const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          marginBottom: '16px',
          color: '#3f51b5'
        }}>
          Loading...
        </div>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3f51b5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};