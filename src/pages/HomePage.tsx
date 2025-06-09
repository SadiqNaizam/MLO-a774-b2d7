import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Filter } from 'lucide-react';

const placeholderRestaurants = [
  { id: '1', name: 'Pizza Paradise', imageUrl: 'https://via.placeholder.com/300x200.png?text=Pizza+Place', rating: 4.5, reviewCount: 150, deliveryTime: '25-35 min', cuisineTypes: ['Pizza', 'Italian'], isNew: true },
  { id: '2', name: 'Burger Barn', imageUrl: 'https://via.placeholder.com/300x200.png?text=Burger+Joint', rating: 4.2, reviewCount: 120, deliveryTime: '20-30 min', cuisineTypes: ['Burgers', 'American'] },
  { id: '3', name: 'Sushi Spot', imageUrl: 'https://via.placeholder.com/300x200.png?text=Sushi+Restaurant', rating: 4.8, reviewCount: 200, deliveryTime: '30-40 min', cuisineTypes: ['Sushi', 'Japanese'] },
  { id: '4', name: 'Taco Town', imageUrl: 'https://via.placeholder.com/300x200.png?text=Taco+Truck', rating: 4.3, reviewCount: 90, deliveryTime: '15-25 min', cuisineTypes: ['Mexican', 'Tacos'], priceRange: '$$' },
  { id: '5', name: 'Curry Corner', imageUrl: 'https://via.placeholder.com/300x200.png?text=Indian+Cuisine', rating: 4.6, reviewCount: 180, deliveryTime: '35-45 min', cuisineTypes: ['Indian', 'Curry'], isNew: true },
];

const cuisineOptions = ["All", "Pizza", "Burgers", "Sushi", "Mexican", "Indian", "Chinese"];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['All']);
  const navigate = useNavigate();

  console.log('HomePage/RestaurantDiscoveryPage loaded');

  const handleCuisineFilterChange = (value: string[]) => {
    if (value.includes("All") && value.length > 1) {
        setSelectedCuisines(value.filter(v => v !== "All"));
    } else if (value.length === 0 || (value.includes("All") && selectedCuisines.length > 0 && selectedCuisines[0] !== "All")) {
        setSelectedCuisines(["All"]);
    }
     else {
        setSelectedCuisines(value);
    }
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisines.includes("All") || selectedCuisines.some(cuisine => restaurant.cuisineTypes.includes(cuisine));
    return matchesSearch && matchesCuisine;
  });

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={0} isLoggedIn={false} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Find Your Next Meal</h1>
          <p className="text-lg text-gray-600 mt-2">Discover local restaurants and Cuisines.</p>
        </header>

        {/* Search and Filters */}
        <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-2" /> Filter by Cuisine:
            </label>
            <ToggleGroup
              type="multiple"
              value={selectedCuisines}
              onValueChange={handleCuisineFilterChange}
              className="flex flex-wrap gap-2"
            >
              {cuisineOptions.map(cuisine => (
                <ToggleGroupItem key={cuisine} value={cuisine} aria-label={`Toggle ${cuisine}`}>
                  {cuisine}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </section>

        {/* Restaurant Listing */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Popular Restaurants</h2>
          {filteredRestaurants.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)] pr-4"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                    onClick={handleRestaurantClick}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 py-10">No restaurants found matching your criteria. Try adjusting your search or filters.</p>
          )}
          {filteredRestaurants.length > 5 && ( /* Example condition for load more */
             <div className="mt-8 text-center">
                <Button variant="outline" size="lg">Load More Restaurants</Button>
             </div>
          )}
        </section>
      </main>
      <footer className="py-6 text-center text-gray-600 border-t">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;