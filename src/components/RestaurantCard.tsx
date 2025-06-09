import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock,Zap } from 'lucide-react'; // Zap for fast delivery
import { Link } from 'react-router-dom'; // For making the card clickable

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  rating: number; // e.g., 4.5
  reviewCount?: number; // e.g., 150
  deliveryTime: string; // e.g., "20-30 min"
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  priceRange?: string; // e.g., "$$"
  isNew?: boolean;
  onClick?: (id: string | number) => void; // Optional click handler if not using Link
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  reviewCount,
  deliveryTime,
  cuisineTypes,
  priceRange,
  isNew = false,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const content = (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group">
      <CardHeader className="p-0 relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </div>
        {isNew && (
          <Badge variant="destructive" className="absolute top-2 left-2">NEW</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold truncate group-hover:text-orange-500">{name}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{rating.toFixed(1)}</span>
          {reviewCount && <span className="text-gray-400">({reviewCount} reviews)</span>}
        </div>
         <div className="text-sm text-gray-600 flex items-center space-x-4">
            <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>{deliveryTime}</span>
            </div>
            {priceRange && <span>{priceRange}</span>}
        </div>
        {cuisineTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {cuisineTypes.slice(0, 3).map(cuisine => (
              <Badge key={cuisine} variant="outline" className="text-xs">{cuisine}</Badge>
            ))}
            {cuisineTypes.length > 3 && <Badge variant="outline" className="text-xs">+{cuisineTypes.length - 3} more</Badge>}
          </div>
        )}
      </CardContent>
      {/* Optional: CardFooter for actions if not using full card click */}
      {/* <CardFooter><Button>View Menu</Button></CardFooter> */}
    </Card>
  );

  return onClick ? (
    <div onClick={() => onClick(id)}>{content}</div>
  ) : (
    <Link to={`/restaurant/${id}`}>{content}</Link>
  );
};

export default RestaurantCard;