import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import MenuItemDisplay from '@/components/MenuItemDisplay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Star, Clock, ShoppingCart, Utensils } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // For item added to cart

// Mock data structure - in a real app, this would come from an API
const mockRestaurantData: { [key: string]: any } = {
  '1': {
    name: 'Pizza Paradise',
    logoUrl: 'https://via.placeholder.com/80x80.png?text=PP',
    rating: 4.5,
    deliveryTime: '25-35 min',
    description: 'Home of the best pizzas in town. Fresh ingredients, authentic taste.',
    menu: {
      'Appetizers': [
        { id: 'a1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 5.99, imageUrl: 'https://via.placeholder.com/150x100.png?text=Garlic+Bread' },
        { id: 'a2', name: 'Mozzarella Sticks', description: 'Crispy fried mozzarella with marinara sauce.', price: 7.50, imageUrl: 'https://via.placeholder.com/150x100.png?text=Mozza+Sticks' },
      ],
      'Pizzas': [
        { id: 'p1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://via.placeholder.com/150x100.png?text=Margherita', customizable: true },
        { id: 'p2', name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni.', price: 14.99, imageUrl: 'https://via.placeholder.com/150x100.png?text=Pepperoni' },
        { id: 'p3', name: 'Veggie Supreme', description: 'A mix of fresh garden vegetables.', price: 15.50, imageUrl: 'https://via.placeholder.com/150x100.png?text=Veggie+Pizza', customizable: true },
      ],
      'Drinks': [
        { id: 'd1', name: 'Cola', price: 2.00 },
        { id: 'd2', name: 'Lemonade', price: 2.50 },
      ]
    }
  },
  // Add more restaurants if needed
};

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  // Potentially customization details
}

const RestaurantMenuPage = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [currentItemForCustomization, setCurrentItemForCustomization] = useState<any>(null);


  useEffect(() => {
    console.log('RestaurantMenuPage loaded for restaurant ID:', restaurantId);
    if (restaurantId && mockRestaurantData[restaurantId]) {
      setRestaurant(mockRestaurantData[restaurantId]);
    } else {
      // Handle restaurant not found, e.g., navigate to a 404 page or show message
      console.error('Restaurant not found');
    }
    // In a real app, you would fetch restaurant data here
    // setRestaurant(fetchRestaurantData(restaurantId));
  }, [restaurantId]);

  const handleAddToCart = (item: { id: string | number; name: string; price: number; quantity: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
      }
      return [...prevCart, item];
    });
    toast({
      title: "Item Added!",
      description: `${item.name} has been added to your cart.`,
      variant: "default", // Or 'success' if you have it
    });
    console.log('Added to cart:', item);
  };

  const handleOpenCustomizationDialog = (itemId: string | number) => {
    const itemToCustomize = Object.values(restaurant.menu)
        .flat()
        // @ts-ignore
        .find(menuItem => menuItem.id === itemId);
    if (itemToCustomize) {
        setCurrentItemForCustomization(itemToCustomize);
        setIsCustomizationDialogOpen(true);
    }
  };

  const handleCustomizationSubmit = () => {
    // Logic to add customized item to cart
    if (currentItemForCustomization) {
        handleAddToCart({ ...currentItemForCustomization, quantity: 1 }); // Add with chosen customizations
    }
    setIsCustomizationDialogOpen(false);
    setCurrentItemForCustomization(null);
  };


  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading restaurant details or restaurant not found...</p>
           <Link to="/"><Button variant="link" className="mt-4">Back to Home</Button></Link>
        </main>
      </div>
    );
  }
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cartItemCount} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
            <Avatar className="h-24 w-24 border-2 border-orange-500">
              <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <CardTitle className="text-3xl font-bold text-gray-800">{restaurant.name}</CardTitle>
              <CardDescription className="text-gray-600 mt-1">{restaurant.description}</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" /> {restaurant.rating.toFixed(1)}</span>
                <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {restaurant.deliveryTime}</span>
              </div>
            </div>
            <Link to="/cart">
                <Button variant="outline">
                    <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({cartItemCount})
                </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Menu Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Menu</h2>
          <Accordion type="multiple" defaultValue={Object.keys(restaurant.menu)} className="w-full space-y-4">
            {Object.entries(restaurant.menu).map(([category, items]) => (
              <AccordionItem key={category} value={category} className="bg-white rounded-lg shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-gray-50 rounded-t-lg">{category}</AccordionTrigger>
                <AccordionContent className="px-2 pt-0 pb-2 md:px-4 md:pb-4">
                  <ScrollArea className="max-h-[500px] p-1 md:p-2"> {/* Adjust max height as needed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(items as any[]).map((item: any) => (
                        <MenuItemDisplay
                          key={item.id}
                          {...item}
                          onAddToCart={handleAddToCart}
                          customizable={item.customizable}
                          onCustomize={item.customizable ? () => handleOpenCustomizationDialog(item.id) : undefined}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      {/* Item Customization Dialog */}
      {currentItemForCustomization && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {currentItemForCustomization.name}</DialogTitle>
              <DialogDescription>
                Make changes to your item here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Placeholder for customization options */}
              <p>Customization options for {currentItemForCustomization.name} would go here.</p>
              <p>Example: Size, Toppings, Special Instructions.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCustomizationSubmit}>Save and Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
       <footer className="py-6 text-center text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;