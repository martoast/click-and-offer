<template>
    <div class="bg-slate-950 min-h-screen text-white">
      <!-- Hero Section with Search -->
      <section class="relative py-16 bg-gradient-to-r from-indigo-950 to-blue-800">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="flex justify-center mb-8">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide">
              <span class="text-blue-300">Click</span>
              <span class="text-white">&Offer</span>
            </h1>
          </div>
          
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">Find Your Dream Property</h2>
            <p class="text-slate-300 text-lg">Search any address to explore details and make offers instantly</p>
          </div>
          
          <!-- Search Box -->
          <div class="max-w-2xl mx-auto">
            <AddressAutocomplete 
              :access_token="mapboxToken"
              @select-address="handleAddressSelect"
              @loading-state="updateLoadingState"
            />
          </div>
        </div>
      </section>
      
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-xl text-center">
          <div class="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-300">Searching property data...</p>
        </div>
      </div>
      
      <!-- Featured Properties Section -->
      <section class="py-16">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="flex justify-between items-center mb-12">
            <h2 class="text-2xl font-bold">Featured Properties</h2>
            <NuxtLink to="/listings" class="text-blue-300 hover:text-blue-200 font-semibold flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Sample Property Cards -->
            <div v-for="i in 3" :key="i" class="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 group transition-all duration-300 hover:border-blue-600">
              <div class="h-48 bg-slate-800 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50"></div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">Modern Luxury Home</h3>
                <p class="text-slate-400 mb-4">123 Example Street, Cityville</p>
                <div class="flex justify-between">
                  <span class="text-blue-300 font-bold">$1,250,000</span>
                  <div class="text-slate-300 flex space-x-3">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      4
                    </span>
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8a1 1 0 00-1-1h-4v3zM9 8H4v3h5V8z" clip-rule="evenodd" />
                      </svg>
                      3
                    </span>
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clip-rule="evenodd" />
                      </svg>
                      2,100
                    </span>
                  </div>
                </div>
              </div>
              <!-- View Details Button -->
              <div class="bg-slate-800 px-6 py-3 mt-2">
                <NuxtLink to="/" class="text-blue-300 hover:text-blue-200 font-medium flex items-center justify-end">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Value Proposition -->
      <section class="py-16 bg-slate-900">
        <div class="container mx-auto px-4 max-w-7xl">
          <h2 class="text-2xl font-bold mb-12 text-center">Why Choose Click&Offer</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 rounded-lg bg-slate-950 border border-slate-800">
              <div class="inline-flex items-center justify-center p-3 bg-blue-900 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Real-Time Location Data</h3>
              <p class="text-slate-400">Get precise location information and neighborhood insights using advanced mapping technology</p>
            </div>
            
            <div class="text-center p-6 rounded-lg bg-slate-950 border border-slate-800">
              <div class="inline-flex items-center justify-center p-3 bg-blue-900 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Instant Price Estimates</h3>
              <p class="text-slate-400">Access accurate property valuations and price history powered by Zillow's comprehensive database</p>
            </div>
            
            <div class="text-center p-6 rounded-lg bg-slate-950 border border-slate-800">
              <div class="inline-flex items-center justify-center p-3 bg-blue-900 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Detailed Analytics</h3>
              <p class="text-slate-400">View comprehensive property metrics including market trends, tax history, and comparable sales</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import AddressAutocomplete from '~/components/AddressAutocomplete.vue';
  
  const router = useRouter();
  const config = useRuntimeConfig();
  const mapboxToken = config.public.MAPBOX_API_TOKEN;
  const isLoading = ref(false);
  
  // Handle the selected address from the autocomplete
  const handleAddressSelect = (addressData) => {
    // If we have a Zillow property ID, navigate to the property page
    if (addressData?.zillow?.zpid) {
      router.push(`/${addressData.zillow.zpid}`);
    } else {
      // If no zpid, possibly handle error or create a new property page
      console.error('No Zillow property ID found for this address');
      // Could show an error notification here
    }
  };
  
  // Update loading state
  const updateLoadingState = (loading) => {
    isLoading.value = loading;
  };
  
  onMounted(() => {
    if (!mapboxToken) {
      console.error('Mapbox API token is missing. Check your environment variables.');
    }
  });
  </script>
  
  <style>
  body {
    @apply bg-slate-950;
  }
  
  .mapboxgl-ctrl-geocoder {
    @apply w-full max-w-none !important;
    @apply bg-slate-900 text-white border border-slate-700 rounded-lg shadow-lg !important;
  }
  
  .mapboxgl-ctrl-geocoder--input {
    @apply bg-slate-900 text-white placeholder-slate-400 !important;
    @apply focus:ring-blue-400 focus:border-blue-400 !important;
  }
  
  .mapboxgl-ctrl-geocoder--button {
    @apply text-slate-400 hover:text-white !important;
  }
  
  .mapboxgl-ctrl-geocoder--suggestion {
    @apply text-white bg-slate-800 !important;
  }
  
  .mapboxgl-ctrl-geocoder--suggestion-title {
    @apply text-white !important;
  }
  
  .mapboxgl-ctrl-geocoder--suggestion-address {
    @apply text-slate-300 !important;
  }
  
  .mapboxgl-ctrl-geocoder--suggestion:hover {
    @apply bg-blue-800 !important;
  }
  </style>