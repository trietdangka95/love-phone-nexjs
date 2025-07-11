// Tailwind CSS utility classes for consistent styling

// Color classes
export const colors = {
  // Primary colors (teal theme)
  primary: {
    50: 'bg-primary-50 text-primary-900',
    100: 'bg-primary-100 text-primary-900',
    200: 'bg-primary-200 text-primary-900',
    300: 'bg-primary-300 text-primary-900',
    400: 'bg-primary-400 text-white',
    500: 'bg-primary-500 text-white',
    600: 'bg-primary-600 text-white',
    700: 'bg-primary-700 text-white',
    800: 'bg-primary-800 text-white',
    900: 'bg-primary-900 text-white',
  },
  // Secondary colors (gray theme)
  secondary: {
    50: 'bg-secondary-50 text-secondary-900',
    100: 'bg-secondary-100 text-secondary-900',
    200: 'bg-secondary-200 text-secondary-900',
    300: 'bg-secondary-300 text-secondary-900',
    400: 'bg-secondary-400 text-white',
    500: 'bg-secondary-500 text-white',
    600: 'bg-secondary-600 text-white',
    700: 'bg-secondary-700 text-white',
    800: 'bg-secondary-800 text-white',
    900: 'bg-secondary-900 text-white',
  },
  // Success colors (green)
  success: {
    50: 'bg-success-50 text-success-900',
    100: 'bg-success-100 text-success-900',
    500: 'bg-success-500 text-white',
    600: 'bg-success-600 text-white',
  },
  // Warning colors (yellow/orange)
  warning: {
    50: 'bg-warning-50 text-warning-900',
    100: 'bg-warning-100 text-warning-900',
    500: 'bg-warning-500 text-white',
    600: 'bg-warning-600 text-white',
  },
  // Error colors (red)
  error: {
    50: 'bg-error-50 text-error-900',
    100: 'bg-error-100 text-error-900',
    500: 'bg-error-500 text-white',
    600: 'bg-error-600 text-white',
  },
};

// Button classes
export const buttons = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition-colors',
  success: 'bg-success-600 hover:bg-success-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  error: 'bg-error-600 hover:bg-error-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
  ghost: 'text-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition-colors',
};

// Card classes
export const cards = {
  base: 'card',
  small: 'card-sm',
  large: 'card-lg',
  primary: 'card-primary',
  secondary: 'card-secondary',
  success: 'card-success',
  warning: 'card-warning',
  error: 'card-error',
};

// Text classes
export const text = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-3xl font-bold text-gray-900',
  h3: 'text-2xl font-bold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-semibold text-gray-900',
  h6: 'text-base font-semibold text-gray-900',
  body: 'text-base text-gray-700',
  small: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
};

// Spacing classes
export const spacing = {
  section: 'py-12 px-4 sm:px-6 lg:px-8',
  container: 'max-w-7xl mx-auto',
  card: 'p-6',
  button: 'px-4 py-2',
  input: 'px-3 py-2',
};

// Layout classes
export const layout = {
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-3 gap-6',
};

// Animation classes
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  hover: 'hover:scale-105 transition-transform duration-200',
  pulse: 'animate-pulse',
};

// Form classes
export const forms = {
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  textarea: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical',
  select: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  error: 'text-error-600 text-sm mt-1',
  success: 'text-success-600 text-sm mt-1',
};

// Navigation classes
export const navigation = {
  navItem: 'px-3 py-2 text-sm font-medium transition-colors',
  navActive: 'text-primary-600 border-b-2 border-primary-600',
  navInactive: 'text-gray-700 hover:text-primary-600',
  navMobile: 'block px-3 py-2 text-base font-medium transition-colors',
};

// Status classes
export const status = {
  online: 'bg-success-500 text-white px-2 py-1 rounded-full text-xs',
  offline: 'bg-error-500 text-white px-2 py-1 rounded-full text-xs',
  pending: 'bg-warning-500 text-white px-2 py-1 rounded-full text-xs',
  processing: 'bg-primary-500 text-white px-2 py-1 rounded-full text-xs',
};

// Badge classes
export const badges = {
  primary: 'bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  secondary: 'bg-secondary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  success: 'bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  warning: 'bg-warning-100 text-warning-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  error: 'bg-error-100 text-error-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
};

// Utility function to combine classes
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Example usage:
// const buttonClass = combineClasses(buttons.primary, 'w-full');
// const cardClass = combineClasses(cards.base, 'hover:shadow-lg'); 