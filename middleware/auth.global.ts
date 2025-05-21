// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login and callback pages
  if (to.path === '/login' || to.path === '/auth/callback') {
    return;
  }

  // Check for access in localStorage
  if (process.client) {
    const hasWhopAccess = localStorage.getItem('whopAccess');
    const hasAdminAccess = localStorage.getItem('adminAccess');
    
    if (!hasWhopAccess && !hasAdminAccess) {
      return navigateTo('/login');
    }
  }
});