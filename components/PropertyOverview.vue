<template>
  <div class="property-display">
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Property Gallery and Details Section (Left Column on Desktop) -->
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
              <span class="text-gray-400">Address:</span>
              <span class="text-white font-medium">{{ computedPropertyAddress }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">City/State/Zip:</span>
              <span class="text-white font-medium">
                {{ reapi_property.propertyInfo?.address?.city || property.city || property.address?.city || "N/A" }}, 
                {{ reapi_property.propertyInfo?.address?.state || property.state || property.address?.state || "N/A" }} 
                {{ reapi_property.propertyInfo?.address?.zip || property.zipcode || property.address?.zipcode || "N/A" }}
              </span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">County:</span>
              <span class="text-white font-medium">{{ computedCounty }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">APN:</span>
              <span class="text-white font-medium">{{ computedApn }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2">
              <span class="text-gray-400">Legal Description:</span>
              <span class="text-white font-medium text-right">{{ computedLegalDescription }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Type:</span>
              <span class="text-white font-medium">{{ reapi_property.propertyType || property.homeType || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Bedrooms:</span>
              <span class="text-white font-medium">{{ reapi_property.propertyInfo?.bedrooms || property.bedrooms || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Bathrooms:</span>
              <span class="text-white font-medium">{{ reapi_property.propertyInfo?.bathrooms || property.bathrooms || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Living Area:</span>
              <span class="text-white font-medium">{{ formatNumber(reapi_property.propertyInfo?.livingSquareFeet || property.livingArea || property.livingAreaValue) || "N/A" }} sqft</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Lot Size:</span>
              <span class="text-white font-medium">{{ formatNumber(reapi_property.lotInfo?.lotSquareFeet || property.lotSize) || "N/A" }} sqft</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Year Built:</span>
              <span class="text-white font-medium">{{ reapi_property.propertyInfo?.yearBuilt || property.yearBuilt || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Last Sale Date:</span>
              <span class="text-white font-medium">{{ formatDate(reapi_property.lastSale?.saleDate || property.lastSaleDate) || "N/A" }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Last Sale Price:</span>
              <span class="text-white font-medium">{{ formatPrice(reapi_property.lastSale?.saleAmount || property.lastSalePrice) || "N/A" }}</span>
            </div>
            <div
              v-if="property.resoFacts?.hoaFee || property.monthlyHoaFee"
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">HOA Fee:</span>
              <span class="text-white font-medium">
                {{ formatPrice(property.resoFacts?.hoaFee || property.monthlyHoaFee) }}/{{
                  property.resoFacts?.hoaFeeFreq || "mo"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Property Details Section (Right Column on Desktop) -->
      <div class="space-y-6">
        <!-- Property Header Card -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              {{ computedPropertyAddress }}
            </h1>
            <p class="text-gray-400">
              {{ reapi_property.propertyInfo?.address?.city || property.city || "N/A" }}, 
              {{ reapi_property.propertyInfo?.address?.state || property.state || "N/A" }}
              {{ reapi_property.propertyInfo?.address?.zip || property.zipcode || "N/A" }}
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
                {{ reapi_property.propertyInfo?.bedrooms || property.bedrooms || "N/A" }} bed
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
                {{ reapi_property.propertyInfo?.bathrooms || property.bathrooms || "N/A" }} bath
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
                {{ formatNumber(reapi_property.propertyInfo?.livingSquareFeet || property.livingArea) || "N/A" }} sqft
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
                Built: {{ reapi_property.propertyInfo?.yearBuilt || property.yearBuilt || "N/A" }}
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
                  <span class="text-gray-400 text-sm">Estimated Value</span>
                </div>
                <div
                  class="text-yellow-gold text-2xl md:text-3xl font-bold"
                >
                  {{ formatPrice(reapi_property.estimatedValue || property.zestimate) }}
                </div>
                <div
                  v-if="(reapi_property.estimatedValue || property.zestimate) && (reapi_property.propertyInfo?.livingSquareFeet || property.livingArea)"
                  class="text-sm text-gray-400 mt-1"
                >
                  {{
                    formatPrice(
                      Math.round((reapi_property.estimatedValue || property.zestimate) / (reapi_property.propertyInfo?.livingSquareFeet || property.livingArea))
                    )
                  }}/sqft
                </div>
              </div>
              <div v-if="property.rentZestimate || reapi_property.demographics?.suggestedRent" class="text-right">
                <div class="mb-0">
                  <span class="text-gray-400 text-sm">Suggested Rent</span>
                </div>
                <div class="text-yellow-gold text-xl font-semibold">
                  {{ formatPrice(property.rentZestimate || reapi_property.demographics?.suggestedRent) }}/mo
                </div>
              </div>
            </div>
          </div>
        </div>
       
        <!-- Financial Details Card -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
            </svg>
            Financial Details
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Purchase/Listing Price:</span>
              <span class="text-white font-medium">{{ computedFormattedPurchaseOrListingPrice }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Open Loan Balance:</span>
              <span class="text-white font-medium">{{ computedFormattedOpenLoanBalance }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Estimated Equity:</span>
              <span class="text-white font-medium">{{ formatPrice(reapi_property.equity || reapi_property.estimatedEquity) }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Equity Percentage:</span>
              <span class="text-white font-medium">{{ reapi_property.equityPercent != null ? `${reapi_property.equityPercent}%` : 'N/A' }}</span>
            </div>
            <div class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Est. Monthly Payment:</span>
              <span class="text-white font-medium">{{ formatPrice(reapi_property.estimatedMortgagePayment) }}/mo</span>
            </div>
            <div v-if="reapi_property.currentMortgages && reapi_property.currentMortgages.length > 0" class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Lender:</span>
              <span class="text-white font-medium">{{ reapi_property.currentMortgages[0].lenderName || "N/A" }}</span>
            </div>
            <div v-if="reapi_property.currentMortgages && reapi_property.currentMortgages.length > 0" class="flex justify-between border-b border-yellow-gold/20 py-2">
              <span class="text-gray-400">Loan Maturity Date:</span>
              <span class="text-white font-medium">{{ formatDate(reapi_property.currentMortgages[0].maturityDate) || "N/A" }}</span>
            </div>
            
           
          </div>
        </div>
        
        <!-- Owner & Agent Information -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013-3c.295 0 .584.043.852.127z" />
            </svg>
            Owner & Agent Information
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2">
              <span class="text-gray-400">Owner's Name:</span>
              <span class="text-white font-medium">{{ computedSellerName }}</span>
            </div>
            
            <template v-if="computedAgentInfo">
              <div class="flex items-center border-b border-yellow-gold/20 py-3 sm:col-span-2">
                <div class="flex-shrink-0 mr-3" v-if="computedListingAgentImage">
                  <img :src="computedListingAgentImage" alt="Agent photo" class="w-14 h-14 rounded-full object-cover border border-yellow-gold/30">
                </div>
                <div class="flex-grow">
                  <div class="font-bold text-white">{{ computedListingAgentName }}</div>
                  <div class="text-yellow-gold text-sm">{{ computedListingAgentBusinessName }}</div>
                  <div class="flex items-center mt-1" v-if="computedListingAgentRating !== 'N/A'">
                    <span class="text-yellow-gold mr-1">★</span>
                    <span class="text-white text-sm">{{ computedListingAgentRating }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2">
                <span class="text-gray-400">Contact Number:</span>
                <span class="text-white font-medium">{{ computedListingAgentPhone }}</span>
              </div>
              
              <div v-if="computedAgentInfo.badge_type" class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2">
                <span class="text-gray-400">Agent Type:</span>
                <span class="text-white font-medium">{{ computedAgentInfo.badge_type }}</span>
              </div>
            </template>
            <template v-else>
              <div class="sm:col-span-2 text-gray-400 italic">
                Agent information not available.
              </div>
            </template>
          </div>
        </div>
        
        <!-- Call To Action -->
        <div class="bg-gradient-to-br from-black to-gray-900 rounded-lg shadow-lg p-6 border border-yellow-gold/30">
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
              Ready to contact the agent?
            </h3>
          </div>
          <p class="text-gray-300 text-sm mb-4 pl-8">
            Generate a pre-formatted offer email to send to the listing agent.
          </p>
          <button
            @click="openModal"
            class="block w-full bg-gradient-to-r from-yellow-600 to-yellow-gold px-4 py-3 rounded-lg font-bold text-sm text-black hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 relative overflow-hidden group text-center"
          >
            <span class="relative z-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 inline-block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Create Offer Email
              <span class="ml-2">→</span>
            </span>
            <span
              class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Offer Email Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" @click="closeModalOnBackdropClick">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div class="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-yellow-gold/30 w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
        <!-- Modal Header -->
        <div class="p-4 border-b border-yellow-gold/30 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">Offer Email Template for {{ computedPropertyAddress }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Modal Body - Make this section scrollable -->
<div class="p-6 overflow-y-auto flex-1">
  <div class="flex mb-4 gap-4">
    <div class="flex-1">
      <label class="block text-xs text-gray-400 mb-1">Your Name</label>
      <input 
        type="text" 
        v-model="yourName" 
        class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        placeholder="Your Name"
      />
    </div>
    <div class="flex-1">
      <label class="block text-xs text-gray-400 mb-1">Purchase Price</label>
      <input 
        type="text" 
        v-model="purchasePrice" 
        class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        :placeholder="computedFormattedPurchaseOrListingPrice"
      />
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div>
      <label class="block text-xs text-gray-400 mb-1">Cash to Seller</label>
      <input 
        type="text" 
        v-model="cashToSeller" 
        class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        :placeholder="defaultCashToSeller"
      />
    </div>
    <div>
      <label class="block text-xs text-gray-400 mb-1">Agent Commission</label>
      <input 
        type="text" 
        v-model="agentCommission" 
        class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        :placeholder="defaultAgentCommission"
      />
    </div>
    <div>
      <label class="block text-xs text-gray-400 mb-1">Loan Balance</label>
      <div class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-400 text-sm">
        {{ computedFormattedOpenLoanBalance }}
      </div>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium">Seller Finance Note</label>
      <input 
        type="text" 
        v-model="sellerNote" 
        class="w-full bg-gray-800 border border-yellow-600 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        placeholder="Enter amount"
      />
    </div>
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium">Monthly to Seller</label>
      <input 
        type="text" 
        v-model="monthlyToSeller" 
        class="w-full bg-gray-800 border border-yellow-600 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
        placeholder="Enter monthly payment"
      />
    </div>
  </div>
  
  <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-gray-200 font-mono text-sm mb-4 whitespace-pre-wrap h-64 overflow-y-auto" ref="offerTextRef">{{ offerEmailText }}</div>
</div>

<!-- Modal Footer - Always visible at bottom -->
<div class="p-4 border-t border-yellow-gold/30 bg-gray-900/50 flex justify-end space-x-4">
  <button 
    @click="copyOfferText" 
    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-medium rounded-md flex items-center transition-colors"
    :class="{ 'copied-animation': copied }"
  >
    <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
  </button>
  <button 
    @click="closeModal" 
    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
  >
    Close
  </button>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  property: { // Assuming this is primarily Zillow data or a general merged object for display
    type: Object,
    required: true,
  },
  reapi_property: { // Specific REAPI data
    type: Object,
    required: true,
  },
  contractSystemUrl: {
    type: String,
    default: "https://contracts.yourdomain.com" 
  }
});

const NA_FALLBACK = "N/A";

// --- Local State for Gallery ---
const selectedImage = ref(null);

// --- Local State for Modal ---
const showModal = ref(false);
const copied = ref(false);
const offerTextRef = ref(null);

// --- Customizable Fields ---
const yourName = ref("");
const purchasePrice = ref("");
const cashToSeller = ref("");
const agentCommission = ref("");
const sellerNote = ref("");
const monthlyToSeller = ref("");

// --- Methods ---
const formatPrice = (price) => {
  if (price == null || isNaN(Number(price)) || String(price).trim() === "") return NA_FALLBACK;
  return new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(Number(price));
};

const formatNumber = (num) => {
  if (num == null || isNaN(Number(num))) return NA_FALLBACK;
  const numericValue = Number(String(num).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericValue)) return NA_FALLBACK;
  return new Intl.NumberFormat("en-US").format(numericValue);
};

const formatDate = (dateString) => {
  if (!dateString) return NA_FALLBACK;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return NA_FALLBACK; // Invalid date
    // Check for a common zero-date pattern if necessary, e.g., 0001-01-01
    if (date.getUTCFullYear() < 1900) return NA_FALLBACK; // Or handle as you see fit
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return NA_FALLBACK;
  }
};

const onImageError = (event) => {
  event.target.src =
    "https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+Load+Error";
  event.target.alt = "Image failed to load";
};

const selectImage = (imageUrl) => {
  selectedImage.value = imageUrl;
};

// Open modal and prevent background scrolling
const openModal = () => {
  showModal.value = true;
  document.body.classList.add('overflow-hidden');
};

// Close modal and restore background scrolling
const closeModal = () => {
  showModal.value = false;
  document.body.classList.remove('overflow-hidden');
};

// Close modal when clicking on backdrop (outside the modal)
const closeModalOnBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

// Copy text to clipboard function
const copyOfferText = async () => {
  try {
    await navigator.clipboard.writeText(offerEmailText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback for older browsers
    if (offerTextRef.value) {
      const range = document.createRange();
      range.selectNode(offerTextRef.value);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  }
};

// --- Computed Properties for REAPI specific data ---
const computedPropertyAddress = computed(() => {
  return props.reapi_property?.propertyInfo?.address?.address || 
         props.property?.streetAddress || 
         (props.property?.address?.streetAddress || NA_FALLBACK);
});

const computedOpenLoanBalance = computed(() => {
  const balance = props.reapi_property?.openMortgageBalance ?? 
                  props.reapi_property?.estimatedMortgageBalance;
  return (balance !== undefined && balance !== null && String(balance).trim() !== "") ? Number(balance) : null;
});

const computedFormattedOpenLoanBalance = computed(() => formatPrice(computedOpenLoanBalance.value));

const computedApn = computed(() => {
  return props.reapi_property?.lotInfo?.apn || props.property?.resoFacts?.parcelNumber || NA_FALLBACK;
});

const computedLegalDescription = computed(() => {
  return props.reapi_property?.lotInfo?.legalDescription || NA_FALLBACK;
});

const computedCounty = computed(() => {
  return props.reapi_property?.propertyInfo?.address?.county || props.property?.county || NA_FALLBACK;
});

const computedSellerName = computed(() => {
  return props.reapi_property?.ownerInfo?.owner1FullName || NA_FALLBACK;
});

// Get agent information from contact_recipients
const computedAgentInfo = computed(() => {
  if (props.property?.contact_recipients && props.property.contact_recipients.length > 0) {
    return props.property.contact_recipients[0];
  }
  return null;
});

const computedListingAgentName = computed(() => {
  return computedAgentInfo.value?.display_name || NA_FALLBACK; 
});

const computedListingAgentBusinessName = computed(() => {
  return computedAgentInfo.value?.business_name || NA_FALLBACK; 
});

const computedListingAgentPhone = computed(() => {
  if (computedAgentInfo.value?.phone) {
    const phone = computedAgentInfo.value.phone;
    return `(${phone.areacode}) ${phone.prefix}-${phone.number}` || NA_FALLBACK;
  }
  return NA_FALLBACK;
});

const computedListingAgentRating = computed(() => {
  return computedAgentInfo.value?.rating_average || NA_FALLBACK;
});

const computedListingAgentImage = computed(() => {
  return computedAgentInfo.value?.image_url || null;
});

// Property value calculations
const computedEstimatedValue = computed(() => {
  return props.reapi_property?.estimatedValue || props.property?.zestimate || null;
});

const computedPurchaseOrListingPrice = computed(() => {
  // First, check if we have a Zillow zestimate or REAPI estimated value
  if (computedEstimatedValue.value) {
    return computedEstimatedValue.value;
  }

  // Then check for MLS listing price in REAPI
  const reapi = props.reapi_property;
  if (reapi?.mlsListingPrice && !isNaN(Number(reapi.mlsListingPrice))) {
    // Validate it's a sale price, not a rental (arbitrary threshold)
    if (Number(reapi.mlsListingPrice) > 10000 || reapi.mlsType === 'ForSale') {
      return Number(reapi.mlsListingPrice);
    }
  }
  
  // Check for price in Zillow data
  if (props.property?.price && !isNaN(Number(props.property.price))) {
    return Number(props.property.price);
  }
  
  // Last resort - check last sale price
  const lastSalePrice = props.property?.lastSalePrice || 
                        (reapi?.lastSale?.saleAmount) || null;
  
  return lastSalePrice;
});

const computedFormattedPurchaseOrListingPrice = computed(() => formatPrice(computedPurchaseOrListingPrice.value));

// Default calculated values for the form
const defaultCashToSeller = computed(() => {
  if (computedPurchaseOrListingPrice.value) {
    // Default cash to seller is 20% of purchase price
    return formatPrice(computedPurchaseOrListingPrice.value * 0.2);
  }
  return "Enter amount";
});

const defaultAgentCommission = computed(() => {
  if (computedPurchaseOrListingPrice.value) {
    // Default commission is 3% of purchase price
    return formatPrice(computedPurchaseOrListingPrice.value * 0.03);
  }
  return "Enter amount";
});

// Compute net to seller based on all values
const computedNetToSeller = computed(() => {
  // Start with purchase price
  const purchaseAmount = purchasePrice.value ? 
    parseFloat(purchasePrice.value.replace(/[^0-9.-]+/g, "")) : 
    computedPurchaseOrListingPrice.value || 0;
  
  // Subtract agent commission
  const commission = agentCommission.value ? 
    parseFloat(agentCommission.value.replace(/[^0-9.-]+/g, "")) : 
    (purchaseAmount * 0.03);
  
  // Calculate net
  let netAmount = purchaseAmount - commission;
  
  return formatPrice(netAmount);
});

// Compute the email template text
const offerEmailText = computed(() => {
  // Property info
  const address = computedPropertyAddress.value;
  const agentName = computedListingAgentName.value;
  
  // Format loan balance - use existing or default to N/A
  const loanBalance = computedFormattedOpenLoanBalance.value;
  
  // Calculate net to seller
  const netToSeller = computedNetToSeller.value;
  
  // Use entered values or default to computed values
  const formattedPurchasePrice = purchasePrice.value || computedFormattedPurchaseOrListingPrice.value;
  const formattedCashToSeller = cashToSeller.value || defaultCashToSeller.value;
  const formattedAgentCommission = agentCommission.value || defaultAgentCommission.value;
  const formattedSellerNote = sellerNote.value || "N/A";
  const formattedMonthlyToSeller = monthlyToSeller.value || "N/A";
  const name = yourName.value || "Your Name";
  
  return `Hi ${agentName},

Hope you're doing great. Please see the attached offer for ${address}:

• Price: ${formattedPurchasePrice}
• Cash to Seller: ${formattedCashToSeller}
• Agent Commission: ${formattedAgentCommission}
• Takeover Loan Balance: ${loanBalance}
• Seller Finance Note: ${formattedSellerNote}
• Monthly Payments to Seller: ${formattedMonthlyToSeller}
• Net to Seller: ${netToSeller}
• Closing: Within 30 days

If you're interested, please forward the mortgage statement or any counter terms to help us move faster.

For more info, visit our Transaction Guide:
https://urcreativesolutions.info/

Looking forward to working with you!

Be Great,
${name}`;
});

// Initialize fields on modal opening
watch(showModal, (isVisible) => {
  if (isVisible) {
    // Pre-populate with defaults only if not already set
    if (!purchasePrice.value) {
      purchasePrice.value = computedFormattedPurchaseOrListingPrice.value;
    }
    if (!cashToSeller.value) {
      cashToSeller.value = defaultCashToSeller.value;
    }
    if (!agentCommission.value) {
      agentCommission.value = defaultAgentCommission.value;
    }
  }
});

// --- Image Gallery Watchers ---
watch(
  () => props.property,
  (newVal) => {
    if (newVal && newVal.imgSrc) {
      selectedImage.value = newVal.imgSrc;
    } else if (newVal && newVal.images && newVal.images.length > 0) {
      // Ensure image is an object with a url or a string
      const firstImage = newVal.images[0];
      selectedImage.value = typeof firstImage === 'string' ? firstImage : firstImage?.url;
    } else {
      selectedImage.value = null; // Reset if no images
    }
  },
  { immediate: true, deep: true } 
);
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

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom scrollbar for offer text */
.whitespace-pre-wrap::-webkit-scrollbar {
  width: 6px;
}

.whitespace-pre-wrap::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 8px;
}

.whitespace-pre-wrap::-webkit-scrollbar-thumb {
  background-color: #d69e2e;
  border-radius: 8px;
}

/* Copy button animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.copied-animation {
  animation: pulse 0.4s ease-in-out;
}
</style>