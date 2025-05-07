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
            @click="openContractModal"
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

    <!-- LOI & Contract Generator Modal -->
    <div v-if="isContractModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="closeContractModal"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-gold/20 sm:mx-0 sm:h-10 sm:w-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-xl leading-6 font-bold text-white" id="modal-title">
                Generate Documents
              </h3>
              <div class="mt-1">
                <p class="text-sm text-gray-300">
                  Create a Letter of Intent or Purchase Contract for this property. All fields can be edited before generation.
                </p>
              </div>
            </div>
            <!-- Close button -->
            <button 
              @click="closeContractModal" 
              class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Document Selection Tabs -->
          <div class="mt-4 border-b border-yellow-gold/20">
            <div class="flex -mb-px">
              <button 
                @click="activeTab = 'loi'" 
                :class="[
                  'py-2 px-4 font-medium text-sm focus:outline-none',
                  activeTab === 'loi' 
                    ? 'text-yellow-gold border-b-2 border-yellow-gold'
                    : 'text-gray-400 hover:text-gray-300'
                ]"
              >
                Letter of Intent (LOI)
              </button>
              <button 
                @click="activeTab = 'contract'" 
                :class="[
                  'py-2 px-4 font-medium text-sm focus:outline-none',
                  activeTab === 'contract' 
                    ? 'text-yellow-gold border-b-2 border-yellow-gold'
                    : 'text-gray-400 hover:text-gray-300'
                ]"
              >
                Purchase Contract
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div class="mt-6 max-h-[70vh] overflow-y-auto pr-2">
            <!-- LOI Form -->
            <div v-if="activeTab === 'loi'" class="space-y-6">
              <!-- Parties Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Parties
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="buyer_name" class="block text-sm font-medium text-gray-300">Buyer's Name</label>
                    <input 
                      type="text" 
                      id="buyer_name" 
                      v-model="loiForm.buyerName" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="seller_name" class="block text-sm font-medium text-gray-300">Seller's Name</label>
                    <input 
                      type="text" 
                      id="seller_name" 
                      v-model="loiForm.sellerName" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Property Details Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Property Details
                </h4>
                
                <div class="space-y-4">
                  <div>
                    <label for="property_address" class="block text-sm font-medium text-gray-300">Property Address</label>
                    <input 
                      type="text" 
                      id="property_address" 
                      v-model="loiForm.propertyAddress" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="property_city" class="block text-sm font-medium text-gray-300">City</label>
                      <input 
                        type="text" 
                        id="property_city" 
                        v-model="loiForm.propertyCity" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                    <div>
                      <label for="property_state" class="block text-sm font-medium text-gray-300">State</label>
                      <input 
                        type="text" 
                        id="property_state" 
                        v-model="loiForm.propertyState" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                    <div>
                      <label for="property_zip" class="block text-sm font-medium text-gray-300">ZIP Code</label>
                      <input 
                        type="text" 
                        id="property_zip" 
                        v-model="loiForm.propertyZip" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label for="property_description" class="block text-sm font-medium text-gray-300">Legal Description (APN, Lot, etc.)</label>
                    <textarea 
                      id="property_description" 
                      v-model="loiForm.propertyDescription" 
                      rows="2"
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Offer Details Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                  </svg>
                  Offer Details
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="purchase_price" class="block text-sm font-medium text-gray-300">Purchase Price ($)</label>
                    <input 
                      type="text" 
                      id="purchase_price" 
                      v-model="loiForm.purchasePrice" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="earnest_money" class="block text-sm font-medium text-gray-300">Earnest Money Deposit ($)</label>
                    <input 
                      type="text" 
                      id="earnest_money" 
                      v-model="loiForm.earnestMoney" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="due_diligence_period" class="block text-sm font-medium text-gray-300">Due Diligence Period (days)</label>
                    <input 
                      type="number" 
                      id="due_diligence_period" 
                      v-model="loiForm.dueDiligencePeriod" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="closing_date" class="block text-sm font-medium text-gray-300">Proposed Closing Date</label>
                    <input 
                      type="date" 
                      id="closing_date" 
                      v-model="loiForm.closingDate" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Additional Terms Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  Additional Terms
                </h4>
                
                <div>
                  <label for="additional_terms" class="block text-sm font-medium text-gray-300">Additional Terms & Conditions</label>
                  <textarea 
                    id="additional_terms" 
                    v-model="loiForm.additionalTerms" 
                    rows="4"
                    class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    placeholder="Enter any additional terms or conditions..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Contract Form -->
            <div v-if="activeTab === 'contract'" class="space-y-6">
              <!-- Parties Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Parties
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="buyer_name_contract" class="block text-sm font-medium text-gray-300">Buyer's Name</label>
                    <input 
                      type="text" 
                      id="buyer_name_contract" 
                      v-model="contractForm.buyerName" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="buyer_email" class="block text-sm font-medium text-gray-300">Buyer's Email</label>
                    <input 
                      type="email" 
                      id="buyer_email" 
                      v-model="contractForm.buyerEmail" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="seller_name_contract" class="block text-sm font-medium text-gray-300">Seller's Name</label>
                    <input 
                      type="text" 
                      id="seller_name_contract" 
                      v-model="contractForm.sellerName" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="seller_email" class="block text-sm font-medium text-gray-300">Seller's Email</label>
                    <input 
                      type="email" 
                      id="seller_email" 
                      v-model="contractForm.sellerEmail" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Property Details Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Property Details
                </h4>
                
                <div class="space-y-4">
                  <div>
                    <label for="property_address_contract" class="block text-sm font-medium text-gray-300">Property Address</label>
                    <input 
                      type="text" 
                      id="property_address_contract" 
                      v-model="contractForm.propertyAddress" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="property_city_contract" class="block text-sm font-medium text-gray-300">City</label>
                      <input 
                        type="text" 
                        id="property_city_contract" 
                        v-model="contractForm.propertyCity" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                    <div>
                      <label for="property_state_contract" class="block text-sm font-medium text-gray-300">State</label>
                      <input 
                        type="text" 
                        id="property_state_contract" 
                        v-model="contractForm.propertyState" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                    <div>
                      <label for="property_zip_contract" class="block text-sm font-medium text-gray-300">ZIP Code</label>
                      <input 
                        type="text" 
                        id="property_zip_contract" 
                        v-model="contractForm.propertyZip" 
                        class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label for="property_description_contract" class="block text-sm font-medium text-gray-300">Legal Description</label>
                    <textarea 
                      id="property_description_contract" 
                      v-model="contractForm.propertyDescription" 
                      rows="2"
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Price & Financing Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                  </svg>
                  Price & Financing
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="purchase_price_contract" class="block text-sm font-medium text-gray-300">Purchase Price ($)</label>
                    <input 
                      type="text" 
                      id="purchase_price_contract" 
                      v-model="contractForm.purchasePrice" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="earnest_money_contract" class="block text-sm font-medium text-gray-300">Earnest Money Deposit ($)</label>
                    <input 
                      type="text" 
                      id="earnest_money_contract" 
                      v-model="contractForm.earnestMoney" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="financing_type" class="block text-sm font-medium text-gray-300">Financing Type</label>
                    <select 
                      id="financing_type" 
                      v-model="contractForm.financingType" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                      <option value="cash">Cash</option>
                      <option value="conventional">Conventional</option>
                      <option value="fha">FHA</option>
                      <option value="va">VA</option>
                      <option value="seller">Seller Financing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label for="down_payment" class="block text-sm font-medium text-gray-300">Down Payment (%)</label>
                    <input 
                      type="number" 
                      id="down_payment" 
                      v-model="contractForm.downPayment" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Timeline Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  Timeline
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="due_diligence_period_contract" class="block text-sm font-medium text-gray-300">Due Diligence Period (days)</label>
                    <input 
                      type="number" 
                      id="due_diligence_period_contract" 
                      v-model="contractForm.dueDiligencePeriod" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="closing_date_contract" class="block text-sm font-medium text-gray-300">Closing Date</label>
                    <input 
                      type="date" 
                      id="closing_date_contract" 
                      v-model="contractForm.closingDate" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="possession_date" class="block text-sm font-medium text-gray-300">Possession Date</label>
                    <select 
                      id="possession_date" 
                      v-model="contractForm.possessionDate" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                      <option value="at_closing">At Closing</option>
                      <option value="days_after">Days After Closing</option>
                      <option value="specific_date">Specific Date</option>
                    </select>
                  </div>
                  <div v-if="contractForm.possessionDate === 'days_after'">
                    <label for="possession_days" class="block text-sm font-medium text-gray-300">Days After Closing</label>
                    <input 
                      type="number" 
                      id="possession_days" 
                      v-model="contractForm.possessionDays" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                  <div v-if="contractForm.possessionDate === 'specific_date'">
                    <label for="possession_specific_date" class="block text-sm font-medium text-gray-300">Specific Date</label>
                    <input 
                      type="date" 
                      id="possession_specific_date" 
                      v-model="contractForm.possessionSpecificDate" 
                      class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Additional Terms Section -->
              <div class="bg-black/30 rounded-lg p-4 space-y-4">
                <h4 class="text-white font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  Additional Terms
                </h4>
                
                <div>
                  <label for="additional_terms_contract" class="block text-sm font-medium text-gray-300">Additional Terms & Contingencies</label>
                  <textarea 
                    id="additional_terms_contract" 
                    v-model="contractForm.additionalTerms" 
                    rows="4"
                    class="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-gold focus:border-yellow-gold sm:text-sm"
                    placeholder="Enter any additional terms, contingencies, or special conditions..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="generateDocument" 
              class="w-full sm:w-auto sm:ml-3 inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-gold text-base font-medium text-black hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-gold sm:text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
              </svg>
              Generate {{ activeTab === 'loi' ? 'LOI' : 'Contract' }}
            </button>
            <button 
              type="button" 
              @click="closeContractModal" 
              class="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
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

// --- Modal State and Forms ---
const isContractModalOpen = ref(false);
const activeTab = ref("loi"); // 'loi' or 'contract'

// Initialize LOI form data
const loiForm = ref({
  buyerName: "",
  sellerName: "",
  propertyAddress: "",
  propertyCity: "",
  propertyState: "",
  propertyZip: "",
  propertyDescription: "",
  purchasePrice: "",
  earnestMoney: "",
  dueDiligencePeriod: 21,
  closingDate: "",
  additionalTerms: "Subject to buyer's inspection and approval of property condition."
});

// Initialize Contract form data
const contractForm = ref({
  buyerName: "",
  buyerEmail: "",
  sellerName: "",
  sellerEmail: "",
  propertyAddress: "",
  propertyCity: "",
  propertyState: "",
  propertyZip: "",
  propertyDescription: "",
  purchasePrice: "",
  earnestMoney: "",
  financingType: "conventional",
  downPayment: 20,
  dueDiligencePeriod: 21,
  closingDate: "",
  possessionDate: "at_closing",
  possessionDays: 3,
  possessionSpecificDate: "",
  additionalTerms: "Subject to buyer's inspection and approval of property condition."
});

// --- Methods ---
const openContractModal = () => {
  // Access property data directly from props.property
  const propData = props.property;
  
  // For Zillow-style data (from document 4)
  if (propData.streetAddress) {
    // Zillow data structure
    const commonFormData = {
      sellerName: propData.ownerInfo?.owner1FullName || 'Property Owner',
      propertyAddress: propData.streetAddress || "",
      propertyCity: propData.city || "",
      propertyState: propData.state || "",
      propertyZip: propData.zipcode || "",
      propertyDescription: `APN: ${propData.resoFacts?.parcelNumber || 'N/A'}`,
      purchasePrice: propData.zestimate || propData.price || 0,
      earnestMoney: Math.round((propData.zestimate || propData.price || 0) * 0.01) // 1% of purchase price
    };
    
    // Set form values for Zillow structure
    setFormData(commonFormData);
  }
  // For regular property data (from document 3)
  else if (propData.propertyInfo) {
    const propAddress = propData.propertyInfo?.address || {};
    const ownerInfo = propData.ownerInfo || {};
    const lotInfo = propData.lotInfo || {};
    
    // Common form fields for regular structure
    const commonFormData = {
      sellerName: `${ownerInfo.owner1FullName || ''} ${ownerInfo.owner2FullName ? ', ' + ownerInfo.owner2FullName : ''}`.trim() || 'Property Owner',
      propertyAddress: propAddress.address || "",
      propertyCity: propAddress.city || "",
      propertyState: propAddress.state || "",
      propertyZip: propAddress.zip || "",
      propertyDescription: `APN: ${lotInfo.apn || 'N/A'}, ${lotInfo.legalDescription || ''}`,
      purchasePrice: propData.estimatedValue || 0,
      earnestMoney: Math.round((propData.estimatedValue || 0) * 0.01) // 1% of purchase price
    };
    
    // Set form values for regular structure
    setFormData(commonFormData);
  }
  
  isContractModalOpen.value = true;
};

const setFormData = (commonFormData) => {
  // Set LOI form values
  loiForm.value = {
    ...loiForm.value,
    ...commonFormData,
    buyerName: "Prospective Buyer",
    closingDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0] // 45 days from now
  };
  
  // Set Contract form values
  contractForm.value = {
    ...contractForm.value,
    ...commonFormData,
    buyerName: "Prospective Buyer",
    buyerEmail: "buyer@example.com",
    sellerEmail: "seller@example.com",
    closingDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0], // 45 days from now
  };
};

const closeContractModal = () => {
  isContractModalOpen.value = false;
};

const generateDocument = () => {
  // Here you would generate the actual LOI or Contract document
  // This could involve API calls, PDF generation, etc.
  console.log(`Generating ${activeTab.value === 'loi' ? 'LOI' : 'Contract'} with form data:`, 
              activeTab.value === 'loi' ? loiForm.value : contractForm.value);
  
  // For demonstration purposes, we'll just close the modal
  alert(`${activeTab.value === 'loi' ? 'Letter of Intent' : 'Purchase Contract'} generated successfully!`);
  closeContractModal();
};

// --- Watchers ---
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

// --- Helper Functions ---
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  return new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
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