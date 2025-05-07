<template>
  <div class="bg-black rounded-xl border border-yellow-gold/30 shadow-xl overflow-hidden mb-8">
    <!-- Header -->
    <div class="p-6 border-b border-yellow-gold/30 flex items-center justify-between bg-black/50">
      <h2 class="text-xl font-bold flex items-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Comparable Properties
      </h2>
      <div class="flex items-center">
        <span class="bg-yellow-gold/10 text-yellow-gold text-xs px-3 py-1 rounded-full font-medium">{{ filteredComps.length }} Properties</span>
      </div>
    </div>
    
    <!-- Responsive Content Container -->
    <div class="lg:flex">
      <!-- Map Section - Full width on mobile, 40% width on large screens -->
      <div class="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-yellow-gold/30 bg-black/30">
        <div class="p-6">
          <CompsMap 
            :property="mapProperty" 
            :hoveredCompId="hoveredCompId" 
            @markerHovered="onMarkerHovered" 
          />
        </div>
      </div>
      
      <!-- Properties Grid Section -->
      <div class="lg:w-3/5 overflow-y-auto max-h-[800px]">
        <!-- Filters/Sort Controls (optional) -->
        <div class="px-4 pt-4 pb-2 flex justify-between items-center">
          <h3 class="text-white text-sm font-medium">Comparable Properties</h3>
          <div class="text-xs text-gray-400">Sorted by: Most Recent</div>
        </div>
        
        <!-- Properties List -->
        <div class="px-4 space-y-3">
          <div 
            v-for="comp in sortedComps" 
            :key="comp.id" 
            :class="[
              'flex rounded-lg transition-all duration-200',
              hoveredCompId === comp.id ? 'bg-gray-800/70 shadow-lg' : 'bg-gray-900/30',
            ]"
            @mouseenter="hoveredCompId = comp.id"
            @mouseleave="hoveredCompId = null"
          >
            <!-- Property Image (left side) -->
            <div class="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-l-lg overflow-hidden">
              <img 
                :src="getStreetViewImageUrl(comp)" 
                :alt="`Street view of ${comp.address?.address || 'property'}`"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <!-- Property Details (right side) -->
            <div class="flex-1 p-3 flex flex-col justify-between">
              <!-- Top Row -->
              <div>
                <p class="text-white text-sm font-medium truncate">{{ comp.address?.address || 'N/A' }}</p>
                <p class="text-yellow-gold text-lg font-semibold mt-1">{{ formatPrice(comp.lastSaleAmount || comp.estimatedValue) }}</p>
              </div>
              
              <!-- Bottom Row - Property Specs -->
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                <div class="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {{ formatNumber(comp.squareFeet) }} sqft
                </div>
                <div class="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  {{ comp.bedrooms || 'N/A' }} bed / {{ comp.bathrooms || 'N/A' }} bath
                </div>
                <div class="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  {{ formatDate(comp.lastSaleDate) }}
                </div>
                <div class="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
                  </svg>
                  {{ comp.yearBuilt || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="sortedComps.length === 0" class="p-8 text-center text-gray-500 italic bg-black/30 rounded-lg">
            No comparable properties found.
          </div>
        </div>
        
        <!-- Bottom Padding -->
        <div class="h-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import CompsMap from './CompsMap.vue';

const config = useRuntimeConfig();
const google_api_key = config.public.GOOGLE_MAPS_API_KEY;

const props = defineProps({
  // The entire Real Estate API data object that contains property and comps
  data: {
    type: Object,
    required: true
  },
  // Mapbox token for map display
  mapboxToken: {
    type: String,
    default: ''
  }
});

// State for tracking hovered comp IDs
const hoveredCompId = ref(null);

// Handle marker hover events from the map
const onMarkerHovered = (compId) => {
  hoveredCompId.value = compId;
};

// Get Google Street View image for a property
const getStreetViewImageUrl = (property) => {
  if (!property.latitude || !property.longitude) return "/placeholder.png";
  return `https://maps.googleapis.com/maps/api/streetview?location=${property.latitude},${property.longitude}&size=400x300&key=${google_api_key}`;
};

// Computed properties
// Get the comparable properties array from the data
const comps = computed(() => {
  return props.data.comps || [];
});

// Filter comps to only those with complete information
// Filter comps to only those with complete information and estimatedValue
const filteredComps = computed(() => {
  return comps.value.filter(comp => {
    // Make sure estimatedValue exists and is greater than 0
    const hasEstimatedValue = comp.estimatedValue && Number(comp.estimatedValue) > 0;
    // Check other required info
    const hasSqFt = comp.squareFeet > 0;
    const hasLocation = comp.latitude && comp.longitude;
    const hasAddress = comp.address?.address;
    
    return hasEstimatedValue && hasSqFt && hasLocation && hasAddress;
  });
});

// Sort filtered comps by sale date (newest first)
const sortedComps = computed(() => {
  return [...filteredComps.value].sort((a, b) => {
    const dateA = a.lastSaleDate ? new Date(a.lastSaleDate) : new Date(0);
    const dateB = b.lastSaleDate ? new Date(b.lastSaleDate) : new Date(0);
    return dateB - dateA; // Newest first
  });
});

// Create a formatted property object for the map component
const mapProperty = computed(() => {
  return {
    propertyInfo: {
      // Use the correct property coordinates from propertyInfo
      longitude: props.data.propertyInfo?.longitude || 0,
      latitude: props.data.propertyInfo?.latitude || 0,
      address: {
        label: props.data.address?.address || 'Unknown Address'
      },
      bedrooms: props.data.bedrooms || 0,
      bathrooms: props.data.bathrooms || 0,
      livingSquareFeet: props.data.squareFeet || 0
    },
    estimatedValue: props.data.estimatedValue || 0,
    comps: filteredComps.value // Use filtered comps for the map
  };
});


// Get the subject property details
const subject = computed(() => {
  return props.data;
});

const subjectPrice = computed(() => {
  return subject.value.estimatedValue || 
         subject.value.lastSaleAmount || 
         0;
});

const subjectSqFt = computed(() => {
  return subject.value.propertyInfo?.buildingSquareFeet || 
         0;
});

const subjectPricePerSqFt = computed(() => {
  if (!subjectSqFt.value || subjectSqFt.value === 0) return 0;
  return (subjectPrice.value / subjectSqFt.value);
});

// Use filtered comps for calculations
const averagePrice = computed(() => {
  if (!filteredComps.value.length) return 0;
  const prices = filteredComps.value.map(comp => comp.lastSaleAmount || comp.estimatedValue || 0).filter(p => p > 0);
  if (!prices.length) return 0;
  return prices.reduce((sum, price) => sum + Number(price), 0) / prices.length;
});

const averagePricePerSqFt = computed(() => {
  if (!filteredComps.value.length) return 0;
  
  const validComps = filteredComps.value.filter(comp => {
    const price = comp.lastSaleAmount || comp.estimatedValue || 0;
    const sqFt = comp.squareFeet || 0;
    return price > 0 && sqFt > 0;
  });
  
  if (!validComps.length) return 0;
  
  const pricesPerSqFt = validComps.map(comp => {
    const price = Number(comp.lastSaleAmount || comp.estimatedValue || 0);
    const sqFt = Number(comp.squareFeet || 0);
    return price / sqFt;
  });
  
  return pricesPerSqFt.reduce((sum, price) => sum + price, 0) / pricesPerSqFt.length;
});

const priceDifferential = computed(() => {
  if (!averagePrice.value) return 0;
  return ((subjectPrice.value - averagePrice.value) / averagePrice.value) * 100;
});

const averageSoldPrice = computed(() => {
  if (!filteredComps.value.length) return 0;
  
  const soldProperties = filteredComps.value
    .filter(comp => comp.lastSaleAmount && comp.lastSaleAmount > 0);
  
  if (!soldProperties.length) return 0;
  
  const totalPrice = soldProperties.reduce((sum, comp) => sum + Number(comp.lastSaleAmount), 0);
  return totalPrice / soldProperties.length;
});

// Helper functions
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return 'N/A';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(price);
};

const formatNumber = (num) => {
  if (num == null || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const calculatePricePerSqFt = (comp) => {
  const price = Number(comp.lastSaleAmount || comp.estimatedValue || 0);
  const sqFt = Number(comp.squareFeet || 0);
  
  if (!price || !sqFt) return 0;
  return price / sqFt;
};
</script>

<style scoped>
@media print {
  .print-hidden {
    display: none !important;
  }
  
  .table-container {
    page-break-inside: avoid;
  }
}
</style>