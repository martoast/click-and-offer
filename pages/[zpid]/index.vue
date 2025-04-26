<template>
    <div class="min-h-screen bg-slate-950 text-white">
      <!-- Top-Left Logo -->
    <div class="absolute hidden md:block top-4 left-4 z-20">
      <a href="/">
        <img src="/logo.png" alt="Click&Offer Logo" class="h-10 md:h-12" />
      </a>
      
    </div>
      <!-- Back Button & Property Actions -->
      <div class="container mx-auto px-4 py-4 flex justify-between items-center print:hidden">
        <button
          @click="router.push('/')"
          class="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
          aria-label="Back to search results"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Search
        </button>
  
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-blue-300 text-sm flex items-center" @click="printPage" aria-label="Print property details">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
            Print
          </button>
          <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-blue-300 text-sm flex items-center" @click="shareProperty" aria-label="Share property link">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
            Share
          </button>
        </div>
      </div>
  
      <!-- Loading States -->
      <div v-if="loading || loadingState.images" class="container mx-auto px-4 py-4">
        <!-- Full Loading State -->
        <div v-if="loading" class="py-12 text-center">
          <div class="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-300">Loading property data...</p>
        </div>
        
        <!-- Images Loading Indicator - only shown when basic data is loaded but images are still loading -->
        <div v-else-if="loadingState.images" class="bg-blue-900/20 border border-blue-900/30 rounded-lg px-4 py-2 flex items-center justify-center print:hidden">
          <div class="w-4 h-4 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin mr-3"></div>
          <p class="text-sm text-blue-300">Loading additional images...</p>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-if="error" class="container mx-auto px-4 py-12 text-center">
        <div class="bg-slate-900 border border-slate-800 text-red-500 p-6 rounded-lg max-w-lg mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p class="font-semibold">Failed to load property data</p>
          <p class="text-sm mt-1">{{ error }}</p>
          <button
            @click="fetchPropertyData"
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors print:hidden"
          >
            Try Again
          </button>
        </div>
      </div>
  
      <!-- Property Content -->
      <div v-else-if="property" class="container mx-auto px-4 pb-16 space-y-8">
        <!-- Property Overview Section -->
        <PropertyOverview
          :property="property"
          :mapbox-token="mapboxToken"
        />
  
        <!-- Investment Opportunity Section -->
        <InvestmentOpportunity :property="property" />
      </div>
  
      <div v-else-if="!loading && !error" class="container mx-auto px-4 py-12 text-center text-slate-400 italic">
        Property data could not be loaded or is unavailable.
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PropertyOverview from '~/components/PropertyOverview.vue';
  import InvestmentOpportunity from '~/components/InvestmentOpportunity.vue';
  
  // --- Configuration ---
  const config = useRuntimeConfig();
  const mapboxToken = config.public.MAPBOX_API_TOKEN;
  const zillowApiKey = config.public.ZILLOW_API_KEY;
  const ZILLOW_API_HOST = 'zillow-com1.p.rapidapi.com';
  
  // --- State ---
  const route = useRoute();
  const router = useRouter();
  
  const property = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const loadingState = reactive({
    main: true,
    images: false
  });
  
  // --- Actions ---
  const shareProperty = async () => {
    const address = property.value?.streetAddress || 'Property';
    const city = property.value?.city || '';
    const state = property.value?.state || '';
  
    const shareData = {
      title: `${address}, ${city}, ${state}`,
      text: `Check out this property: ${address}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } else {
        alert('Sharing not supported on this browser.');
      }
    } catch (err) {
      console.error('Error sharing property:', err);
      if (err.name !== 'AbortError') {
        alert('Could not share property.');
      }
    }
  };
  
  const printPage = () => {
    window.print();
  };
  
  // --- API Helper Function ---
  const fetchWithRetry = async (url, options, maxRetries = 2, delayMs = 1000) => {
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, options);
        
        // Handle rate limiting (status 429)
        if (response.status === 429) {
          console.warn(`Rate limit hit, attempt ${retries + 1}/${maxRetries + 1}`);
          retries++;
          
          if (retries <= maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delayMs * retries));
            continue;
          } else {
            throw new Error(`Rate limit exceeded after ${maxRetries} retries`);
          }
        }
        
        // Handle other errors
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`API Error Response (${url}):`, response.status, errorBody);
          throw new Error(`API Error (${response.status}): ${errorBody || 'Failed to fetch data'}`);
        }
        
        return response.json();
      } catch (err) {
        retries++;
        
        if (retries <= maxRetries && !err.message.includes('Rate limit exceeded')) {
          console.warn(`Request failed, retrying (${retries}/${maxRetries})...`, err);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delayMs * retries));
        } else {
          throw err;
        }
      }
    }
  };
  
  // --- Data Fetching with Rate Limiting ---
  const fetchPropertyData = async () => {
    const zpid = route.params.zpid;
    if (!zpid) {
      error.value = 'No property ZPID provided in the URL.';
      loading.value = false;
      return;
    }
    if (!zillowApiKey) {
      error.value = 'Zillow API key is missing or not configured.';
      loading.value = false;
      return;
    }
  
    loading.value = true;
    error.value = null;
    property.value = null;
    loadingState.main = true;
    loadingState.images = false;
    
    try {
      // 1. First fetch property details
      console.log(`Fetching property details for zpid: ${zpid}`);
      
      const fetchedPropertyData = await fetchWithRetry(
        `https://${ZILLOW_API_HOST}/property?zpid=${zpid}`,
        {
          headers: { 
            'X-RapidAPI-Key': zillowApiKey, 
            'X-RapidAPI-Host': ZILLOW_API_HOST 
          }
        }
      );
      
      if (!fetchedPropertyData || !fetchedPropertyData.zpid) {
        throw new Error('Property data not found or incomplete response from API.');
      }
      console.log("Property details fetched successfully");
      
      // Create a temporary version of property with main data
      // This allows showing the basic property details while images are loading
      property.value = {
        ...fetchedPropertyData,
        images: fetchedPropertyData.imgSrc ? [fetchedPropertyData.imgSrc] : []
      };
      
      // Update loading state to indicate that basic data is loaded
      loading.value = false;
      loadingState.main = false;
      loadingState.images = true;
      
      // 2. Wait a bit before fetching images to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Fetch images with its own try/catch to allow partial loading
      try {
        console.log(`Fetching images for zpid: ${zpid}`);
        
        const imagesData = await fetchWithRetry(
          `https://${ZILLOW_API_HOST}/images?zpid=${zpid}`,
          {
            headers: { 
              'X-RapidAPI-Key': zillowApiKey, 
              'X-RapidAPI-Host': ZILLOW_API_HOST 
            }
          }
        );
        
        console.log("Images fetched successfully");
        
        if (imagesData && Array.isArray(imagesData.images) && imagesData.images.length > 0) {
          // Check if main image is already in the array
          const mainImageExists = imagesData.images.some(img => 
            (img.url || img) === fetchedPropertyData.imgSrc
          );
          
          // Update property with images
          property.value = {
            ...fetchedPropertyData,
            images: mainImageExists 
              ? imagesData.images 
              : (fetchedPropertyData.imgSrc 
                  ? [fetchedPropertyData.imgSrc, ...imagesData.images] 
                  : imagesData.images)
          };
        }
      } catch (imageError) {
        console.warn('Failed to fetch images, continuing with basic property data:', imageError);
        // Don't rethrow - we still have the main property data
      } finally {
        // Update loading state when images operation completes
        loadingState.images = false;
      }
      
    } catch (err) {
      console.error('Error during property data fetching process:', err);
      error.value = err.message || 'An unexpected error occurred.';
      property.value = null;
      loading.value = false;
      loadingState.main = false;
      loadingState.images = false;
    }
  };
  
  // --- Lifecycle Hooks ---
  onMounted(() => {
    console.log("Component mounted. Checking config and fetching data...");
    if (!zillowApiKey) {
      error.value = 'Zillow API key configuration is missing.';
      loading.value = false;
      return;
    }
    if (!mapboxToken) {
      console.warn('Mapbox API token configuration is missing. Map will not display.');
    }
    fetchPropertyData();
  });
  </script>
  
  <style>
  /* Global styles, including print styles */
  @media print {
    .print\:hidden { display: none !important; }
    body { background-color: white !important; color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .bg-slate-950, .bg-slate-900, .bg-slate-800, .bg-slate-800\/30, .bg-slate-700 { background-color: white !important; border: 1px solid #eee !important; color: black !important; box-shadow: none !important; }
    .text-white, .text-slate-300, .text-slate-400, .text-slate-500, .text-red-300 { color: black !important; }
    .text-blue-300, .text-blue-400, .text-blue-300\/80 { color: #0044cc !important; }
    .text-green-500, .text-green-400, .text-green-200, .text-green-600, .text-green-800, .text-green-900 { color: #006400 !important; }
    .text-red-500, .text-red-400, .text-red-200, .text-red-600, .text-red-800, .text-red-900 { color: #cc0000 !important; }
    .text-yellow-500, .text-yellow-400, .text-yellow-200, .text-yellow-600, .text-yellow-800 { color: #b8860b !important; }
    .text-orange-500, .text-orange-200, .text-orange-600, .text-orange-800 { color: #cc5500 !important; }
  
    .border-slate-700, .border-slate-800, .border-slate-600, .border-blue-500, .border-transparent, .border-yellow-500, .border-red-500\/50 { border-color: #ccc !important; }
    .border-2 { border-width: 1px !important; }
    .border-dashed { border-style: solid !important; }
  
    .map-container-class, div:has(> .MapDisplay) { display: none !important; }
  
    .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
    .grid { display: block !important; } /* Keep this if children use grid internally */
    .space-y-8 > :not([hidden]) ~ :not([hidden]) { /* Adjust print spacing for stacked */
      margin-top: 1rem !important;
      margin-bottom: 1rem !important;
    }
    h1, h2, h3, h4 { page-break-after: avoid; margin-top: 1rem; margin-bottom: 0.5rem; }
    .result-box { page-break-inside: avoid; }
    img { max-width: 100% !important; height: auto !important; }
    svg { fill: currentColor !important; }
    select.input-field, input.input-field {
      border: 1px solid #ccc !important;
      padding: 2px 4px !important;
      appearance: none !important;
      background-color: white !important;
      color: black !important;
    }
    button { display: none; }
    .print\:hidden { display: none !important; }
  }
  </style>