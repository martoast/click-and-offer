<template>
  <div class="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-yellow-gold/10 via-transparent to-black"></div>
    
    <!-- Static Background Circles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-yellow-gold/5 blur-3xl top-[10%] left-[5%]"></div>
      <div class="absolute w-40 h-40 md:w-56 md:h-56 rounded-full bg-yellow-gold/5 blur-3xl bottom-[20%] right-[10%]"></div>
      <div class="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-yellow-gold/5 blur-3xl top-[60%] left-[80%]"></div>
    </div>
    
    <!-- Main Content Container -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        <!-- Left Column - Login Form -->
        <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <!-- Logo -->
          <img src="/logo.png" alt="Click&Offer Logo" class="h-12 md:h-16 mb-6 lg:mb-8" />

          <!-- Welcome Text -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to <span class="text-yellow-gold">Click&Offer</span>
          </h1>

          <p class="text-base md:text-lg text-gray-300 mb-6 lg:mb-8 max-w-lg">
            Your all-in-one platform for analyzing properties, generating offers,
            and closing deals with confidence.
          </p>

          <!-- Whop Login Button -->
          <button
            @click="loginWithWhop"
            class="w-full max-w-sm lg:max-w-none bg-gradient-to-r from-yellow-600 to-yellow-gold px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-black hover:from-yellow-gold hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-gold/20 transform hover:-translate-y-0.5 border border-yellow-gold/30 group"
          >
            <span class="flex items-center justify-center text-base md:text-lg">
              Login with Whop
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </button>

          <!-- Divider -->
          <div class="w-full max-w-sm lg:max-w-none my-6 flex items-center">
            <div class="h-px bg-gray-700 flex-grow"></div>
            <span class="px-4 text-gray-400 text-sm">OR</span>
            <div class="h-px bg-gray-700 flex-grow"></div>
          </div>
          
          <!-- Admin Login Section -->
          <div class="w-full max-w-sm lg:max-w-none">
            <!-- Toggle Button -->
            <div v-if="!showAdminForm" class="flex justify-center lg:justify-start">
              <button 
                @click="showAdminForm = true" 
                class="text-yellow-gold hover:text-yellow-gold-light transition-colors duration-200 text-sm underline underline-offset-4"
              >
                Login with Admin Code
              </button>
            </div>
            
            <!-- Admin Form -->
            <div v-else class="w-full space-y-3">
              <input 
                v-model="adminCode" 
                type="password" 
                placeholder="Enter admin code" 
                class="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-gold focus:outline-none focus:ring-1 focus:ring-yellow-gold/50 transition-all duration-200"
                @keyup.enter="loginWithAdminCode"
              />
              <div class="flex gap-3">
                <button 
                  @click="loginWithAdminCode" 
                  class="flex-1 bg-gray-800 border border-yellow-gold text-yellow-gold px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Login
                </button>
                <button 
                  @click="showAdminForm = false; adminCode = ''; errorMessage = ''" 
                  class="flex-1 bg-transparent border border-gray-700 text-gray-400 px-4 py-2.5 rounded-lg hover:bg-gray-900/50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
              
              <!-- Error Message -->
              <div v-if="errorMessage" class="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/50 rounded-lg py-2 px-3">
                {{ errorMessage }}
              </div>
            </div>
          </div>

          <!-- Membership CTA -->
          <div class="mt-8 lg:mt-10 text-center lg:text-left">
            <p class="text-gray-400 mb-3 text-sm">Not a UR Hustle House Member Yet?</p>
            <a
              href="https://whop.com/ur-hustle-house/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-yellow-gold hover:text-yellow-gold-light transition-colors duration-200 group"
            >
              <span class="underline underline-offset-4">Join now to get your first deal</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Column - Video -->
        <div class="w-full lg:w-1/2 mt-8 lg:mt-0">
          <div class="relative rounded-xl overflow-hidden shadow-2xl border border-yellow-gold/20 bg-gray-900">
            <!-- 16:9 Aspect Ratio Container -->
            <div class="relative w-full" style="padding-bottom: 56.25%;">
              <iframe
                src="https://streamable.com/e/rzncnt"
                frameborder="0"
                width="100%"
                height="100%"
                allowfullscreen
                class="absolute inset-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRuntimeConfig, navigateTo } from '#app';

// Tell this page not to use any layout
definePageMeta({
  layout: false
});

const config = useRuntimeConfig();
const showAdminForm = ref(false);
const adminCode = ref('');
const errorMessage = ref('');

// Get the admin code from environment variables
const validAdminCode = config.public.ADMIN_CODE || 'your-default-admin-code';

onMounted(() => {
  // Check if user is already authenticated
  if (typeof window !== 'undefined') {
    const hasAccess = localStorage.getItem("whopAccess");
    const hasAdminAccess = localStorage.getItem("adminAccess");
    
    if (hasAccess || hasAdminAccess) {
      navigateTo("/");
    }
  }
});

const loginWithWhop = () => {
  const clientId = config.public.WHOP_CLIENT_ID;
  const redirectUri = config.public.WHOP_REDIRECT_URI;

  const authUrl = `https://whop.com/oauth/?scope=openid+user&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  window.location.href = authUrl;
};

const loginWithAdminCode = () => {
  if (adminCode.value === validAdminCode) {
    // Store admin access in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminAccess", "true");
    }
    // Navigate to homepage
    navigateTo("/");
  } else {
    errorMessage.value = "Invalid admin code";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};
</script>