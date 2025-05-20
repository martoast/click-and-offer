<template>
    <div class="min-h-screen bg-black flex items-center justify-center">
      <div v-if="error" class="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30 max-w-md">
        <h2 class="text-xl font-bold text-red-400 mb-3">Access Denied</h2>
        <p class="text-gray-300 mb-4">{{ error }}</p>
        <button 
          @click="navigateTo('/login')"
          class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
        >
          Return to Login
        </button>
      </div>
      
      <div v-else class="text-center">
        <div class="w-16 h-16 border-4 border-yellow-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-yellow-gold">Verifying your access...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig();
  const error = ref(null);

  console.log(config.public)
  
  const getAuthToken = async (code, clientId, clientSecret, redirectUri) => {
    const response = await fetch("https://api.whop.com/v5/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      }),
    });
    return response.json();
  };
  
  const checkAccess = async (accessToken) => {
    const response = await fetch("https://api.whop.com/v5/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  };
  
  onMounted(async () => {
    try {
      // Get the code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      
      if (!code) {
        throw new Error("No authorization code received");
      }
  
      // Exchange code for token
      const tokenData = await getAuthToken(
        code,
        config.public.WHOP_CLIENT_ID,
        config.whopClientSecret,
        config.public.WHOP_REDIRECT_URI
      );
  
      if (!tokenData.access_token) {
        throw new Error("Failed to obtain access token");
      }
  
      // Verify user access
      const userData = await checkAccess(tokenData.access_token);
      
      // Check for active UR Hustle House membership
      const hasValidMembership = userData.memberships?.some(membership => 
        membership.status === 'active' && 
        membership.product?.name?.toLowerCase().includes('ur hustle house')
      );
  
      if (!hasValidMembership) {
        throw new Error("Active UR Hustle House membership required");
      }
  
      // Store access and redirect
      localStorage.setItem('whopAccess', 'true');
      navigateTo('/');
      
    } catch (e) {
      error.value = e.message || "Authentication failed";
      console.error("Auth error:", e);
    }
  });
  </script>