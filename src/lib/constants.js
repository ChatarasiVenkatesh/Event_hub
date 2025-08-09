// Application constants

export const USER_ROLES = {
  USER: 'user',
  ORGANIZER: 'organizer'
};

export const EVENT_CATEGORIES = [
  'Technology',
  'Arts',
  'Sports',
  'Business',
  'Education',
  'Health',
  'Music',
  'Food',
  'Travel',
  'Fashion',
  'Gaming',
  'Science'
];

export const INTERESTS = EVENT_CATEGORIES;

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  CANCELLED: 'cancelled',
  ATTENDED: 'attended',
  WAITLISTED: 'waitlisted'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const EVENT_TYPES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
};

// Dummy payment keys (replace with actual keys in production)
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_dummy_key_here';
export const RAZORPAY_KEY_ID = 'rzp_test_dummy_key_here';

// Google APIs (replace with actual keys)
export const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key_here';
export const GOOGLE_CALENDAR_API_KEY = 'your_google_calendar_api_key_here';

