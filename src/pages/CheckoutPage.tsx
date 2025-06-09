import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, MapPin, FileText, ShoppingBag } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Simplified form data state
interface FormData {
  address: string;
  city: string;
  zip: string;
  country: string;
  paymentMethod: 'card' | 'paypal' | 'cod'; // COD: Cash on Delivery
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Attempt to get cart data passed from CartPage
  const { cartItems, subtotal, deliveryFee, taxes, grandTotal, specialInstructions } = location.state || { cartItems: [], subtotal: 0, deliveryFee: 0, taxes: 0, grandTotal: 0, specialInstructions: '' };

  const [formData, setFormData] = useState<FormData>({
    address: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    country: 'USA',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (!cartItems || cartItems.length === 0) {
        toast({
            title: "Your cart is empty!",
            description: "Redirecting you to the homepage to add items.",
            variant: "destructive"
        });
        navigate('/');
    }
  }, [cartItems, navigate]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: 'card' | 'paypal' | 'cod') => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Placing order with data:', formData, 'Order summary:', { subtotal, deliveryFee, taxes, grandTotal });
    // Basic validation example
    if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc)) {
        toast({ title: "Payment Incomplete", description: "Please fill in all card details.", variant: "destructive" });
        return;
    }
    if (!formData.address || !formData.city || !formData.zip) {
        toast({ title: "Address Incomplete", description: "Please fill in all address details.", variant: "destructive" });
        return;
    }

    const orderId = `FF-${Date.now().toString().slice(-6)}`; // Generate a mock order ID
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order #${orderId} is confirmed.`,
    });
    // In a real app, submit to backend, then navigate
    navigate(`/order-tracking/${orderId}`, { state: { orderDetails: { ...formData, grandTotal, items: cartItems, orderId }, orderSummary: { subtotal, deliveryFee, taxes, grandTotal } } });
  };
  
  const cartItemCount = cartItems.reduce((sum: number, item: { quantity: number; }) => sum + item.quantity, 0);


  if (!cartItems || cartItems.length === 0) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavigationMenu cartItemCount={0} />
            <main className="flex-grow container mx-auto px-4 py-8 text-center">
                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">Your cart is empty. Cannot proceed to checkout.</p>
                <Link to="/"><Button size="lg">Go Shopping</Button></Link>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cartItemCount} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-orange-500" /> Secure Checkout
            </CardTitle>
            <CardDescription>Please confirm your details to complete the order.</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-orange-500" /> Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Anytown" required />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="12345" required />
                  </div>
                </div>
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Select name="country" value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                        <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-orange-500" /> Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handleRadioChange} className="mb-4 space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="card" id="card" /><Label htmlFor="card">Credit/Debit Card</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="paypal" id="paypal" /><Label htmlFor="paypal">PayPal</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="cod" id="cod" /><Label htmlFor="cod">Cash on Delivery</Label></div>
                </RadioGroup>
                
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="•••• •••• •••• ••••" required={formData.paymentMethod === 'card'} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                        <Input id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/YY" required={formData.paymentMethod === 'card'} />
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input id="cardCvc" name="cardCvc" value={formData.cardCvc} onChange={handleInputChange} placeholder="•••" required={formData.paymentMethod === 'card'} />
                      </div>
                    </div>
                  </div>
                )}
                 {formData.paymentMethod === 'paypal' && (
                    <div className="text-sm text-gray-600 p-4 border rounded-md bg-blue-50 border-blue-200">
                        You will be redirected to PayPal to complete your payment securely.
                    </div>
                 )}
                 {formData.paymentMethod === 'cod' && (
                    <div className="text-sm text-gray-600 p-4 border rounded-md bg-green-50 border-green-200">
                        Please have the exact amount ready for the delivery person.
                    </div>
                 )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Final Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm">
                    {cartItems.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr />
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Taxes:</span><span>${taxes.toFixed(2)}</span></div>
                  <hr />
                  <div className="flex justify-between font-bold text-xl"><span>Grand Total:</span><span>${grandTotal.toFixed(2)}</span></div>
                </div>
                {specialInstructions && (
                    <div className="text-xs text-gray-600 border-t pt-2">
                        <strong>Special Instructions:</strong> {specialInstructions}
                    </div>
                )}
              </CardContent>
              <CardFooter>
                <Button size="lg" type="submit" className="w-full">
                  Place Order (${grandTotal.toFixed(2)})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
       <footer className="py-6 text-center text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default CheckoutPage;