import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';

interface RouteParams {
  orderId: string;
  grandTotal: string;
}

const PaymentInitiationPage: React.FC = () => {
  const { orderId, grandTotal } = useParams() as unknown as RouteParams;
  const [paymentForm, setPaymentForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initiatePayment = async () => {
      if (orderId && grandTotal) {
        try {
          const form = await agent.Payments.initiate(parseInt(orderId), parseFloat(grandTotal));
          setPaymentForm(form);
        } catch (apiError: any) {
          if (apiError?.response?.status === 409 && apiError?.response?.data === "A payment is already being processed for this order.") {
            toast.warn("A payment is already being processed for this order. Please wait or check your order status.");
            // Option to redirect the user to an order status page after a delay
            setTimeout(() => {
              navigate(`/orders/${orderId}`); // Replace with your actual order status route
            }, 3000);
          } else {
            toast.error("Failed to initiate payment. Please try again.");
            console.error("Payment initiation error:", apiError);
          }
          setError(apiError.message || "Failed to load payment form.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid order or amount.");
        setLoading(false);
        toast.error("Invalid order or amount.");
      }
    };

    initiatePayment();
  }, [orderId, grandTotal, navigate]);

  useEffect(() => {
    if (paymentForm && !loading) {
      const form = document.createElement("form");
      form.id = `esewaForm-${orderId}`;
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = paymentForm;
      const inputs = tempDiv.querySelectorAll("input");
      inputs.forEach((input) => {
        const newInput = document.createElement("input");
        newInput.type = input.type;
        newInput.name = input.name;
        newInput.value = input.value;
        form.appendChild(newInput);
      });

      console.log("Payment form created:", form.outerHTML);
      document.body.appendChild(form);
      console.log("Payment form appended, submitting...");
      form.submit();
    }
  }, [paymentForm, loading, orderId]);

  if (loading) {
    return <div>Loading payment gateway...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* The form will be dynamically added here and submitted */}
      <p>Redirecting to payment gateway...</p>
    </div>
  );
};

export default PaymentInitiationPage;