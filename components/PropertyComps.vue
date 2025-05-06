<template>
  <div class="bg-gradient-to-br from-black to-gray-900 rounded-xl border border-yellow-gold/30 shadow-xl overflow-hidden mb-8">
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
      
      <!-- Table Section - Full width on mobile, 60% width on large screens -->
      <div class="lg:w-3/5">
        <!-- Comps Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-gray-900/80 text-gray-400 border-b border-yellow-gold/30">
              <tr>
                <th scope="col" class="p-4">Address</th>
                <th scope="col" class="p-4">Price</th>
                <th scope="col" class="p-4">Size</th>
                <th scope="col" class="p-4 text-center">Bed/Bath</th>
                <th scope="col" class="p-4 text-center">Year Built</th>
                <th scope="col" class="p-4 text-center">Sale Date</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(comp, index) in sortedComps" 
                :key="comp.id" 
                :class="[
                  index % 2 === 0 ? 'bg-black/30' : 'bg-gray-900/60',
                  hoveredCompId === comp.id ? 'bg-gray-800/70' : ''
                ]"
                class="border-b border-yellow-gold/20 hover:bg-gray-800/40 transition-colors"
                @mouseenter="hoveredCompId = comp.id"
                @mouseleave="hoveredCompId = null"
              >
                <td class="p-4 text-gray-300 font-medium">
                  {{ comp.address?.address || 'N/A' }}
                </td>
                <td class="p-4">
                  <div class="text-white font-medium">{{ formatPrice(comp.lastSaleAmount || comp.estimatedValue) }}</div>
                  <div class="text-xs text-gray-500">{{ formatPrice(calculatePricePerSqFt(comp)) }}/sqft</div>
                </td>
                <td class="p-4 text-gray-300">{{ formatNumber(comp.squareFeet) }} sqft</td>
                <td class="p-4 text-center text-gray-300">{{ comp.bedrooms || 'N/A' }} / {{ comp.bathrooms || 'N/A' }}</td>
                <td class="p-4 text-center text-gray-300">{{ comp.yearBuilt || 'N/A' }}</td>
                <td class="p-4 text-center text-gray-300">{{ formatDate(comp.lastSaleDate) }}</td>
              </tr>
              
              <tr v-if="sortedComps.length === 0" class="bg-black/30 border-b border-yellow-gold/20">
                <td colspan="6" class="p-8 text-center text-gray-500 italic">
                  No comparable properties found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import CompsMap from './CompsMap.vue';

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