<template>
  <div class="homepage min-h-screen w-full overflow-hidden bg-black text-white relative">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-radial from-yellow-gold/5 via-gray-900/30 to-black/90 animate-gradient-slow"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 5" :key="i" 
           class="absolute rounded-full opacity-10 animate-float"
           :style="{
             width: `${50 + (i * 30)}px`,
             height: `${50 + (i * 30)}px`,
             top: `${Math.random() * 100}%`,
             left: `${Math.random() * 100}%`,
             animationDelay: `${i * 2}s`,
             animationDuration: `${15 + (i * 5)}s`,
             background: i % 2 === 0 ? 'linear-gradient(135deg, #d4af3780, #202020)' : 'linear-gradient(135deg, #f9d77680, #202020)'
           }">
      </div>
    </div>
    
    <!-- Top-Left Logo -->
    <div class="absolute top-4 left-4 z-20">
      <a href="/">
        <img src="/logo.png" alt="Click&Offer Logo" class="h-10 md:h-12" />
      </a>
    </div>
    
    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <!-- Logo and Branding -->
      <div class="mb-8 md:mb-12">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
          <span class="text-yellow-gold">Click</span>
          <span class="text-white">&Offer</span>
        </h1>
      </div>
      
      <!-- Hero Text -->
      <div class="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight text-white leading-tight">
          Analyze any <span class="text-yellow-gold">Property</span> in Seconds
        </h2>
        <p class="text-slate-300 text-base md:text-lg leading-relaxed opacity-90">
          Search any address to instantly explore details, analyze investment potential, and make offers with confidence.
        </p>
      </div>
      
      <!-- Search Box -->
      <div class="w-full max-w-2xl mx-auto mb-8 md:mb-12 search-container">
        <div class="search-glow absolute inset-0 bg-yellow-gold/10 blur-xl rounded-full opacity-30"></div>
        <AddressAutocomplete 
          @select-address="handleAddressSelect"
          @loading-state="updateLoadingState"
          class="z-10 relative"
        />
        <div class="text-center mt-3 text-slate-400 text-sm">Try "123 Main St" or any US address</div>
      </div>
      
      <!-- Benefits -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl mx-auto mt-8">
        <div v-for="(benefit, index) in benefits" :key="index"
             class="benefit-card bg-gradient-to-br from-black to-gray-900 rounded-xl border border-yellow-gold/30 shadow-xl overflow-hidden p-4 hover:border-yellow-gold/50 hover:-translate-y-1 transition-all duration-300">
          <div class="benefit-icon text-yellow-gold mb-3">
            <component :is="benefit.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold mb-1 text-yellow-gold">{{ benefit.title }}</h3>
          <p class="text-sm text-slate-300">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Subtle Navigation Indicator (only shows when navigating away) -->
    <div v-if="isNavigating" 
         class="fixed bottom-4 right-4 bg-black/90 border border-yellow-gold/30 px-4 py-3 rounded-lg shadow-lg text-center z-50 flex items-center space-x-3 transition-all duration-300 transform"
         :class="isNavigating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
      <div class="w-5 h-5 border-2 border-slate-600 border-t-yellow-gold rounded-full animate-spin"></div>
      <p class="text-yellow-gold text-sm font-medium">Loading property...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import AddressAutocomplete from '~/components/AddressAutocomplete.vue';

const router = useRouter();
const isLoading = ref(false);
const isNavigating = ref(false);

// Benefits with icons - updated with gold theme
const benefits = [
  {
    title: 'Instant Analysis',
    description: 'Quickly access comprehensive property data, including owner details, comparable sales, photos, financials, and realtor contacts.',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-yellow-gold' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ])
    })
  },
  {
    title: 'Smart Offers',
    description: 'Generate and send offers based on accurate market data and valuations. Our platform includes strategic estimates and an auto-calculator to consolidate all relevant figures.',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-yellow-gold' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
      ])
    })
  },
  {
    title: 'Fast Decisions',
    description: 'Make informed investment choices swiftly with detailed property reports. Assess cash flow, rental income, and overall investment potential to determine deal viability.',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-yellow-gold' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
      ])
    })
  },
  {
    title: 'NapkinSigned',
    description: 'Automatically generate any necessary real estate transaction contract and receive a PDF copy via email, ready for execution.',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-yellow-gold' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }),
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 18v-3a2 2 0 00-2-2h-4a2 2 0 00-2 2v3' })
      ])
    })
  },
  {
    title: 'House AI Support',
    description: 'Utilize our AI assistant, equipped with real estate expertise, to guide you during calls and assist in formulating property offers.',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-yellow-gold' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
      ])
    })
  }
];

// Handle the selected address from the autocomplete
const handleAddressSelect = (addressData) => {
  console.log(addressData);
  if (addressData?.realEstateId) {
    // Show navigation indicator
    isNavigating.value = true;
    
    // Navigate to the property page
    router.push(`/property/${addressData.realEstateId}`);
  }
  else {
    console.error('No property identifier found for this address');
    // Could show an error notification here
  }
};

// Update loading state (only for input typing now)
const updateLoadingState = (loading) => {
  isLoading.value = loading;
  // We don't show the full screen loading for typing anymore
};

onMounted(() => {
  // Set up router navigation hooks to handle the navigation indicator
  router.beforeEach((to, from, next) => {
    if (to.path.includes('/property/')) {
      isNavigating.value = true;
    }
    next();
  });
  
  router.afterEach(() => {
    // Hide navigation indicator after navigation is complete
    isNavigating.value = false;
  });
});
</script>

<style>
/* Base Styles */
body {
  @apply bg-black;
}

/* Custom Animations */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(0) translateX(20px); }
  75% { transform: translateY(20px) translateX(10px); }
  100% { transform: translateY(0) translateX(0); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-gradient-slow {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

/* Custom Components Styling */
.search-container {
  position: relative;
}

.search-glow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .benefit-card {
    @apply py-4 px-3;
  }
}
</style>