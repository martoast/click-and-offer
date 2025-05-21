<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Background gradient and animated elements remain the same -->
    
    <!-- Main content -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
      <!-- Left side - Login form -->
      <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <img src="/logo.png" alt="Click&Offer Logo" class="h-16 mb-8" />

        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span class="text-yellow-gold">Click&Offer</span>
        </h1>

        <p class="text-lg text-gray-300 mb-8 max-w-lg">
          Your all-in-one platform for analyzing properties, generating offers,
          and closing deals with confidence.
        </p>

        <!-- Whop Login Button -->
        <button
          @click="loginWithWhop"
          class="w-full bg-gradient-to-r from-yellow-600 to-yellow-gold px-8 py-4 rounded-lg font-bold text-black hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 relative overflow-hidden group mb-6"
        >
          <span class="relative z-10 flex items-center justify-center text-lg">
            Login with Whop
            <span class="ml-2">→</span>
          </span>
          <span
            class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          ></span>
        </button>

        <!-- Admin Login Option -->
        <div class="w-full mt-4 mb-6">
          <div class="flex items-center justify-center lg:justify-start mb-4">
            <div class="h-px bg-gray-700 flex-grow"></div>
            <span class="px-4 text-gray-400">OR</span>
            <div class="h-px bg-gray-700 flex-grow"></div>
          </div>
          
          <div v-if="!showAdminForm" class="flex justify-center lg:justify-start">
            <button 
              @click="showAdminForm = true" 
              class="text-yellow-gold underline hover:text-yellow-gold-light transition-colors"
            >
              Login with Admin Code
            </button>
          </div>
          
          <div v-else class="w-full">
            <input 
              v-model="adminCode" 
              type="password" 
              placeholder="Enter admin code" 
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mb-3 focus:border-yellow-gold focus:outline-none"
            />
            <div class="flex gap-3">
              <button 
                @click="loginWithAdminCode" 
                class="flex-1 bg-gray-800 border border-yellow-gold text-yellow-gold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Login
              </button>
              <button 
                @click="showAdminForm = false" 
                class="flex-1 bg-transparent border border-gray-700 text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
            <p v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- New Membership CTA -->
        <div class="text-center lg:text-left">
          <p class="text-gray-400 mb-4">Not a UR Hustle House Member Yet?</p>
          <a
            href="https://whop.com/ur-hustle-house/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-yellow-gold hover:text-yellow-gold-light transition-colors"
          >
            Join now to get your first deal
            <span class="ml-2">→</span>
          </a>
        </div>
      </div>

      <!-- Right side - Demo video -->
      <div class="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-2xl border border-yellow-gold/30">
        <iframe
          src="https://streamable.com/e/8i8yw4"
          frameborder="0"
          width="100%"
          height="100%"
          allowfullscreen
          style="aspect-ratio: 16/9"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const showAdminForm = ref(false);
const adminCode = ref('');
const errorMessage = ref('');

// Get the admin code from environment variables
const validAdminCode = config.public.ADMIN_CODE || 'your-default-admin-code';

onMounted(() => {
  // Check if user is already authenticated
  const hasAccess = localStorage.getItem("whopAccess");
  const hasAdminAccess = localStorage.getItem("adminAccess");
  
  if (hasAccess || hasAdminAccess) {
    navigateTo("/");
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
    localStorage.setItem("adminAccess", "true");
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

<style>
.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}
</style>
