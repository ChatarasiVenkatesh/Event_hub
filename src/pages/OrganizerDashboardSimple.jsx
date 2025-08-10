import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "@/lib/firebase";


import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Star,
  Award,
  Target,
  ArrowRight,
  Filter,
  Search,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { getMockEvents, getMockOrganizerEvents, getMockDetailedEventRegistrations } from '@/data/mockData';
import { formatDate, formatCurrency, isEventUpcoming, isEventPast } from '@/lib/utils';


export const OrganizerDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // State
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageAttendanceRate, setAverageAttendanceRate] = useState(0);




  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const eventsRef = collection(db, "events");
        const eventsQuery = query(eventsRef, where("organizerId", "==", user?.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventsData);

        // Total counts
        const totalEventsCount = eventsData.length;
        const totalAttendees = eventsData.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);
        const totalCapacity = eventsData.reduce((sum, e) => sum + (e.capacity || 0), 0);
        const totalRev = eventsData.reduce(
          (sum, e) => sum + ((e.attendees?.length || 0) * (e.price || 0)),
          0
        );

        // Calculate overall average attendance rate
        let avgAttendanceRate = 0;
        if (totalCapacity > 0) {
          avgAttendanceRate = (totalAttendees / totalCapacity) * 100;
        }

        setTotalEvents(totalEventsCount);
        setTotalRegistrations(totalAttendees);
        setTotalRevenue(totalRev);
        setAverageAttendanceRate(avgAttendanceRate.toFixed(2)); // keep 2 decimals
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setLoading(false);
    };

    if (user?.uid) {
      loadData();
    }
  }, [user]);



  // Filter events based on search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter(event => isEventUpcoming(event.date));
  const pastEvents = filteredEvents.filter(event => isEventPast(event.date));
  const draftEvents = filteredEvents.filter(event => event.status === 'draft');

  // Analytics data



  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: "Total Registrations",
      value: totalRegistrations,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+23%'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+18%'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+0.2'
    }
  ];

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleDuplicateEvent = (event) => {
    const newEvent = {
      ...event,
      id: `event_${Date.now()}`,
      title: `${event.title} (Copy)`,
      status: 'draft'
    };
    setEvents([...events, newEvent]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your events and track performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userProfile?.profilePicture} />
                <AvatarFallback className="text-lg">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || 'O'}
                </AvatarFallback>
              </Avatar>
              <Button onClick={() => navigate('/organizer/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
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
                        <p className="text-xs text-green-600 mt-1">
                          {stat.change} from last month
                        </p>
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
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Events
                  </CardTitle>
                  <CardDescription>
                    Your latest event activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No events created yet</p>
                      <Button
                        className="mt-4"
                        onClick={() => navigate('/create-event')}
                      >
                        Create Your First Event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(event.date)} • {registrations.filter(reg => reg.eventId === event.id).length} registered
                            </p>
                          </div>
                          <Badge variant={isEventUpcoming(event.date) ? 'default' : 'secondary'}>
                            {isEventUpcoming(event.date) ? 'Upcoming' : 'Past'}
                          </Badge>
                        </div>
                      ))}
                      { }
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Summary
                  </CardTitle>
                  <CardDescription>
                    Your event performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Attendance Rate</span>
                      <span className="text-sm font-bold">{averageAttendanceRate}%</span>
                    </div>
                    <Progress value={averageAttendanceRate} />


                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Event Completion Rate</span>
                      <span className="text-sm font-bold">100%</span>
                    </div>
                    <Progress value={100} />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm font-bold">4.8/5</span>
                    </div>
                    <Progress value={96} />

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
                          <p className="text-xs text-muted-foreground">Upcoming</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{pastEvents.length}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </div>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/create-event')}
                  >
                    <Plus className="h-6 w-6" />
                    <span>Create Event</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/dashboard?tab=registrations')}
                  >
                    <Users className="h-6 w-6" />
                    <span>View Registrations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/dashboard?tab=analytics')}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate('/profile')}
                  >
                    <Award className="h-6 w-6" />
                    <span>Profile Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => navigate('/create-event')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Events List */}
            <div className="space-y-6">
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
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge variant="outline">{event.category}</Badge>
                                <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                                  {event.status}
                                </Badge>
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
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  {registrations.filter(reg => reg.eventId === event.id).length} registered
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => navigate(`/edit-event/${event.id}`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDuplicateEvent(event)}>
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Revenue: {formatCurrency(registrations.filter(reg => reg.eventId === event.id).length * (event.price || 0))}
                            </span>
                            <Button size="sm" onClick={() => navigate(`/event/${event.id}/registrations`)}>
                              View Registrations
                            </Button>
                          </div>
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
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge variant="secondary">Completed</Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  {registrations.filter(reg => reg.eventId === event.id).length} attended
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDuplicateEvent(event)}>
                                <Share2 className="h-4 w-4" />
                              </Button>
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

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Event Registrations
                </CardTitle>
                <CardDescription>
                  Manage attendee registrations across all your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No registrations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => {
                      const eventRegistrations = registrations.filter(reg => reg.eventId === event.id);
                      if (eventRegistrations.length === 0) return null;

                      return (
                        <Card key={event.id} className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {eventRegistrations.length} registrations • {formatDate(event.date)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                              <Button size="sm" onClick={() => navigate(`/event/${event.id}/registrations`)}>
                                View All
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="font-medium">{eventRegistrations.length}</p>
                              <p className="text-muted-foreground">Total Registered</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="font-medium">{formatCurrency(eventRegistrations.length * (event.price || 0))}</p>
                              <p className="text-muted-foreground">Revenue</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded">
                              <p className="font-medium">{Math.round((eventRegistrations.length / (event.capacity || 100)) * 100)}%</p>
                              <p className="text-muted-foreground">Capacity</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analytics Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Events, registrations, and revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Analytics charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Category charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{((registrations.length / events.length) || 0).toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Avg. Registrations per Event</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue / events.length || 0)}</p>
                    <p className="text-sm text-muted-foreground">Avg. Revenue per Event</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">78%</p>
                    <p className="text-sm text-muted-foreground">Avg. Attendance Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">4.8</p>
                    <p className="text-sm text-muted-foreground">Avg. Event Rating</p>
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

