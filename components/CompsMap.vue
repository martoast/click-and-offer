<template>
  <div class="relative w-full h-[50vh] md:h-[100vh]">
    <!-- Legend for the map -->
    <div class="absolute top-4 right-4 z-10">
      <div class="bg-gray-800/80 backdrop-blur p-2 rounded-lg shadow-lg">
        <div class="text-xs text-white font-medium mb-2">Property Types</div>
        <div class="flex items-center mb-1.5">
          <div class="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
          <span class="text-xs text-white">Subject Property</span>
        </div>
        <div class="flex items-center mb-1.5">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-xs text-white">Comparable</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span class="text-xs text-white">Selected Comparable</span>
        </div>
      </div>
    </div>
    
    <!-- Empty container for map -->
    <div id="comps-map" ref="mapContainer" class="h-full border border-gray-700 shadow-sm rounded-lg"></div>
  </div>
</template>
<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';
const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  hoveredCompId: {
    type: String,
    default: null
  }
});
const emit = defineEmits(['markerHovered']);
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const mapboxgl = nuxtApp.mapboxgl;
const access_token = config.public.MAPBOX_API_TOKEN;
const mapContainer = ref(null);
const map = shallowRef(null);
const markers = ref(new Map());
const formatValue = (value) => {
  if (!value) return 'N/A';
  return value.toLocaleString();
};
const highlightMarker = (compId) => {
  if (!markers.value) return;
  
  markers.value.forEach((markerData, id) => {
    if (id === 'main') return;
    
    const currentScale = id === compId ? 1.2 : 0.8;
    const currentColor = id === compId ? "#ef4444" : "#22c55e";
    
    if (markerData.marker) {
      markerData.marker.remove();
    }
    
    const newMarker = new mapboxgl.Marker({
      color: currentColor,
      scale: currentScale
    })
      .setLngLat(markerData.lngLat)
      .setPopup(markerData.popup)
      .addTo(map.value);
    
    markerData.marker = newMarker;
  });
};
watch(() => props.hoveredCompId, (newId) => {
  if (map.value) {
    highlightMarker(newId);
  }
});
const cleanupMap = () => {
  // Remove all markers
  markers.value.forEach((markerData) => {
    if (markerData.marker) {
      markerData.marker.remove();
    }
  });
  markers.value.clear();
  // Remove map
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
};
const initMap = () => {
  // Check if mapboxgl is supported
  if (!mapboxgl.supported()) {
    console.error('MapboxGL is not supported in this browser');
    return;
  }
  // Clean up any existing map instance
  cleanupMap();
  // Set access token
  mapboxgl.accessToken = access_token;
  try {
    // Create bounds
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([props.property.propertyInfo.longitude, props.property.propertyInfo.latitude]);
    props.property.comps.forEach(comp => bounds.extend([comp.longitude, comp.latitude]));
    // Initialize map
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/mapbox/dark-v11", // Use a dark theme for better contrast
      bounds: bounds,
      fitBoundsOptions: { padding: 50, maxZoom: 15 },
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: true
    });
    // Add markers once map is loaded
    map.value.once('load', () => {
      // Custom styles for popups and controls
      const customStyles = `
        /* Popup styling */
        .mapboxgl-popup-content {
          background-color: rgba(17, 24, 39, 0.95); /* very dark gray with opacity */
          color: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        .mapboxgl-popup-tip {
          border-top-color: rgba(17, 24, 39, 0.95) !important;
          border-bottom-color: rgba(17, 24, 39, 0.95) !important;
        }
        .mapboxgl-popup-close-button {
          color: white;
          font-size: 16px;
        }
        
        /* Navigation control styling */
        .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff'%3E%3Cpath d='M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
        }
        
        .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff'%3E%3Cpath d='M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z'/%3E%3C/svg%3E") !important;
        }
        
        .mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff'%3E%3Cpath d='M10.5 14l4-8 4 8h-8z'/%3E%3Cpath d='M10.5 16l4 8 4-8h-8z' fill='%23aaa'/%3E%3C/svg%3E") !important;
        }
        
        .mapboxgl-ctrl button.mapboxgl-ctrl-fullscreen .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff'%3E%3Cpath d='M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1-4-4 1-1 4 4 1-3h3zM13 24.5H7.5c-1.75 0-2.5-.75-2.5-2.5V16h1l1 3 4-4 1 1-4 4 3 1v3zM16 4.5h5.5c1.75 0 2.5.75 2.5 2.5V13h-1l-1-3-4 4-1-1 4-4-3-1V4.5zM4.5 13H4V7.5C4 5.75 4.75 5 6.5 5H13v1l-3 1 4 4-1 1-4-4-1 3H4.5V13z'/%3E%3C/svg%3E") !important;
        }
        
        /* Control background styling */
        .mapboxgl-ctrl-group {
          background-color: rgba(17, 24, 39, 0.8) !important;
          border: 1px solid rgba(75, 85, 99, 0.5) !important;
        }
        
        .mapboxgl-ctrl-group button {
          border-color: rgba(75, 85, 99, 0.5) !important;
        }
        
        .mapboxgl-ctrl-group button:hover {
          background-color: rgba(55, 65, 81, 0.8) !important;
        }
      `;
      
      // Add custom styles to the document
      const styleElement = document.createElement('style');
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
      
      // Add main property marker
      const mainMarker = new mapboxgl.Marker({
        color: "#6366f1", // Indigo color for main property
        scale: 1.2
      })
        .setLngLat([props.property.propertyInfo.longitude, props.property.propertyInfo.latitude])
        .addTo(map.value);
      const mainPopup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-white text-base mb-1.5">Subject Property</h3>
            <p class="text-sm text-white mb-1">${props.property.propertyInfo.address.label}</p>
            <p class="text-sm text-white mb-1"><span class="font-medium">Price:</span> $${formatValue(props.property.estimatedValue)}</p>
            <p class="text-sm text-white">${props.property.propertyInfo.bedrooms} bed, ${props.property.propertyInfo.bathrooms} bath, ${formatValue(props.property.propertyInfo.livingSquareFeet)} sqft</p>
          </div>
        `);
      mainMarker.setPopup(mainPopup);
      markers.value.set('main', { marker: mainMarker });
      
      // Add comparable property markers
      props.property.comps.forEach((comp, index) => {
        const lngLat = [comp.longitude, comp.latitude];
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px'
        })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-white text-base mb-1.5">Comparable #${index + 1}</h3>
              <p class="text-sm text-white mb-1">${comp.address.address}</p>
              <p class="text-sm text-white mb-1"><span class="font-medium">Price:</span> $${formatValue(comp.estimatedValue)}</p>
              <p class="text-sm text-white mb-1">${comp.bedrooms} bed, ${comp.bathrooms} bath, ${formatValue(comp.squareFeet)} sqft</p>
              ${comp.yearBuilt ? `<p class="text-sm text-white"><span class="font-medium">Built:</span> ${comp.yearBuilt}</p>` : ''}
            </div>
          `);
        const marker = new mapboxgl.Marker({
          color: "#22c55e", // Green color for comps
          scale: 0.8
        })
          .setLngLat(lngLat)
          .setPopup(popup)
          .addTo(map.value);
        const element = marker.getElement();
        element.addEventListener('mouseenter', () => emit('markerHovered', comp.id));
        element.addEventListener('mouseleave', () => emit('markerHovered', null));
        markers.value.set(comp.id, {
          marker,
          popup,
          lngLat
        });
      });
      
      // Add navigation control with white icons
      const navControl = new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      });
      map.value.addControl(navControl, 'top-left');
      
      // Add fullscreen control
      map.value.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    });
  } catch (error) {
    console.error('Error initializing map:', error);
  }
};
onMounted(() => {
  initMap();
});
onBeforeUnmount(() => {
  cleanupMap();
});
</script>