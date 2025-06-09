import React from 'react';
import { CheckCircle, Loader, Truck, Package, XCircle } from 'lucide-react'; // Icons for steps

interface OrderStep {
  name: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending' | 'failed';
  timestamp?: string; // e.g., "10:30 AM, July 20"
}

interface OrderProgressIndicatorProps {
  steps: OrderStep[];
  currentStepName: string; // Name of the current step
}

const OrderProgressIndicator: React.FC<OrderProgressIndicatorProps> = ({ steps, currentStepName }) => {
  console.log("Rendering OrderProgressIndicator, current step:", currentStepName);

  const currentStepIndex = steps.findIndex(step => step.name === currentStepName);

  // Determine status for each step based on currentStepName
  const processedSteps = steps.map((step, index) => {
    let status: OrderStep['status'] = 'pending';
    if (index < currentStepIndex) {
      status = 'completed';
    } else if (index === currentStepIndex) {
      status = step.status === 'failed' ? 'failed' : 'current'; // Preserve failed status if it's the current one
    }
    return { ...step, status };
  });


  return (
    <div className="w-full p-4">
      <div className="flex items-start justify-between">
        {processedSteps.map((step, index) => {
          const IconComponent = step.icon;
          let iconColor = "text-gray-400";
          let textColor = "text-gray-500";
          let barColor = "bg-gray-300";

          if (step.status === 'completed') {
            iconColor = "text-green-500";
            textColor = "text-green-700 font-medium";
            barColor = "bg-green-500";
          } else if (step.status === 'current') {
            iconColor = "text-orange-500";
            textColor = "text-orange-700 font-semibold";
            barColor = "bg-orange-500"; // Bar leading to current is also orange
          } else if (step.status === 'failed') {
            iconColor = "text-red-500";
            textColor = "text-red-700 font-semibold";
            barColor = "bg-red-500";
          }

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center text-center w-1/4 md:w-1/5">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step.status === 'current' ? 'border-orange-500 bg-orange-100' : step.status === 'completed' ? 'border-green-500 bg-green-100' : step.status === 'failed' ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-gray-100'}`}>
                  <IconComponent className={`h-5 w-5 ${iconColor}`} />
                </div>
                <p className={`mt-2 text-xs sm:text-sm ${textColor}`}>{step.name}</p>
                {step.timestamp && <p className="text-xs text-gray-400">{step.timestamp}</p>}
              </div>
              {index < processedSteps.length - 1 && (
                <div className={`flex-1 h-1 mt-5 ${index < currentStepIndex ? barColor : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Example Usage Reminder:
        const orderSteps = [
          { name: "Confirmed", icon: CheckCircle, status: 'pending' },
          { name: "Preparing", icon: Package, status: 'pending' },
          { name: "Out for Delivery", icon: Truck, status: 'pending' },
          { name: "Delivered", icon: CheckCircle, status: 'pending' },
        ];
        <OrderProgressIndicator steps={orderSteps} currentStepName="Preparing" />
      */}
    </div>
  );
};

export default OrderProgressIndicator;