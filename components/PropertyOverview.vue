<template>
  <div class="property-display">
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Property Gallery and Map Section (Left Column on Desktop) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Gallery Card -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <div
            class="relative h-96 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center"
          >
            <img
              :src="
                selectedImage ||
                property.imgSrc ||
                'https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=No+Image+Available'
              "
              alt="Property main image"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onImageError"
            />
            <span
              v-if="!selectedImage && !property.imgSrc"
              class="text-gray-400"
              >No Image Available</span
            >
          </div>
          <!-- Thumbnail Gallery -->
          <div
            v-if="property.images && property.images.length > 1"
            class="mt-4 overflow-x-auto"
          >
            <div class="flex space-x-2 pb-2">
              <div
                v-for="(image, index) in property.images"
                :key="image.url || index"
                class="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2"
                :class="
                  selectedImage === (image.url || image)
                    ? 'border-yellow-gold'
                    : 'border-transparent hover:border-yellow-600'
                "
                @click="selectImage(image.url || image)"
              >
                <img
                  :src="image.url || image"
                  :alt="`Property image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div
            v-else-if="!property.images || property.images.length <= 1"
            class="mt-4 text-gray-400 text-sm italic"
          >
            No additional images available.
          </div>
        </div>
        <!-- Map Section -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 h-46 map-container-class shadow-lg"
        >
          <MapDisplay
            v-if="
              property && property.latitude && property.longitude && mapboxToken
            "
            :access-token="mapboxToken"
            :property="{
              propertyInfo: {
                latitude: property.latitude,
                longitude: property.longitude,
              },
            }"
            :initial-zoom="15"
            :sidebar-open="false"
            :selected-property="property"
            class="h-full rounded-lg overflow-hidden"
          />
          <div
            v-else
            class="h-full flex items-center justify-center text-gray-400 italic"
          >
            Map requires valid Mapbox token and property coordinates.
          </div>
        </div>
      </div>
      <!-- Property Details Section (Right Column on Desktop) -->
      <div class="space-y-6">
        <!-- Property Header Card -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              {{ property.streetAddress || "Address Unavailable" }}
            </h1>
            <p class="text-gray-400">
              {{ property.city || "N/A" }}, {{ property.state || "N/A" }}
              {{ property.zipcode || "N/A" }}
            </p>
            <!-- Quick Stats -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
              <div class="flex items-center text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1 text-yellow-gold"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
                {{ property.bedrooms || "N/A" }} bed
              </div>
              <div class="flex items-center text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1 text-yellow-gold"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8a1 1 0 00-1-1h-4v3zM9 8H4v3h5V8z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ property.bathrooms || "N/A" }} bath
              </div>
              <div class="flex items-center text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1 text-yellow-gold"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ formatNumber(property.livingArea) || "N/A" }} sqft
              </div>
              <div class="flex items-center text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1 text-yellow-gold"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-3.35-4.419 3.35A1 1 0 014 16V4zm2-1h8a1 1 0 011 1v10.72l-3.419-2.6a1 1 0 00-1.162 0L7 14.72V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Built: {{ property.yearBuilt || "N/A" }}
              </div>
            </div>
          </div>
          <!-- Price Info -->
          <div class="mt-6 pt-4 border-t border-yellow-gold/20">
            <div
              class="flex flex-col md:flex-row md:items-end md:justify-between"
            >
              <div class="mb-4 md:mb-0">
                <div class="mb-1">
                  <span class="text-gray-400 text-sm">Zestimate®</span>
                </div>
                <div
                  class="text-yellow-gold text-2xl md:text-3xl font-bold"
                >
                  {{ formatPrice(property.zestimate) }}
                </div>
                <div
                  v-if="property.zestimate && property.livingArea"
                  class="text-sm text-gray-400 mt-1"
                >
                  {{
                    formatPrice(
                      Math.round(property.zestimate / property.livingArea)
                    )
                  }}/sqft
                </div>
              </div>
              <div v-if="property.rentZestimate" class="text-right">
                <div class="mb-0">
                  <span class="text-gray-400 text-sm">Rent Zestimate®</span>
                </div>
                <div class="text-yellow-gold text-xl font-semibold">
                  {{ formatPrice(property.rentZestimate) }}/mo
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Property Details Card -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            Property Summary
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Type:</span>
              <span class="text-white font-medium">{{ property.homeType || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Bedrooms:</span>
              <span class="text-white font-medium">{{ property.bedrooms || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Bathrooms:</span>
              <span class="text-white font-medium">{{ property.bathrooms || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Living Area:</span>
              <span class="text-white font-medium">{{ formatNumber(property.livingArea) }} sqft</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Lot Size:</span>
              <span class="text-white font-medium">{{ formatNumber(property.lotSize) || "N/A" }} sqft</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Year Built:</span>
              <span class="text-white font-medium">{{ property.yearBuilt || "N/A" }}</span>
            </div>
            <div
              v-if="property.resoFacts?.hoaFee"
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">HOA Fee:</span>
              <span class="text-white font-medium"
                >{{ formatPrice(property.resoFacts.hoaFee) }}/{{
                  property.resoFacts.hoaFeeFreq || "mo"
                }}</span
              >
            </div>
          </div>
        </div>
        <!-- Call To Action -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg shadow-lg p-6 border border-yellow-gold/30"
        >
          <div class="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-gold mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 class="text-white font-bold text-lg">
              Ready to get under contract?
            </h3>
          </div>
          <p class="text-gray-300 text-sm mb-4 pl-8">
            Generate contracts and Documents.
          </p>
          <button
            class="w-full bg-gradient-to-r from-yellow-600 to-yellow-gold px-4 py-3 rounded-lg font-bold text-sm text-black hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 relative overflow-hidden group"
          >
            <span class="relative z-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 14.584l-4.419 2.23A1 1 0 014 16V4z"
                  clip-rule="evenodd"
                />
              </svg>
              Generate LOI & Contract
              <span class="ml-2">→</span>
            </span>
            <span
              class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import MapDisplay from "~/components/MapDisplay.vue"; // Ensure path is correct
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
watch(
  () => props.property,
  (newVal) => {
    if (newVal && newVal.imgSrc) {
      selectedImage.value = newVal.imgSrc;
    } else if (newVal && newVal.images && newVal.images.length > 0) {
      selectedImage.value = newVal.images[0].url || newVal.images[0];
    } else {
      selectedImage.value = null; // Reset if no images
    }
  },
  { immediate: true }
); // Run immediately when component mounts/prop is available
// --- Helper Functions (Duplicated for simplicity, consider composable later) ---
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};
const formatNumber = (num) => {
  if (num == null || isNaN(num)) return "N/A";
  const numericValue = Number(String(num).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericValue)) return "N/A";
  return new Intl.NumberFormat("en-US").format(numericValue);
};
const onImageError = (event) => {
  event.target.src =
    "https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+Load+Error";
  event.target.alt = "Image failed to load";
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