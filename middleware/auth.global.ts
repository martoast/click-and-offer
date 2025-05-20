export default defineNuxtRouteMiddleware((to) => {
    // Skip auth check for login and callback pages
    if (to.path === '/login' || to.path === '/auth/callback') {
      return;
    }
  
    // Check for access in localStorage
    if (process.client) {
      const hasAccess = localStorage.getItem('whopAccess');
      if (!hasAccess) {
        return navigateTo('/login');
      }
    }
  });