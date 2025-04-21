import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clearCart } from '../../features/cart/cartSlice';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../app/store/configureStore';
import "../../app/styles/paymentStatus.css"

interface StatusResponse {
  status: 'COMPLETED' | 'FAILED' | 'ERROR' | 'PENDING' | 'REFUNDED';
  message?: string;
}

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string>("Verifying...");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const status = searchParams.get("status")?.toUpperCase();
      const orderId = searchParams.get("oid");
      const amount = searchParams.get("amt");
      const transactionId = searchParams.get("refId");

      if (orderId && amount && transactionId) {
        try {
          const response: StatusResponse = await agent.Payments.verify(orderId, amount, transactionId);
          if (response?.status === 'COMPLETED') {
            setPaymentStatus('COMPLETED');
            toast.success(response.message || 'Payment successful!');
            dispatch(clearCart());
            // setTimeout(() => navigate('/checkout/success'), 3000);
          } else {
            setError(response?.message || 'Payment verification failed.');
            setPaymentStatus('FAILED');
            toast.error(response?.message || 'Payment verification failed.');
            // setTimeout(() => navigate('/checkout/failed'), 3000);
          }
        } catch (err: any) {
          setError(err.response?.data?.message || err.message || 'Error verifying payment.');
          setPaymentStatus('FAILED');
          toast.error(err.response?.data?.message || err.message || 'Error verifying payment.');
          // setTimeout(() => navigate('/checkout/failed'), 3000);
        }
      } else if (status === 'FAILED' && orderId) {
        setError('Payment was unsuccessful.');
        setPaymentStatus('FAILED');
        toast.error('Payment was unsuccessful.');
        // setTimeout(() => navigate('/checkout/failed'), 3000);
      } else {
        setError('Invalid payment verification parameters.');
        setPaymentStatus('FAILED');
        toast.error('Invalid payment verification parameters.');
        // setTimeout(() => navigate('/checkout/failed'), 3000);
      }
    };

    processPayment();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="payment-verify-container">
      <div className="payment-verify-card">
        <h1 className="payment-verify-title">Payment Verification</h1>
        <div className="payment-verify-status">
          {paymentStatus === 'Verifying...' && (
            <div className="verifying-status">
              <div className="spinner"></div>
              <p>Verifying your payment...</p>
            </div>
          )}
          {paymentStatus === 'COMPLETED' && (
            <div className="success-status">
              <svg className="success-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              <p className="success-message">Payment successful!</p>
            </div>
          )}
          {paymentStatus === 'FAILED' && (
            <div className="failed-status">
              <svg className="failed-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12S6.47 22 12 22 22 17.53 22 12 17.53 2 12 2M15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" />
              </svg>
              <p className="failed-message">Payment failed</p>
            </div>
          )}
          {error && <p className="error-details">{error}</p>}
        </div>
      </div>
    </div>
  );
}