<template>
  <div class="relative w-full">
    <!-- Search Input with Inline Loading Indicator -->
    <div class="flex items-center relative">
      <input
        ref="inputElement"
        type="text"
        v-model="searchText"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        placeholder="Search for an address..."
        class="w-full px-4 py-3 pl-10 border border-yellow-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:border-transparent bg-black/70 text-white placeholder:text-slate-400 transition-all duration-200"
        :class="{'pr-10': searchText || isInputLoading}"
      />
      
      <!-- Left side icon - Search or Loading -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
        <svg v-if="!isInputLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div v-else class="w-4 h-4 border-2 border-slate-600 border-t-yellow-gold rounded-full animate-spin"></div>
      </div>
      
      <!-- Right side clear button -->
      <button 
        v-if="searchText" 
        @click="clearSearch" 
        class="absolute right-3 text-slate-400 hover:text-yellow-gold transition-colors"
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Results Dropdown with Smooth Transition -->
    <div 
      v-if="showResults && filteredResults.length > 0" 
      class="absolute z-50 mt-1 w-full bg-black/90 shadow-xl rounded-lg overflow-hidden border border-yellow-gold/30 transition-all duration-200 transform origin-top"
      :class="showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
    >
      <ul>
        <li 
          v-for="(result, index) in filteredResults" 
          :key="index"
          @click="selectAddress(result)"
          @mouseenter="highlightedIndex = index"
          :class="[
            'px-4 py-3 cursor-pointer transition-colors border-b border-yellow-gold/20 last:border-b-0',
            highlightedIndex === index ? 'bg-yellow-gold/10' : 'hover:bg-yellow-gold/10'
          ]"
        >
          <!-- City Results -->
          <template v-if="result.searchType === 'C'">
            <div class="font-medium text-yellow-gold">{{ result.city }}, {{ result.state }}</div>
          </template>
          
          <!-- Neighborhood Results -->
          <template v-else-if="result.searchType === 'G'">
            <div class="font-medium text-yellow-gold">{{ result.neighborhoodName }}</div>
            <div class="text-sm text-slate-400">
              {{ result.city }}, {{ result.state }} {{ result.zip }}
            </div>
          </template>
          
          <!-- Address Results -->
          <template v-else-if="result.searchType === 'A'">
            <div class="font-medium text-yellow-gold">{{ result.address }}</div>
            <div class="text-sm text-slate-400">
              {{ result.city }}, {{ result.state }} {{ result.zip }}
            </div>
          </template>
          
          <!-- Default display for other result types -->
          <template v-else>
            <div class="font-medium text-yellow-gold">{{ result.title || 'Unknown' }}</div>
            <div class="text-sm text-slate-400">{{ result.formattedAddress || result.place_name || '' }}</div>
          </template>
        </li>
      </ul>
    </div>
    
    <!-- No Results Message with Smooth Transition -->
    <div 
      v-if="showResults && searchText && filteredResults.length === 0 && !isInputLoading" 
      class="absolute z-50 mt-1 w-full bg-black/90 shadow-xl rounded-lg overflow-hidden border border-yellow-gold/30 p-4 text-center text-slate-400 transition-all duration-200 transform origin-top"
      :class="showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
    >
      No results found
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, watch, onMounted } from 'vue';

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  },
  maxResults: {
    type: Number,
    default: 5
  },
  searchTypes: {
    type: Array,
    default: () => ['A'] // Default to only show address results
  },
  debounceTime: {
    type: Number,
    default: 300
  }
});

const emit = defineEmits(['select-address', 'loading-state']);

const inputElement = ref(null);
const searchText = ref(props.initialValue || '');
const results = ref([]);
const showResults = ref(false);
const isInputLoading = ref(false); // Loading indicator in the input field
const highlightedIndex = ref(-1);  // For keyboard navigation
let debounceTimeout = null;
let minSearchLength = 3;

// Filter results based on searchType and limit the number
const filteredResults = computed(() => {
  let filtered = results.value;
  
  // Filter by search type if specified
  if (props.searchTypes && props.searchTypes.length > 0) {
    filtered = filtered.filter(result => props.searchTypes.includes(result.searchType));
  }
  
  // Limit the number of results
  return filtered.slice(0, props.maxResults);
});

// Function to perform address autocomplete search using our proxy
const performSearch = async (query) => {
  if (!query || query.trim().length < minSearchLength) {
    results.value = [];
    showResults.value = false;
    isInputLoading.value = false;
    emit('loading-state', false);
    return;
  }
  
  // Show loading state
  isInputLoading.value = true;
  
  // Emit loading state to parent component
  emit('loading-state', true);
  
  try {
    // Use our server middleware proxy instead of direct API call
    const response = await fetch('/api/real-estate/AutoComplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: query,
        search_types: props.searchTypes // Pass search types to API
      })
    });
    
    if (!response.ok) {
      throw new Error(`AutoComplete API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // Extract results from the API response
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      results.value = responseData.data;
      showResults.value = results.value.length > 0;
    } else {
      results.value = [];
      showResults.value = Boolean(searchText.value.trim());
    }
  } catch (error) {
    console.error('Error in autocomplete search:', error);
    results.value = [];
    showResults.value = Boolean(searchText.value.trim());
  } finally {
    // Delay hiding the loading indicator to prevent flickering
    setTimeout(() => {
      isInputLoading.value = false;
      emit('loading-state', false);
    }, 300);
  }
};

// Improved debounce functionality
const handleInput = () => {
  // Always show the input loading state immediately for better UX
  if (searchText.value.trim().length >= minSearchLength) {
    isInputLoading.value = true;
  }
  
  // Clear any existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  // Set a new timeout to delay the search
  debounceTimeout = setTimeout(() => {
    // Only perform search if we have enough characters
    if (searchText.value.trim().length >= minSearchLength) {
      performSearch(searchText.value);
    } else {
      // If too few characters, clear results and hide loading
      results.value = [];
      showResults.value = false;
      isInputLoading.value = false;
      emit('loading-state', false);
    }
  }, props.debounceTime);
};

// Select an address from the dropdown
const selectAddress = (result) => {
  // Get the full address from the result
  const fullAddress = result.address || result.title || '';
  
  // Update the input with the selected address
  searchText.value = fullAddress;
  
  // Close the dropdown
  showResults.value = false;
  
  // Create a structured result object
  const addressResult = {
    ...result,
    fullAddress,
    propertyId: encodeURIComponent(fullAddress),
    realEstateId: result.id || null,
    coordinates: {
      latitude: parseFloat(result.latitude) || 0,
      longitude: parseFloat(result.longitude) || 0
    }
  };
  
  // Emit the selected address to the parent component
  emit('select-address', addressResult);
};

const handleFocus = () => {
  // Only show results if we have enough characters and previous results
  if (searchText.value.trim().length >= minSearchLength && results.value.length > 0) {
    showResults.value = true;
  }
};

const handleBlur = () => {
  // Delay hiding results to allow for click events to register
  setTimeout(() => {
    showResults.value = false;
    highlightedIndex.value = -1;
  }, 150);
};

const clearSearch = () => {
  searchText.value = '';
  results.value = [];
  showResults.value = false;
  isInputLoading.value = false;
  emit('loading-state', false);
  inputElement.value?.focus();
};

// Handle keyboard navigation
const handleKeydown = (e) => {
  if (!showResults.value || filteredResults.value.length === 0) return;
  
  // Arrow down - move down the list
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredResults.value.length - 1);
  }
  // Arrow up - move up the list
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
  }
  // Enter - select the highlighted item
  else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
    e.preventDefault();
    selectAddress(filteredResults.value[highlightedIndex.value]);
  }
  // Escape - close the dropdown
  else if (e.key === 'Escape') {
    e.preventDefault();
    showResults.value = false;
    highlightedIndex.value = -1;
  }
};

// Watch for prop changes
watch(() => props.initialValue, (newVal) => {
  searchText.value = newVal || '';
});

// Set up event listeners
onBeforeUnmount(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  // Remove keyboard event listener if it was added
  if (inputElement.value) {
    inputElement.value.removeEventListener('keydown', handleKeydown);
  }
});

// Add keyboard event listener when component is mounted
const setupKeyboardListeners = () => {
  if (inputElement.value) {
    inputElement.value.addEventListener('keydown', handleKeydown);
  }
};

// Define methods that can be accessed from the parent component
defineExpose({
  clearSearch,
  focus: () => inputElement.value?.focus(),
  setAddress: (address) => {
    searchText.value = address;
  }
});

// Setup keyboard navigation after component is mounted
onMounted(() => {
  setupKeyboardListeners();
});
</script>