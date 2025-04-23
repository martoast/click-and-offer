<template>
  <div class="property-display">
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Property Gallery and Map Section (Left Column on Desktop) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Property Gallery Card -->
        <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
          <div class="relative h-96 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
            <img
              :src="selectedImage || property.imgSrc || 'https://via.placeholder.com/800x600/2a3746/FFFFFF?text=No+Image+Available'"
              alt="Property main image"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onImageError"
            />
            <span v-if="!selectedImage && !property.imgSrc" class="text-slate-400">No Image Available</span>
          </div>
          
          <!-- Thumbnail Gallery - Using your exact implementation -->
          <div v-if="property.images && property.images.length > 1" class="mt-4 overflow-x-auto">
            <div class="flex space-x-2 pb-2">
              <div
                v-for="(image, index) in property.images"
                :key="image.url || index"
                class="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2"
                :class="selectedImage === (image.url || image) ? 'border-blue-500' : 'border-transparent hover:border-slate-600'"
                @click="selectImage(image.url || image)"
              >
                <img :src="image.url || image" :alt="`Property image ${index + 1}`" class="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
          <div v-else-if="!property.images || property.images.length <= 1" class="mt-4 text-slate-400 text-sm italic">
            No additional images available.
          </div>
        </div>
        
        <!-- Map Section -->
        <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 h-96 map-container-class">
          <MapDisplay
            v-if="property && property.latitude && property.longitude && mapboxToken"
            :access-token="mapboxToken"
            :property="{ propertyInfo: { latitude: property.latitude, longitude: property.longitude } }"
            :initial-zoom="15"
            :sidebar-open="false"
            :selected-property="property"
            class="h-full rounded-lg overflow-hidden"
          />
          <div v-else class="h-full flex items-center justify-center text-slate-400 italic">
            Map requires valid Mapbox token and property coordinates.
          </div>
        </div>
      </div>
      
      <!-- Property Details Section (Right Column on Desktop) -->
      <div class="space-y-6">
        <!-- Property Header Card -->
        <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">{{ property.streetAddress || 'Address Unavailable' }}</h1>
            <p class="text-slate-400">{{ property.city || 'N/A' }}, {{ property.state || 'N/A' }} {{ property.zipcode || 'N/A' }}</p>
            
            <!-- Quick Stats -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
              <div class="flex items-center text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {{ property.bedrooms || 'N/A' }} bed
              </div>
              
              <div class="flex items-center text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8a1 1 0 00-1-1h-4v3zM9 8H4v3h5V8z" clip-rule="evenodd" />
                </svg>
                {{ property.bathrooms || 'N/A' }} bath
              </div>
              
              <div class="flex items-center text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clip-rule="evenodd" />
                </svg>
                {{ formatNumber(property.livingArea) || 'N/A' }} sqft
              </div>
              
              <div class="flex items-center text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-3.35-4.419 3.35A1 1 0 014 16V4zm2-1h8a1 1 0 011 1v10.72l-3.419-2.6a1 1 0 00-1.162 0L7 14.72V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Built: {{ property.yearBuilt || 'N/A' }}
              </div>
            </div>
          </div>
          
          <!-- Price Info -->
          <div class="mt-6 pt-4 border-t border-slate-700">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between">
              <div class="mb-4 md:mb-0">
                <div class="mb-1"><span class="text-slate-400 text-sm">Zestimate®</span></div>
                <div class="text-blue-300 text-2xl md:text-3xl font-bold">{{ formatPrice(property.zestimate) }}</div>
                <div v-if="property.zestimate && property.livingArea" class="text-sm text-slate-400 mt-1">
                  {{ formatPrice(Math.round(property.zestimate / property.livingArea)) }}/sqft
                </div>
              </div>
              
              <div v-if="property.rentZestimate" class="text-right">
                <div class="mb-0"><span class="text-slate-400 text-sm">Rent Zestimate®</span></div>
                <div class="text-blue-300 text-xl font-semibold">{{ formatPrice(property.rentZestimate) }}/mo</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Property Details Card -->
        <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
          <h2 class="text-xl font-bold mb-4">Property Summary</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Type:</span>
              <span>{{ property.homeType || 'N/A' }}</span>
            </div>
            
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Bedrooms:</span>
              <span>{{ property.bedrooms || 'N/A' }}</span>
            </div>
            
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Bathrooms:</span>
              <span>{{ property.bathrooms || 'N/A' }}</span>
            </div>
            
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Living Area:</span>
              <span>{{ formatNumber(property.livingArea) }} sqft</span>
            </div>
            
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Lot Size:</span>
              <span>{{ formatNumber(property.lotSize) || 'N/A' }} sqft</span>
            </div>
            
            <div class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">Year Built:</span>
              <span>{{ property.yearBuilt || 'N/A' }}</span>
            </div>
            
            <div v-if="property.resoFacts?.hoaFee" class="flex justify-between border-b border-slate-800 py-1">
              <span class="text-slate-400">HOA Fee:</span>
              <span>{{ formatPrice(property.resoFacts.hoaFee) }}/{{ property.resoFacts.hoaFeeFreq || 'mo' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Call To Action -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-5">
          <h3 class="text-white font-bold text-lg mb-2">Ready to get under contract?</h3>
          <p class="text-blue-100 text-sm mb-4">Generate contracts and Documents.</p>
          <button class="w-full bg-white text-blue-700 px-4 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-md">
            Generate LOI & Contract
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import MapDisplay from '~/components/MapDisplay.vue'; // Ensure path is correct

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  mapboxToken: {
    type: String,
    required: false, // Map will show message if not provided
  },
});

// --- Local State for Gallery ---
const selectedImage = ref(null);

// --- Watcher to set initial image ---
watch(() => props.property, (newVal) => {
    if (newVal && newVal.imgSrc) {
        selectedImage.value = newVal.imgSrc;
    } else if (newVal && newVal.images && newVal.images.length > 0) {
        selectedImage.value = newVal.images[0].url || newVal.images[0];
    } else {
        selectedImage.value = null; // Reset if no images
    }
}, { immediate: true }); // Run immediately when component mounts/prop is available

// --- Helper Functions (Duplicated for simplicity, consider composable later) ---
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
  const numericValue = Number(String(num).replace(/[^0-9.-]+/g,""));
  if (isNaN(numericValue)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(numericValue);
};

const onImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/800x600/2a3746/FFFFFF?text=Image+Load+Error';
  event.target.alt = 'Image failed to load';
};

// --- Methods ---
const selectImage = (imageUrl) => {
  selectedImage.value = imageUrl;
};
</script>

<style scoped>
.property-display {
  @apply text-white;
}

/* Print styles for map */
@media print {
  .map-container-class {
    page-break-inside: avoid;
  }
}
</style>