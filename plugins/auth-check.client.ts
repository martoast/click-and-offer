// plugins/auth-check.client.ts
export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter();
    const route = useRoute();
    
    // Create a global auth state
    const authChecked = useState('authChecked', () => false);
    
    // Public paths that don't require auth
    const publicPaths = ['/login', '/auth/callback'];
    
    // Check auth on initial load
    nuxtApp.hook('app:mounted', () => {
      // Skip check for public pages
      if (publicPaths.includes(route.path)) {
        authChecked.value = true;
        return;
      }
      
      // Check localStorage for auth
      const hasWhopAccess = localStorage.getItem('whopAccess');
      const hasAdminAccess = localStorage.getItem('adminAccess');
      
      if (!hasWhopAccess && !hasAdminAccess) {
        router.push('/login').then(() => {
          authChecked.value = true;
        });
      } else {
        authChecked.value = true;
      }
    });
    
    // Add route guard for client-side navigation
    router.beforeEach((to, from, next) => {
      // Skip check for public pages
      if (publicPaths.includes(to.path)) {
        next();
        return;
      }
      
      // Check auth for protected routes
      const hasWhopAccess = localStorage.getItem('whopAccess');
      const hasAdminAccess = localStorage.getItem('adminAccess');
      
      if (!hasWhopAccess && !hasAdminAccess) {
        next('/login');
      } else {
        next();
      }
    });
  });