<template>
    <div class="min-h-screen bg-slate-950 text-white">
      <!-- Back Button -->
      <div class="container mx-auto px-4 py-4">
        <button 
          @click="router.push('/')" 
          class="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Search
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
        <div class="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-300">Loading property data...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="container mx-auto px-4 py-12 text-center">
        <div class="bg-slate-900 border border-slate-800 text-red-500 p-6 rounded-lg max-w-lg mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ error }}</p>
          <button 
            @click="fetchPropertyData" 
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Property Content -->
      <div v-else-if="property" class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Map Section -->
          <div class="w-full lg:w-1/2 xl:w-2/5 h-96 lg:h-auto bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
            <MapDisplay
              v-if="property && mapboxToken"
              :access-token="mapboxToken"
              :property="{ propertyInfo: { latitude: property.latitude, longitude: property.longitude } }"
              :initial-zoom="15"
              :sidebar-open="false"
              :selected-property="property"
            />
          </div>
          
          <!-- Property Details -->
          <div class="w-full lg:w-1/2 xl:w-3/5">
            <!-- Property Header -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
              <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ property.streetAddress }}</h1>
              <p class="text-slate-400">{{ property.city }}, {{ property.state }} {{ property.zipcode }}</p>
              <div class="flex flex-wrap items-center gap-4 mt-4">
                <span class="text-blue-300 text-2xl font-bold">{{ formatPrice(property.price) }}</span>
                <div class="flex space-x-4 text-slate-300">
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {{ property.bedrooms || 'N/A' }} bed
                  </span>
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8a1 1 0 00-1-1h-4v3zM9 8H4v3h5V8z" clip-rule="evenodd" />
                    </svg>
                    {{ property.bathrooms || 'N/A' }} bath
                  </span>
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clip-rule="evenodd" />
                    </svg>
                    {{ formatNumber(property.livingArea) || 'N/A' }} sqft
                  </span>
                </div>
              </div>
              
              <!-- Make Offer Button -->
              <button class="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
                Make an Offer
              </button>
            </div>
            
            <!-- Property Images Carousel -->
            <div v-if="property.images && property.images.length" class="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
              <h2 class="text-xl font-semibold mb-4">Property Images</h2>
              <div class="overflow-x-auto -mx-6">
                <div class="flex space-x-4 px-6">
                  <div 
                    v-for="(image, index) in property.images.slice(0, 10)" 
                    :key="index" 
                    class="flex-shrink-0 w-72 h-48 overflow-hidden rounded-lg"
                  >
                    <img :src="image" :alt="`Property image ${index + 1}`" class="w-full h-full object-cover"/>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Property Details Table -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
              <h2 class="text-xl font-semibold mb-4">Property Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Year Built</p>
                  <p class="font-semibold">{{ property.yearBuilt || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Lot Size</p>
                  <p class="font-semibold">{{ formatNumber(property.lotSize) || 'N/A' }} sqft</p>
                </div>
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Home Type</p>
                  <p class="font-semibold">{{ property.homeType || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Zestimate</p>
                  <p class="font-semibold">{{ formatPrice(property.zestimate) || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Tax Assessment</p>
                  <p class="font-semibold">{{ formatPrice(property.taxAssessment) || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-slate-950 rounded border border-slate-800">
                  <p class="text-slate-400 text-sm">Rent Estimate</p>
                  <p class="font-semibold">{{ formatPrice(property.rentZestimate) || 'N/A' }}/mo</p>
                </div>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="property.description" class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-semibold mb-4">Description</h2>
              <p class="text-slate-300 whitespace-pre-line">{{ property.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MapDisplay from '~/components/MapDisplay.vue';
  
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();
  const mapboxToken = config.public.MAPBOX_API_TOKEN;
  const zillowApiKey = config.public.ZILLOW_API_KEY;
  
  const property = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  // Format price with commas and dollar sign
  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Format numbers with commas
  const formatNumber = (num) => {
    if (!num) return null;
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Fetch property data from Zillow API using zpid
  const fetchPropertyData = async () => {
    const zpid = route.params.zpid;
    if (!zpid) {
      error.value = 'No property ID provided';
      loading.value = false;
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Fetch property details from Zillow API
      const response = await fetch(`https://zillow-com1.p.rapidapi.com/property?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': zillowApiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch property data. Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Check if we have basic property data
      if (!data || !data.zpid) {
        throw new Error('Property not found or data incomplete');
      }
      
      // If we have a zpid, fetch images
      if (data.zpid) {
        try {
          const imagesResponse = await fetch(`https://zillow-com1.p.rapidapi.com/images?zpid=${data.zpid}`, {
            headers: {
              'X-RapidAPI-Key': zillowApiKey,
              'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
          });
          
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            if (imagesData.images && Array.isArray(imagesData.images)) {
              data.images = imagesData.images;
            }
          }
        } catch (imageError) {
          console.error('Error fetching Zillow images:', imageError);
          // We'll continue without images if they fail to load
        }
      }
      
      property.value = data;
    } catch (err) {
      console.error('Error fetching property data:', err);
      error.value = err.message || 'Failed to load property data';
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    if (!zillowApiKey) {
      error.value = 'Zillow API key is missing. Check your environment variables.';
      loading.value = false;
      return;
    }
    
    fetchPropertyData();
  });
  </script>