<template>
    <div class="relative h-full w-full">
      <div ref="mapContainer" class="h-full w-full rounded-lg overflow-hidden"></div>
      
      <!-- Address Search Bar (only shown when specified) -->
      <div 
        v-if="showSearch"
        class="absolute top-4 left-4 right-4 lg:right-auto lg:w-96 z-10"
      >
        <AddressAutocomplete 
          :access_token="accessToken"
          @select-address="handleAddressSelect"
          @loading-state="updateLoadingState"
        />
      </div>
      
      <!-- Reopen Sidebar Button - Only shown when sidebar is closed but we have property data -->
      <div
        v-if="showReopenButton"
        class="absolute right-4 top-4 z-10"
      >
        <button
          @click="$emit('reopen-sidebar')"
          class="px-4 py-2 bg-slate-900 border border-slate-700 shadow-md rounded-md text-sm font-medium text-white hover:bg-slate-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm3 0v14h9V3H6z" clip-rule="evenodd" />
          </svg>
          Show Details
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import {
    ref,
    shallowRef,
    onMounted,
    onBeforeUnmount,
    watch,
    nextTick,
    computed
  } from "vue";
  import AddressAutocomplete from './AddressAutocomplete.vue';
  import { useNuxtApp } from 'nuxt/app';
  
  // Use NuxtApp to access plugins
  const nuxtApp = useNuxtApp();
  const mapboxgl = nuxtApp.mapboxgl;
  
  const props = defineProps({
    accessToken: {
      type: String,
      required: true,
    },
    property: {
      type: Object,
      required: true,
      validator: (prop) =>
        prop &&
        typeof prop.propertyInfo?.latitude === "number" &&
        typeof prop.propertyInfo?.longitude === "number",
    },
    initialZoom: {
      type: Number,
      default: 15,
    },
    sidebarOpen: {
      type: Boolean,
      default: false
    },
    selectedProperty: {
      type: Object,
      default: null
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['update-location', 'loading-state', 'reopen-sidebar']);
  
  const mapContainer = ref(null);
  const map = shallowRef(null);
  const marker = shallowRef(null);
  const mapLoaded = ref(false);
  const isLoading = ref(false);
  
  // Computed property to determine if the reopen button should be shown
  const showReopenButton = computed(() => {
    return !props.sidebarOpen && props.selectedProperty !== null;
  });
  
  const initializeMap = () => {
    if (!mapboxgl || !mapContainer.value || !props.property?.propertyInfo) {
      console.warn("Map initialization prerequisites not met.");
      return;
    }
    try {
      mapboxgl.accessToken = props.accessToken;
      if (map.value) {
        map.value.remove();
        map.value = null;
      }
      map.value = new mapboxgl.Map({
        container: mapContainer.value,
        style: "mapbox://styles/mapbox/dark-v11", // Using dark theme to match app style
        center: [
          props.property.propertyInfo.longitude,
          props.property.propertyInfo.latitude,
        ],
        zoom: props.initialZoom,
        scrollZoom: true,
        cooperativeGestures: true,
      });
      map.value.on("load", () => {
        mapLoaded.value = true;
        console.log("Map loaded");
        addPropertyMarker();
        map.value.addControl(new mapboxgl.NavigationControl(), "top-right");
      });
      map.value.on("error", (e) => {
        console.error("Mapbox error:", e);
      });
    } catch (error) {
      console.error("Error initializing Mapbox map:", error);
    }
  };
  
  const addPropertyMarker = () => {
    if (!map.value || !mapLoaded.value || !props.property?.propertyInfo) return;
    if (marker.value) {
      marker.value.remove();
    }
    
    // Create a custom marker element
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2346bcff" stroke="%23ffffff" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>')`;
    el.style.backgroundSize = '100%';
    
    marker.value = new mapboxgl.Marker({ element: el })
      .setLngLat([
        props.property.propertyInfo.longitude,
        props.property.propertyInfo.latitude,
      ])
      .addTo(map.value);
  };
  
  // Function to handle address selection from the autocomplete
  const handleAddressSelect = (addressData) => {
    if (!map.value || !addressData.coordinates) return;
    
    // Extract coordinates
    const longitude = addressData.longitude;
    const latitude = addressData.latitude;
    
    // Fly to the selected location
    map.value.flyTo({
      center: [longitude, latitude],
      zoom: props.initialZoom,
      essential: true
    });
    
    // Update marker
    if (marker.value) marker.value.remove();
    
    // Create a custom marker element
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2346bcff" stroke="%23ffffff" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>')`;
    el.style.backgroundSize = '100%';
    
    marker.value = new mapboxgl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map.value);
    
    // Emit updated location to parent component
    emit('update-location', addressData);
  };
  
  // Update loading state when autocomplete is loading (pass up to parent)
  const updateLoadingState = (loading) => {
    isLoading.value = loading;
    emit('loading-state', loading);
  };
  
  watch(
    () => props.property,
    (newProperty) => {
      if (map.value && mapLoaded.value && newProperty?.propertyInfo) {
        const newCoords = [
          newProperty.propertyInfo.longitude,
          newProperty.propertyInfo.latitude,
        ];
        map.value.flyTo({
          center: newCoords,
          zoom: props.initialZoom,
          essential: true,
        });
        addPropertyMarker();
      } else if (map.value && !newProperty?.propertyInfo) {
        if (marker.value) {
          marker.value.remove();
          marker.value = null;
        }
      }
    },
    { deep: true }
  );
  
  onMounted(() => {
    if (process.client) {
      nextTick(() => {
        if (mapContainer.value && props.property?.propertyInfo) {
          initializeMap();
        } else {
          if (!mapContainer.value)
            console.warn(
              "MapDisplay: mapContainer ref not ready on mount/nextTick."
            );
          if (!props.property?.propertyInfo)
            console.warn(
              "MapDisplay: Property data with coordinates not available on mount/nextTick."
            );
        }
      });
    }
  });
  
  onBeforeUnmount(() => {
    if (map.value) {
      try {
        map.value.remove();
      } catch (e) {
        console.error("Error removing map:", e);
      }
      map.value = null;
      mapLoaded.value = false;
      marker.value = null;
    }
  });
  </script>
  
  <style>
  @import "mapbox-gl/dist/mapbox-gl.css";
  
  .mapboxgl-popup-content {
    @apply bg-slate-900 text-white border border-slate-700 rounded-lg shadow-lg;
    padding: 12px;
    max-width: 300px;
  }
  
  .mapboxgl-popup-close-button {
    @apply text-slate-300 hover:text-white;
  }
  
  .mapboxgl-ctrl-logo {
    display: none !important;
  }
  
  .mapboxgl-ctrl button {
    @apply bg-slate-800 border border-slate-700 !important;
  }
  
  .mapboxgl-ctrl button span {
    @apply text-white !important;
  }
  
  .mapboxgl-ctrl button:hover {
    @apply bg-slate-700 !important;
  }
  </style>