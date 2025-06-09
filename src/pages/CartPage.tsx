import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MinusCircle, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Sample cart data (in a real app, this would come from global state/context)
const initialCartItems: CartItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://via.placeholder.com/80x80.png?text=Pizza' },
  { id: 'a2', name: 'Mozzarella Sticks', price: 7.50, quantity: 2, imageUrl: 'https://via.placeholder.com/80x80.png?text=Sticks' },
  { id: 'd1', name: 'Cola', price: 2.00, quantity: 4, imageUrl: 'https://via.placeholder.com/80x80.png?text=Cola' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const navigate = useNavigate();

  console.log('CartPage loaded');

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      toast({ title: "Item Removed", description: "Item removed from cart." });
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const removeItem = (id: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({ title: "Item Removed", description: "Item removed from cart." });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example delivery fee
  const taxRate = 0.08; // Example tax rate
  const taxes = subtotal * taxRate;
  const grandTotal = subtotal + deliveryFee + taxes;

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items to your cart before proceeding.", variant: "destructive" });
      return;
    }
    console.log('Proceeding to checkout with items:', cartItems, 'Promo:', promoCode, 'Instructions:', specialInstructions);
    // Pass cart data to checkout page via state or context in a real app
    navigate('/checkout', { state: { cartItems, subtotal, deliveryFee, taxes, grandTotal, specialInstructions } });
  };
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cartItemCount} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8 text-orange-500" /> Your Shopping Cart
            </CardTitle>
            <CardDescription>Review your items and proceed to checkout.</CardDescription>
          </CardHeader>
        </Card>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <Link to="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItemCount})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] md:h-[500px]"> {/* Adjust height as needed */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Remove</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="hidden md:table-cell">
                              <img src={item.imageUrl || 'https://via.placeholder.com/60x60.png?text=Item'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-7 w-7" onClick={() => removeItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24"> {/* Sticky summary on larger screens */}
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Taxes ({(taxRate * 100).toFixed(0)}%):</span><span>${taxes.toFixed(2)}</span></div>
                    <hr/>
                    <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>${grandTotal.toFixed(2)}</span></div>
                  </div>
                  <div>
                    <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                    <div className="flex gap-2">
                        <Input
                            id="promoCode"
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => toast({title: "Promo Applied!", description:"(Actually, not really. This is a demo.)"})}>Apply</Button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="e.g., No onions, please."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
       <footer className="py-6 text-center text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default CartPage;