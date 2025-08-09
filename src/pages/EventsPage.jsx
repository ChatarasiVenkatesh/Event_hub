import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { getMockEvents } from '@/data/mockData';
import { formatDate, formatCurrency, truncateText } from '@/lib/utils';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/lib/constants';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // State
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      const mockEvents = getMockEvents();
      setEvents(mockEvents);
      setLoading(false);
    };
    
    loadEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Type filter (online/offline)
    if (selectedType) {
      if (selectedType === 'online') {
        filtered = filtered.filter(event => event.isOnline);
      } else if (selectedType === 'offline') {
        filtered = filtered.filter(event => !event.isOnline);
      }
    }

    // Price range filter
    filtered = filtered.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return (b.attendees || 0) - (a.attendees || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory, selectedType, priceRange, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedType('');
    setPriceRange([0, 1000]);
    setSortBy('date');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={!selectedCategory}
              onCheckedChange={() => setSelectedCategory('')}
            />
            <label htmlFor="all-categories" className="text-sm">All Categories</label>
          </div>
          {EVENT_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(selectedCategory === category ? '' : category)}
              />
              <label htmlFor={category} className="text-sm">{category}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Event Type Filter */}
      <div>
        <h4 className="font-medium mb-3">Event Type</h4>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="">All Types</option>
          <option value="online">Online Events</option>
          <option value="offline">In-Person Events</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            Discover Events
          </motion.h1>
          <p className="text-muted-foreground">
            Find amazing events that match your interests and connect with like-minded people.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, locations, organizers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Sort Dropdown */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-48 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Mobile Filter Button */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect events.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory || selectedType) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
              {selectedType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedType === 'online' ? 'Online' : 'In-Person'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedType('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              <FilterContent />
            </Card>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredEvents.length} of {events.length} events
                  </p>
                </div>

                {/* Events Grid */}
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full">
                          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                            {event.imageUrl && (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary">{event.category}</Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Badge variant="outline" className="bg-background/80">
                                {event.price > 0 ? formatCurrency(event.price) : 'Free'}
                              </Badge>
                            </div>
                            {event.isOnline && (
                              <div className="absolute bottom-4 left-4">
                                <Badge variant="default">Online Event</Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6 flex flex-col flex-1">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {event.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                              {truncateText(event.description, 120)}
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{event.attendees || 0} attending</span>
                              </div>
                            </div>
                            <Button
                              className="w-full mt-4"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

