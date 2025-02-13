import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  verificationCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verificationCode,
}) => (
  <div
    style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333333',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
    }}
  >
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ borderCollapse: 'collapse' }}
    >
      <tr>
        <td
          style={{
            backgroundColor: '#2c3e50',
            padding: '30px 20px',
            textAlign: 'center' as const,
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: '28px',
              margin: '0',
              textTransform: 'uppercase' as const,
              letterSpacing: '2px',
            }}
          >
            GymNavigator
          </h1>
        </td>
      </tr>
      <tr>
        <td
          style={{
            backgroundColor: '#ffffff',
            padding: '40px 30px',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              color: '#2c3e50',
              fontSize: '24px',
              margin: '0 0 20px 0',
            }}
          >
            Welcome, {firstName}!
          </h2>
          <p
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
            }}
          >
            Thank you for joining GymNavigator. We&apos;re excited to have you
            on board! Here&apos;s your verification code:
          </p>
          <div
            style={{
              backgroundColor: '#e8f0fe',
              border: '2px dashed #4a90e2',
              borderRadius: '4px',
              padding: '15px',
              margin: '30px 0',
              textAlign: 'center' as const,
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#4a90e2',
                letterSpacing: '5px',
              }}
            >
              {verificationCode}
            </span>
          </div>
          <p
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
            }}
          >
            Please use this code to verify your account and start your fitness
            journey with GymNavigator.
          </p>
          <div style={{ textAlign: 'center' as const, margin: '40px 0 20px' }}>
            <a
              href="https://GymNavigator.com/verify"
              style={{
                backgroundColor: '#27ae60',
                color: '#ffffff',
                padding: '14px 28px',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontSize: '16px',
                textTransform: 'uppercase' as const,
                letterSpacing: '1px',
                transition: 'background-color 0.3s ease',
              }}
            >
              Verify Your Account
            </a>
          </div>
          <p
            style={{
              margin: '20px 0 0 0',
              fontSize: '14px',
              color: '#666666',
            }}
          >
            If you didn&apos;t request this code, please ignore this email or
            contact our support team if you have any concerns.
          </p>
        </td>
      </tr>
      <tr>
        <td
          style={{
            padding: '20px',
            textAlign: 'center' as const,
            fontSize: '14px',
            color: '#666666',
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            © 2023 GymNavigator. All rights reserved.
          </p>
          <p style={{ margin: '0' }}>
            You&apos;re receiving this email because you signed up for
            GymNavigator.
          </p>
        </td>
      </tr>
    </table>
  </div>
);
