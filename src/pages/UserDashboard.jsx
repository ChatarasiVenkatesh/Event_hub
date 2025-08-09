import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  TrendingUp,
  Heart,
  Bookmark,
  Star,
  Award,
  Target,
  Activity,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getMockEvents, getMockUserRegistrations } from '@/data/mockData';
import { formatDate, formatCurrency, isEventUpcoming, isEventPast } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const UserDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allEvents = getMockEvents();
      const userRegistrations = getMockUserRegistrations(user?.uid || 'user1');
      
      // Filter events based on user interests
      const userInterests = userProfile?.interests || [];
      const recommended = allEvents.filter(event => 
        userInterests.includes(event.category) && 
        !userRegistrations.some(reg => reg.eventId === event.id)
      ).slice(0, 6);
      
      setEvents(allEvents);
      setRegistrations(userRegistrations);
      setRecommendedEvents(recommended);
      setLoading(false);
    };
    
    loadData();
  }, [user, userProfile]);

  // Get registered events
  const registeredEvents = events.filter(event => 
    registrations.some(reg => reg.eventId === event.id)
  );

  const upcomingEvents = registeredEvents.filter(event => isEventUpcoming(event.date));
  const pastEvents = registeredEvents.filter(event => isEventPast(event.date));

  // Analytics data
  const monthlyData = [
    { month: 'Jan', events: 2 },
    { month: 'Feb', events: 1 },
    { month: 'Mar', events: 3 },
    { month: 'Apr', events: 2 },
    { month: 'May', events: 4 },
    { month: 'Jun', events: 1 }
  ];

  const categoryData = userProfile?.interests?.map(interest => ({
    name: interest,
    value: registeredEvents.filter(event => event.category === interest).length,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })) || [];

  const stats = [
    {
      title: 'Events Attended',
      value: pastEvents.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Registrations',
      value: registrations.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Favorite Categories',
      value: userProfile?.interests?.length || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const achievements = [
    { name: 'Early Bird', description: 'Registered for 5 events in advance', earned: true },
    { name: 'Tech Enthusiast', description: 'Attended 3 technology events', earned: true },
    { name: 'Networking Pro', description: 'Connected with 10+ attendees', earned: false },
    { name: 'Event Explorer', description: 'Attended events in 5 different categories', earned: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userProfile?.name || 'User'}!</h1>
              <p className="text-muted-foreground">
                Discover new events and manage your registrations
              </p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback className="text-lg">
                {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Your next registered events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No upcoming events</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate('/events')}
                      >
                        Browse Events
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(event.date)} • {event.location}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                      {upcomingEvents.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => navigate('/dashboard?tab=events')}
                        >
                          View All ({upcomingEvents.length})
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Your event participation milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${achievement.earned ? '' : 'text-muted-foreground'}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary">Earned</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/events')}
                  >
                    <Search className="h-6 w-6" />
                    <span>Browse Events</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/profile')}
                  >
                    <Users className="h-6 w-6" />
                    <span>Update Profile</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/dashboard?tab=recommended')}
                  >
                    <Star className="h-6 w-6" />
                    <span>Recommendations</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events ({upcomingEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No upcoming events</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-3 w-full"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Past Events ({pastEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No past events</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastEvents.map((event) => (
                        <Card key={event.id} className="p-4 opacity-75">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommended Tab */}
          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Events matching your interests: {userProfile?.interests?.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No recommendations available</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/events')}
                    >
                      Browse All Events
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                          {event.imageUrl && (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            {event.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-2">{event.title}</h4>
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>Events attended per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="events" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Your event participation goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Events This Year</span>
                      <span className="text-sm text-muted-foreground">{registrations.length}/12</span>
                    </div>
                    <Progress value={(registrations.length / 12) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Categories Explored</span>
                      <span className="text-sm text-muted-foreground">{categoryData.length}/6</span>
                    </div>
                    <Progress value={(categoryData.length / 6) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Networking Connections</span>
                      <span className="text-sm text-muted-foreground">7/20</span>
                    </div>
                    <Progress value={35} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

