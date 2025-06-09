import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react'; // For quantity adjustment and add to cart

interface MenuItemDisplayProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (item: { id: string | number; name: string; price: number; quantity: number }) => void;
  // Optional: for quantity adjustments if item is already in cart
  quantityInCart?: number;
  onUpdateQuantity?: (itemId: string | number, newQuantity: number) => void;
  customizable?: boolean; // If true, could show a 'Customize' button or different behavior
  onCustomize?: (itemId: string | number) => void; // Callback for customization
}

const MenuItemDisplay: React.FC<MenuItemDisplayProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  quantityInCart = 0,
  onUpdateQuantity,
  customizable = false,
  onCustomize,
}) => {
  console.log("Rendering MenuItemDisplay:", name, "Price:", price);

  const handleAddToCartClick = () => {
    console.log("Add to cart clicked for:", name, id);
    onAddToCart({ id, name, price, quantity: 1 }); // Default add 1
  };

  const handleIncreaseQuantity = () => {
    if (onUpdateQuantity) onUpdateQuantity(id, quantityInCart + 1);
  };

  const handleDecreaseQuantity = () => {
    if (onUpdateQuantity && quantityInCart > 0) onUpdateQuantity(id, quantityInCart - 1);
  };

  return (
    <Card className="flex flex-col sm:flex-row w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {imageUrl && (
        <div className="sm:w-1/4 aspect-video sm:aspect-square flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
          />
        </div>
      )}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <CardTitle className="text-md font-semibold mb-1">{name}</CardTitle>
          {description && <CardDescription className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</CardDescription>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-orange-600">${price.toFixed(2)}</span>
          {quantityInCart > 0 && onUpdateQuantity ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} aria-label="Decrease quantity">
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-4 text-center">{quantityInCart}</span>
              <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label="Increase quantity">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={customizable && onCustomize ? () => onCustomize(id) : handleAddToCartClick}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {customizable ? 'Customize' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItemDisplay;