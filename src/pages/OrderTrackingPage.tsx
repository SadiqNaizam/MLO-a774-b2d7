import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import OrderProgressIndicator from '@/components/OrderProgressIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, ThumbsUp, HelpCircle, FileText, ShoppingBag } from 'lucide-react'; // ThumbsUp for Delivered

interface OrderStep {
  name: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending' | 'failed';
  timestamp?: string;
}

const initialOrderSteps: OrderStep[] = [
  { name: "Confirmed", icon: CheckCircle, status: 'pending', timestamp: '' },
  { name: "Preparing", icon: Package, status: 'pending', timestamp: '' },
  { name: "Out for Delivery", icon: Truck, status: 'pending', timestamp: '' },
  { name: "Delivered", icon: ThumbsUp, status: 'pending', timestamp: '' },
];

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const passedOrderDetails = location.state?.orderDetails; // Details from checkout
  const passedOrderSummary = location.state?.orderSummary; // Summary from checkout

  const [currentStepName, setCurrentStepName] = useState("Confirmed");
  const [steps, setSteps] = useState<OrderStep[]>(initialOrderSteps);
  const [orderDetails, setOrderDetails] = useState<any>(passedOrderDetails || {
      orderId: orderId,
      items: [{id: 'sample1', name: 'Sample Item 1', quantity: 1, price: 10}],
      address: '123 Default St', city: 'N/A', zip: '00000', country: 'N/A'
  });
  const [orderSummary, setOrderSummary] = useState<any>(passedOrderSummary || {
      subtotal: 10, deliveryFee: 2, taxes: 0.8, grandTotal: 12.80
  });

  useEffect(() => {
    console.log('OrderTrackingPage loaded for order ID:', orderId);
    // Simulate order progress
    const updateTimestamps = (updatedSteps: OrderStep[], stepName: string) => {
        return updatedSteps.map(step => 
            step.name === stepName ? { ...step, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : step
        );
    };

    setSteps(prevSteps => updateTimestamps(prevSteps, "Confirmed"));

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => {
        setCurrentStepName("Preparing");
        setSteps(prevSteps => updateTimestamps(prevSteps, "Preparing"));
    }, 5000)); // 5 seconds to Preparing
    timers.push(setTimeout(() => {
        setCurrentStepName("Out for Delivery");
        setSteps(prevSteps => updateTimestamps(prevSteps, "Out for Delivery"));
    }, 10000)); // 10 seconds to Out for Delivery
    // timers.push(setTimeout(() => { setCurrentStepName("Delivered"); setSteps(prevSteps => updateTimestamps(prevSteps, "Delivered")) }, 15000)); // 15 seconds to Delivered

    return () => timers.forEach(clearTimeout); // Cleanup timers
  }, [orderId]);
  
  const cartItemCount = orderDetails?.items?.reduce((sum: number, item: { quantity: number; }) => sum + item.quantity, 0) || 0;

  if (!orderDetails || !orderSummary) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavigationMenu cartItemCount={0} />
            <main className="flex-grow container mx-auto px-4 py-8 text-center">
                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">Loading order details or order not found...</p>
                <Link to="/"><Button size="lg">Back to Home</Button></Link>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cartItemCount} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-gray-800">Order Tracking</CardTitle>
            <CardDescription>Your order <span className="font-semibold text-orange-600">#{orderDetails.orderId}</span> is on its way!</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Current Status: {currentStepName}</h3>
              <OrderProgressIndicator steps={steps} currentStepName={currentStepName} />
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  {orderDetails.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <hr className="my-2"/>
                <div className="space-y-1 text-sm">
                    <p className="flex justify-between"><span>Subtotal:</span> <span>${orderSummary.subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between"><span>Delivery Fee:</span> <span>${orderSummary.deliveryFee.toFixed(2)}</span></p>
                    <p className="flex justify-between"><span>Taxes:</span> <span>${orderSummary.taxes.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold text-base"><span>Grand Total:</span> <span>${orderSummary.grandTotal.toFixed(2)}</span></p>
                </div>
                <hr className="my-2"/>
                <div className="mt-3 text-sm">
                    <p className="font-semibold">Delivery Address:</p>
                    <p className="text-gray-600">{orderDetails.address}, {orderDetails.city}, {orderDetails.zip}, {orderDetails.country}</p>
                </div>
              </CardContent>
            </Card>
            
            {currentStepName === "Delivered" && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
                    <ThumbsUp className="h-12 w-12 text-green-500 mx-auto mb-2"/>
                    <p className="text-xl font-semibold text-green-700">Your order has been delivered!</p>
                    <p className="text-sm text-gray-600">Enjoy your meal!</p>
                </div>
            )}

          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> View Receipt</Button>
            <Button><HelpCircle className="mr-2 h-4 w-4" /> Contact Support</Button>
          </CardFooter>
        </Card>
        <div className="text-center mt-8">
            <Link to="/">
                <Button variant="link">Back to Homepage</Button>
            </Link>
        </div>
      </main>
       <footer className="py-6 text-center text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderTrackingPage;