// Mock data for testing the application
import { v4 as uuidv4 } from 'uuid';
import { EVENT_CATEGORIES, USER_ROLES, EVENT_STATUS, REGISTRATION_STATUS } from '@/lib/constants';

// Mock Events Data
export const mockEvents = [
  {
    id: uuidv4(),
    title: 'Tech Conference 2025',
    description: 'The biggest tech conference of the year featuring industry leaders and cutting-edge innovations. Join us for three days of networking, learning, and inspiration.',
    category: 'Technology',
    date: '2025-03-15T09:00:00Z',
    endDate: '2025-03-17T18:00:00Z',
    location: 'San Francisco Convention Center',
    address: '747 Howard St, San Francisco, CA 94103',
    price: 299,
    capacity: 500,
    attendees: 342,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    organizerId: 'organizer1',
    organizerName: 'Tech Events Inc.',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['technology', 'innovation', 'networking'],
    isOnline: false,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z'
  },
  {
    id: uuidv4(),
    title: 'Digital Marketing Summit',
    description: 'Learn the latest digital marketing strategies from industry experts. Discover new tools, techniques, and trends that will transform your marketing approach.',
    category: 'Business',
    date: '2025-04-20T10:00:00Z',
    endDate: '2025-04-20T17:00:00Z',
    location: 'New York Marketing Hub',
    address: '123 Marketing Ave, New York, NY 10001',
    price: 199,
    capacity: 300,
    attendees: 156,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    organizerId: 'organizer2',
    organizerName: 'Marketing Pros',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['marketing', 'digital', 'business'],
    isOnline: false,
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-12-10T16:45:00Z'
  },
  {
    id: uuidv4(),
    title: 'Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors. Network with entrepreneurs, investors, and industry professionals in a dynamic environment.',
    category: 'Business',
    date: '2025-05-10T18:00:00Z',
    endDate: '2025-05-10T21:00:00Z',
    location: 'Innovation Center',
    address: '456 Startup Blvd, Austin, TX 78701',
    price: 50,
    capacity: 200,
    attendees: 89,
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    organizerId: 'organizer3',
    organizerName: 'Startup Community',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['startup', 'pitch', 'investment'],
    isOnline: false,
    createdAt: '2024-12-05T11:30:00Z',
    updatedAt: '2024-12-20T13:15:00Z'
  },
  {
    id: uuidv4(),
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the fundamentals of AI and machine learning. Perfect for beginners and intermediate developers looking to expand their skills.',
    category: 'Technology',
    date: '2025-02-28T13:00:00Z',
    endDate: '2025-02-28T17:00:00Z',
    location: 'Online Event',
    address: 'Virtual',
    price: 0,
    capacity: 1000,
    attendees: 567,
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    organizerId: 'organizer1',
    organizerName: 'Tech Events Inc.',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['ai', 'machine-learning', 'workshop'],
    isOnline: true,
    createdAt: '2024-11-20T08:00:00Z',
    updatedAt: '2024-12-18T10:20:00Z'
  },
  {
    id: uuidv4(),
    title: 'Art & Design Expo',
    description: 'Explore the latest trends in art and design. Meet talented artists, designers, and creative professionals from around the world.',
    category: 'Arts',
    date: '2025-06-15T10:00:00Z',
    endDate: '2025-06-17T19:00:00Z',
    location: 'Creative Arts Center',
    address: '789 Art District, Los Angeles, CA 90028',
    price: 75,
    capacity: 400,
    attendees: 234,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    organizerId: 'organizer4',
    organizerName: 'Arts Collective',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['art', 'design', 'creative'],
    isOnline: false,
    createdAt: '2024-12-08T14:00:00Z',
    updatedAt: '2024-12-22T09:30:00Z'
  },
  {
    id: uuidv4(),
    title: 'Health & Wellness Summit',
    description: 'Discover the latest in health and wellness. Learn from medical professionals, nutritionists, and fitness experts about living a healthier life.',
    category: 'Health',
    date: '2025-07-22T09:00:00Z',
    endDate: '2025-07-22T16:00:00Z',
    location: 'Wellness Center',
    address: '321 Health Way, Miami, FL 33101',
    price: 125,
    capacity: 250,
    attendees: 178,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    organizerId: 'organizer5',
    organizerName: 'Wellness Group',
    status: EVENT_STATUS.PUBLISHED,
    tags: ['health', 'wellness', 'fitness'],
    isOnline: false,
    createdAt: '2024-12-12T12:00:00Z',
    updatedAt: '2024-12-25T15:45:00Z'
  }
];

// Mock Users Data
export const mockUsers = [
  {
    uid: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: USER_ROLES.USER,
    interests: ['Technology', 'Business', 'Education'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
    profilePicture: null,
    phone: '+1-555-0123',
    bio: 'Tech enthusiast and lifelong learner',
    location: 'San Francisco, CA',
    isActive: true
  },
  {
    uid: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: USER_ROLES.USER,
    interests: ['Arts', 'Music', 'Fashion'],
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-12-18T11:15:00Z',
    profilePicture: null,
    phone: '+1-555-0124',
    bio: 'Creative professional and art lover',
    location: 'New York, NY',
    isActive: true
  },
  {
    uid: 'organizer1',
    name: 'Tech Events Inc.',
    email: 'contact@techevents.com',
    role: USER_ROLES.ORGANIZER,
    interests: [],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-12-22T16:00:00Z',
    profilePicture: null,
    phone: '+1-555-0200',
    bio: 'Leading technology event organizer',
    location: 'San Francisco, CA',
    isActive: true
  },
  {
    uid: 'organizer2',
    name: 'Marketing Pros',
    email: 'hello@marketingpros.com',
    role: USER_ROLES.ORGANIZER,
    interests: [],
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-12-20T13:45:00Z',
    profilePicture: null,
    phone: '+1-555-0201',
    bio: 'Expert marketing event organizers',
    location: 'New York, NY',
    isActive: true
  }
];

// Mock Registrations Data
export const mockRegistrations = [
  {
    id: uuidv4(),
    userId: 'user1',
    eventId: mockEvents[0].id,
    status: REGISTRATION_STATUS.REGISTERED,
    registeredAt: '2024-12-10T14:30:00Z',
    paymentStatus: 'completed',
    paymentAmount: 299,
    attendeeInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123'
    }
  },
  {
    id: uuidv4(),
    userId: 'user1',
    eventId: mockEvents[3].id,
    status: REGISTRATION_STATUS.REGISTERED,
    registeredAt: '2024-12-15T09:15:00Z',
    paymentStatus: 'completed',
    paymentAmount: 0,
    attendeeInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123'
    }
  },
  {
    id: uuidv4(),
    userId: 'user2',
    eventId: mockEvents[4].id,
    status: REGISTRATION_STATUS.REGISTERED,
    registeredAt: '2024-12-18T16:45:00Z',
    paymentStatus: 'completed',
    paymentAmount: 75,
    attendeeInfo: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124'
    }
  }
];

// Helper functions to simulate API calls
export const getMockEvents = (filters = {}) => {
  let filteredEvents = [...mockEvents];
  
  if (filters.category) {
    filteredEvents = filteredEvents.filter(event => 
      event.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filteredEvents = filteredEvents.filter(event =>
      event.price >= min && event.price <= max
    );
  }
  
  return filteredEvents;
};

export const getMockEventById = (id) => {
  return mockEvents.find(event => event.id === id);
};

export const getMockUserRegistrations = (userId) => {
  return mockRegistrations.filter(reg => reg.userId === userId);
};

export const getMockEventRegistrations = (eventId) => {
  return mockRegistrations.filter(reg => reg.eventId === eventId);
};


// Mock organizer events
export const getMockOrganizerEvents = (organizerId) => {
  return [
    {
      id: 'org_event_1',
      title: 'Advanced React Workshop',
      description: 'Deep dive into React hooks, context, and performance optimization techniques.',
      category: 'Technology',
      date: '2025-03-20T10:00:00Z',
      location: 'Tech Hub San Francisco',
      price: 299,
      capacity: 50,
      organizerId,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      isOnline: false,
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 'org_event_2',
      title: 'Startup Funding Masterclass',
      description: 'Learn how to secure funding for your startup from industry experts.',
      category: 'Business',
      date: '2025-04-15T14:00:00Z',
      location: 'Business Center NYC',
      price: 199,
      capacity: 100,
      organizerId,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
      isOnline: false,
      tags: ['Startup', 'Funding', 'Business']
    },
    {
      id: 'org_event_3',
      title: 'Digital Art Exhibition',
      description: 'Showcase of contemporary digital art from emerging artists.',
      category: 'Arts',
      date: '2025-02-10T18:00:00Z',
      location: 'Modern Art Gallery',
      price: 25,
      capacity: 200,
      organizerId,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
      isOnline: false,
      tags: ['Art', 'Digital', 'Exhibition']
    },
    {
      id: 'org_event_4',
      title: 'AI Ethics Symposium',
      description: 'Discussing the ethical implications of artificial intelligence in society.',
      category: 'Technology',
      date: '2024-12-15T09:00:00Z',
      location: 'University Auditorium',
      price: 0,
      capacity: 300,
      organizerId,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      isOnline: true,
      tags: ['AI', 'Ethics', 'Technology']
    },
    {
      id: 'org_event_5',
      title: 'Wellness Retreat Weekend',
      description: 'A rejuvenating weekend focused on mental and physical wellness.',
      category: 'Health',
      date: '2025-05-20T08:00:00Z',
      location: 'Mountain Retreat Center',
      price: 450,
      capacity: 30,
      organizerId,
      status: 'draft',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      isOnline: false,
      tags: ['Wellness', 'Retreat', 'Health']
    }
  ];
};

// Enhanced event registrations with more detailed data
export const getMockDetailedEventRegistrations = (eventId) => {
  const registrationCounts = {
    'org_event_1': 42,
    'org_event_2': 78,
    'org_event_3': 156,
    'org_event_4': 234,
    'org_event_5': 12,
    'event_1': 342,
    'event_2': 156,
    'event_3': 89,
    'event_4': 567,
    'event_5': 234,
    'event_6': 178
  };

  const count = registrationCounts[eventId] || 0;
  const registrations = [];

  for (let i = 0; i < count; i++) {
    registrations.push({
      id: `reg_${eventId}_${i}`,
      eventId,
      userId: `user_${i}`,
      userName: `User ${i + 1}`,
      userEmail: `user${i + 1}@example.com`,
      registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      paymentStatus: 'paid'
    });
  }

  return registrations;
};

