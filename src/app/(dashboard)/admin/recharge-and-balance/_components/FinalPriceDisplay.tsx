import React from 'react';

interface FinalPriceDisplayProps {
  net_amount: number;
}

export const FinalPriceDisplay = ({ net_amount }: FinalPriceDisplayProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
      <div className="text-center">
        <p className="text-sm text-gray-600">Final Price (incl. tax)</p>
        <p className="text-2xl font-bold text-gray-800">₹{net_amount?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};
