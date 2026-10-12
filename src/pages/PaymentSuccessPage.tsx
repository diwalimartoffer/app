import React from 'react';
import { OrderSuccessPage } from './OrderSuccessPage';

interface PaymentSuccessPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ orderId, navigate }) => {
  return <OrderSuccessPage orderId={orderId} navigate={navigate} />;
};

export default PaymentSuccessPage;
