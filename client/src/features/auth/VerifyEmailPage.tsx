import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as authService from '../../app/api/authService'; // Assuming you'll create a service call

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          await authService.verifyEmail(token); // Call your backend verification endpoint
          setVerificationStatus('success');
          setTimeout(() => navigate('/login'), 3000); // Redirect to login after a delay
        } catch (error: any) {
          console.error("Email verification error:", error);
          setVerificationStatus('error');
        }
      };
      verifyEmail();
    } else {
      setVerificationStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      {verificationStatus === 'pending' && <p>Verifying your email...</p>}
      {verificationStatus === 'success' && <p>Email verified successfully! Redirecting to login...</p>}
      {verificationStatus === 'error' && <p>Email verification failed. The link may be invalid or expired. Please try again or request a new verification link.</p>}
    </div>
  );
};

export default VerifyEmailPage;
