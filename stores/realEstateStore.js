// stores/realEstateStore.js
import { defineStore } from 'pinia';

export const useRealEstateStore = defineStore('realEstate', {
  state: () => ({
    propertyDetail: null,
    loading: false,
    error: null,
    autoCompleteResults: [],
    autoCompleteLoading: false,
    autoCompleteError: null,
  }),
  
  actions: {
    async fetchPropertyDetail(address) {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const apiKey = config.public.REAL_ESTATE_API_KEY;
        
        if (!apiKey) {
          throw new Error('Real Estate API key is missing');
        }
        
        const response = await fetch('https://api.realestateapi.com/v2/PropertyDetail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': apiKey,
          },
          body: JSON.stringify({
            address: address,
            comps: false,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.propertyDetail = data;
        return data;
      } catch (error) {
        console.error('Error fetching property detail:', error);
        this.error = error.message || 'Failed to fetch property details';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAutoComplete(searchText) {
      if (!searchText || searchText.trim().length < 3) {
        this.autoCompleteResults = [];
        return [];
      }
      
      this.autoCompleteLoading = true;
      this.autoCompleteError = null;
      
      try {
        const config = useRuntimeConfig();
        const apiKey = config.public.REAL_ESTATE_API_KEY;
        
        if (!apiKey) {
          throw new Error('Real Estate API key is missing');
        }
        
        const response = await fetch('https://api.realestateapi.com/v2/AutoComplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': apiKey,
          },
          body: JSON.stringify({
            // You can add parameters here if needed
            query: searchText,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        this.autoCompleteResults = data;
        return data;
      } catch (error) {
        console.error('Error fetching auto-complete:', error);
        this.autoCompleteError = error.message || 'Failed to fetch auto-complete results';
        return [];
      } finally {
        this.autoCompleteLoading = false;
      }
    },
    
    clearPropertyDetail() {
      this.propertyDetail = null;
    },
    
    clearAutoComplete() {
      this.autoCompleteResults = [];
    }
  },
  
  getters: {
    hasPropertyDetail: (state) => !!state.propertyDetail,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    errorMessage: (state) => state.error,
    autoCompleteIsLoading: (state) => state.autoCompleteLoading,
  }
});