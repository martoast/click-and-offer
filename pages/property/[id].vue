<template>
  <div class="min-h-screen bg-black text-white">
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
        class="flex items-center text-yellow-gold-light hover:text-blue-200 transition-colors"
        aria-label="Back to search results"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Search
      </button>

      <div class="flex space-x-2">
        <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-yellow-gold-light text-sm flex items-center" @click="printPage" aria-label="Print property details">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
          Print
        </button>
        <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-yellow-gold-light text-sm flex items-center" @click="shareProperty" aria-label="Share property link">
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
        <p class="text-sm text-yellow-gold-light">Loading additional images...</p>
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
    <div v-else-if="zillowData" class="container mx-auto px-4 pb-16 space-y-8">
      <!-- Property Overview Section -->
      <PropertyOverview
        :property="zillowData"
        :reapi_property="realEstateData"
        :mapbox-token="mapboxToken"
      />

      <PropertyComps 
        v-if="realEstateData && realEstateData.comps && realEstateData.comps.length > 0"
        :data="realEstateData"
        :mapbox-token="mapboxToken"
      />

      <!-- Investment Opportunity Section -->
      <InvestmentOpportunity :property="zillowData" />
    </div>

    <div v-else-if="!loading && !error" class="container mx-auto px-4 py-12 text-center text-slate-400 italic">
      Property data could not be loaded or is unavailable.
    </div>

  </div>
</template>

  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
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
  
  const realEstateData = ref(null);
  const zillowData = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const loadingState = reactive({
    realEstate: true,
    zillow: false,
    images: false
  });
  
  // Computed property that combines both data sources
  const property = computed(() => {
    if (!realEstateData.value) return null;
    
    return {
      ...realEstateData.value,
      zillow: zillowData.value || {}
    };
  });
  
  // --- Actions ---
  const shareProperty = async () => {
    const address = realEstateData.value?.propertyInfo?.address?.label || 'Property';
    
    const shareData = {
      title: `${address}`,
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
  
  // --- Data Fetching Functions ---
  const fetchPropertyData = async () => {
    const propertyId = route.params.id;
    
    if (!propertyId) {
      error.value = 'No property ID provided in the URL.';
      loading.value = false;
      return;
    }
  
    loading.value = true;
    error.value = null;
    realEstateData.value = null;
    zillowData.value = null;
    loadingState.realEstate = true;
    
    try {
      // Determine if the ID is a numeric ID or an encoded address
      const requestBody = {};
      
      if (/^\d+$/.test(propertyId)) {
        // If it's numeric, use it as an ID
        requestBody.id = propertyId;
      } else {
        // Otherwise, assume it's an encoded address
        requestBody.address = decodeURIComponent(propertyId);
      }
      
      // Call the Real Estate API through our server middleware
      console.log(`Fetching property details from Real Estate API for: ${propertyId}`);
      const response = await fetch('/api/real-estate/PropertyDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestBody,
          comps: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.data) {
        throw new Error('Property data not found or incomplete response from API.');
      }
      
      console.log("Property details fetched successfully from Real Estate API");
      realEstateData.value = data.data;
      loadingState.realEstate = false;
      
      // Fetch Zillow data if we have a valid address
      if (realEstateData.value?.propertyInfo?.address?.label) {
        fetchZillowData(realEstateData.value.propertyInfo.address.label);
      } else {
        // No valid address, skip Zillow API
        loading.value = false;
      }
      
    } catch (err) {
      console.error('Error during property data fetching from Real Estate API:', err);
      error.value = err.message || 'Failed to load property data.';
      loading.value = false;
      loadingState.realEstate = false;
    }
  };
  
  const fetchZillowData = async (formattedAddress) => {
    if (!formattedAddress || !zillowApiKey) {
      loading.value = false;
      return;
    }
    
    loadingState.zillow = true;
    
    try {
      console.log(`Finding Zillow property for address: ${formattedAddress}`);
      
      // 1. First try to search for the property by address
      const encodedAddress = encodeURIComponent(formattedAddress);
      const searchWithParamsUrl = `https://${ZILLOW_API_HOST}/propertyExtendedSearch?location=${encodedAddress}`;
      
      const searchData = await fetchWithRetry(
        searchWithParamsUrl,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': zillowApiKey, 
            'X-RapidAPI-Host': ZILLOW_API_HOST
          }
        }
      );

      if (!searchData.zpid) {
        console.log("no zpid found");
        return
      }
      
      console.log(searchData.zpid)
      // 2. Get the first result's zpid
      const zpid = searchData.zpid;
      console.log(`Found Zillow property with zpid: ${zpid}`);
      
      // Now fetch property details using zpid
      await fetchZillowPropertyDetails(zpid);
      
    } catch (err) {
      console.warn('Error finding Zillow property:', err);
      // Don't set the main error - we still have Real Estate API data
      loadingState.zillow = false;
      loading.value = false;
    }
  };
  
  const fetchZillowPropertyDetails = async (zpid) => {
    if (!zpid || !zillowApiKey) {
      loadingState.zillow = false;
      loading.value = false;
      return;
    }
    
    try {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 1. Fetch property details
      console.log(`Fetching Zillow property details for zpid: ${zpid}`);
      
      const fetchedPropertyData = await fetchWithRetry(
        `https://${ZILLOW_API_HOST}/property?zpid=${zpid}`,
        {
          method: 'GET',
          headers: { 
            'X-RapidAPI-Key': zillowApiKey, 
            'X-RapidAPI-Host': ZILLOW_API_HOST 
          }
        }
      );
      
      if (!fetchedPropertyData || !fetchedPropertyData.zpid) {
        throw new Error('Zillow property data not found or incomplete response from API.');
      }
      
      console.log("Zillow property details fetched successfully");
      
      // Create a temporary version with the main data
      zillowData.value = {
        ...fetchedPropertyData,
        images: fetchedPropertyData.imgSrc ? [fetchedPropertyData.imgSrc] : []
      };
      
      // Update loading state for images
      loadingState.zillow = false;
      loadingState.images = true;
      
      // 2. Fetch images with its own try/catch to allow partial loading
      await fetchZillowImages(zpid, fetchedPropertyData);
      
    } catch (err) {
      console.error('Error during Zillow property data fetching:', err);
      loadingState.zillow = false;
      loadingState.images = false;
      loading.value = false;
    }
  };
  
  const fetchZillowImages = async (zpid, propertyData) => {
    try {
      // Wait a bit before fetching images to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Fetching Zillow images for zpid: ${zpid}`);
      
      const imagesData = await fetchWithRetry(
        `https://${ZILLOW_API_HOST}/images?zpid=${zpid}`,
        {
          method: 'GET',
          headers: { 
            'X-RapidAPI-Key': zillowApiKey, 
            'X-RapidAPI-Host': ZILLOW_API_HOST 
          }
        }
      );
      
      console.log("Zillow images fetched successfully");
      
      if (imagesData && Array.isArray(imagesData.images) && imagesData.images.length > 0) {
        // Check if main image is already in the array
        const mainImageExists = imagesData.images.some(img => 
          (img.url || img) === propertyData.imgSrc
        );
        
        // Update property with images
        zillowData.value = {
          ...propertyData,
          images: mainImageExists 
            ? imagesData.images 
            : (propertyData.imgSrc 
                ? [propertyData.imgSrc, ...imagesData.images] 
                : imagesData.images)
        };
      }
    } catch (imageError) {
      console.warn('Failed to fetch Zillow images, continuing with basic property data:', imageError);
      // Don't rethrow - we still have the main property data
    } finally {
      // Update loading state when images operation completes
      loadingState.images = false;
      loading.value = false;
    }
  };
  
  // --- Lifecycle Hooks ---
  onMounted(() => {
    console.log("Property page component mounted. Checking config and fetching data...");
    
    // Validate configuration
    if (!mapboxToken) {
      console.warn('Mapbox API token configuration is missing. Map will not display.');
    }
    
    // Fetch property data
    fetchPropertyData();
  });
  </script>