<template>
    <div class="min-h-screen bg-slate-950 text-white">
      <!-- Back Button & Property Actions -->
      <div class="container mx-auto px-4 py-4 flex justify-between items-center print:hidden">
        <button
          @click="router.push('/')"
          class="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
          aria-label="Back to search results"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Search
        </button>
  
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-blue-300 text-sm flex items-center" @click="printPage" aria-label="Print property details">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            Print
          </button>
          <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-blue-300 text-sm flex items-center" @click="shareProperty" aria-label="Share property link">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
          <button
            class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-sm flex items-center"
            :class="isSaved ? 'text-blue-400' : 'text-blue-300'"
            @click="toggleSaved"
            :aria-label="isSaved ? 'Unsave property' : 'Save property'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" v-if="isSaved">
              <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clip-rule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" v-else>
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            {{ isSaved ? 'Saved' : 'Save' }}
          </button>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
        <div class="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-300">Loading property data...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="container mx-auto px-4 py-12 text-center">
        <div class="bg-slate-900 border border-slate-800 text-red-500 p-6 rounded-lg max-w-lg mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="font-semibold">Failed to load property data</p>
          <p class="text-sm mt-1">{{ error }}</p>
          <button
            @click="fetchPropertyData"
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
  
      <!-- Property Content -->
      <div v-else-if="property" class="container mx-auto px-4 pb-16">
        <!-- Property Header -->
        <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold">{{ property.streetAddress || 'Address Unavailable' }}</h1>
              <p class="text-slate-400">{{ property.city || 'N/A' }}, {{ property.state || 'N/A' }} {{ property.zipcode || 'N/A' }}</p>
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                <div class="flex items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                  {{ property.bedrooms || 'N/A' }} bed
                </div>
                <div class="flex items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8a1 1 0 00-1-1h-4v3zM9 8H4v3h5V8z" clip-rule="evenodd" /></svg>
                  {{ property.bathrooms || 'N/A' }} bath
                </div>
                <div class="flex items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clip-rule="evenodd" /></svg>
                  {{ formatNumber(property.livingArea) || 'N/A' }} sqft
                </div>
                <div class="flex items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-3.35-4.419 3.35A1 1 0 014 16V4zm2-1h8a1 1 0 011 1v10.72l-3.419-2.6a1 1 0 00-1.162 0L7 14.72V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                  Built: {{ property.yearBuilt || 'N/A' }}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end flex-shrink-0">
              <div class="text-right">
                <div class="mb-1"><span class="text-slate-400 text-sm">Zestimate®</span></div>
                <div class="text-blue-300 text-3xl font-bold">{{ formatPrice(property.zestimate) }}</div>
                <div v-if="property.zestimate && property.livingArea" class="text-sm text-slate-400 mt-1">
                  {{ formatPrice(Math.round(property.zestimate / property.livingArea)) }}/sqft
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Main Content Grid (Two Columns on Large Screens) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Left Column (Wider) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Property Gallery -->
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
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 h-96">
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
  
            <!-- Investment Analysis -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                Investment Analysis
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-semibold mb-3 text-blue-300">Purchase & Loan</h3>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Purchase Price ($)</label>
                      <input v-model.number="investment.purchasePrice" type="number" min="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Down Payment (%)</label>
                      <input v-model.number="investment.downPaymentPercent" type="number" min="0" max="100" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Interest Rate (%)</label>
                      <input v-model.number="investment.interestRate" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Loan Term (years)</label>
                      <select v-model.number="investment.loanTerm" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="15">15 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-3 text-blue-300">Income & Expenses</h3>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Monthly Rental Income ($)</label>
                      <input v-model.number="investment.monthlyRent" type="number" min="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Property Tax ($/year)</label>
                      <input v-model.number="investment.propertyTax" type="number" min="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Insurance ($/year)</label>
                      <input v-model.number="investment.insurance" type="number" min="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     <div>
                      <label class="block text-sm text-slate-400 mb-1">Vacancy (% of rent)</label>
                      <input v-model.number="investment.vacancyRate" type="number" min="0" max="100" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm text-slate-400 mb-1">Maintenance (% of rent)</label>
                      <input v-model.number="investment.maintenancePercent" type="number" min="0" max="100" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     <div>
                      <label class="block text-sm text-slate-400 mb-1">Property Management (% of rent)</label>
                      <input v-model.number="investment.propertyManagementPercent" type="number" min="0" max="100" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 pt-6 border-t border-slate-800">
                <h3 class="text-lg font-semibold mb-4 text-blue-300">Investment Analysis Results</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="bg-slate-800 p-4 rounded-lg"><div class="text-sm text-slate-400 mb-1">Monthly P&I</div><div class="text-xl font-bold">{{ formatPrice(calculatedResults.monthlyMortgage) }}</div></div>
                  <div class="bg-slate-800 p-4 rounded-lg"><div class="text-sm text-slate-400 mb-1">Est. Cash Flow</div><div class="text-xl font-bold" :class="calculatedResults.monthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'">{{ formatPrice(calculatedResults.monthlyCashFlow) }}/mo</div></div>
                  <div class="bg-slate-800 p-4 rounded-lg"><div class="text-sm text-slate-400 mb-1">Est. Cap Rate</div><div class="text-xl font-bold" :class="calculatedResults.capRate >= 5 ? 'text-green-500' : 'text-orange-500'">{{ calculatedResults.capRate.toFixed(2) }}%</div></div>
                  <div class="bg-slate-800 p-4 rounded-lg"><div class="text-sm text-slate-400 mb-1">Est. Cash on Cash</div><div class="text-xl font-bold" :class="calculatedResults.cashOnCash >= 8 ? 'text-green-500' : 'text-orange-500'">{{ calculatedResults.cashOnCash.toFixed(2) }}%</div></div>
                </div>
                <div class="mt-6 flex items-center flex-wrap">
                  <div class="text-lg font-semibold mr-3">Investment Rating:</div>
                  <div class="flex items-center"><div class="px-3 py-1 rounded text-sm font-medium" :class="ratingClass">{{ investmentRating }}</div><div class="ml-3 text-slate-400 text-sm">{{ ratingDescription }}</div></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right Column (Narrower) -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Quick Actions -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6 print:hidden">
              <div class="flex flex-col space-y-3">
                <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>Contact Agent (Example)</button>
                <button class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>Request Info (Example)</button>
                <button class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" /></svg>Schedule Tour (Example)</button>
              </div>
            </div>
  
            <!-- Climate Risk Analysis -->
            <div v-if="property.climate" class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clip-rule="evenodd" /></svg>Climate Risk Analysis</h2>
              <div class="space-y-4">
                <div v-if="property.climate.fireSources?.primary?.riskScore?.label" class="bg-slate-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-2"><div class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" /></svg>Fire Risk</div><div class="px-2 py-1 rounded text-xs font-medium" :class="getRiskClass(property.climate.fireSources.primary.riskScore.label)">{{ property.climate.fireSources.primary.riskScore.label }}</div></div>
                  <div class="text-sm text-slate-400"><div v-if="property.climate.fireSources.primary.insuranceSeparatePolicy === 'LIKELY_REQUIRED'" class="text-red-400 mt-1">Insurance Note: Separate fire insurance policy likely required.</div><div v-else class="mt-1 italic">Standard policy likely sufficient.</div></div>
                </div><div v-else class="text-slate-400 text-sm italic">Fire risk data not available.</div>
                <div v-if="property.climate.floodSources?.primary?.riskScore?.label" class="bg-slate-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-2"><div class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1.944A8.056 8.056 0 0118.056 10 8.056 8.056 0 111.944 10 8.056 8.056 0 0110 1.944zM8.77 13.707a.75.75 0 001.06 0l4.25-4.25a.75.75 0 00-1.06-1.06L9.28 11.94l-1.97-1.97a.75.75 0 00-1.06 1.06l2.5 2.5.02.017z" clip-rule="evenodd" /></svg> Flood Risk</div><div class="px-2 py-1 rounded text-xs font-medium" :class="getRiskClass(property.climate.floodSources.primary.riskScore.label)">{{ property.climate.floodSources.primary.riskScore.label }}</div></div>
                  <div class="text-sm text-slate-400"><div v-if="property.climate.floodSources.primary.femaZone" class="mt-1">FEMA Zone: {{ property.climate.floodSources.primary.femaZone }}</div><div v-else class="mt-1 italic">FEMA Zone data not available.</div></div>
                </div><div v-else class="text-slate-400 text-sm italic">Flood risk data not available.</div>
                <div v-if="property.climate.heatSources?.primary?.riskScore?.label" class="bg-slate-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-2"><div class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>Heat Risk</div><div class="px-2 py-1 rounded text-xs font-medium" :class="getRiskClass(property.climate.heatSources.primary.riskScore.label)">{{ property.climate.heatSources.primary.riskScore.label }}</div></div>
                  <div class="text-sm text-slate-400"><div v-if="property.climate.heatSources.primary.hotDays?.[0]?.dayCount" class="mt-1">Est. hot days (>{{ property.climate.heatSources.primary.hotDays[0].thresholdValue || 'N/A' }}°{{ property.climate.heatSources.primary.hotDays[0].thresholdUnit || 'F' }}) per year: {{ property.climate.heatSources.primary.hotDays[0].dayCount }}</div><div v-else class="mt-1 italic">Hot days data not available.</div></div>
                </div><div v-else class="text-slate-400 text-sm italic">Heat risk data not available.</div>
              </div>
            </div>
            <div v-else class="bg-slate-900 rounded-lg border border-slate-800 p-6 text-slate-400 italic">Climate risk data not available for this property.</div>
  
            <!-- Tax History -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /> <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>Tax History</h2>
              <div v-if="property.taxHistory && property.taxHistory.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead><tr class="border-b border-slate-700"><th class="text-left py-2 font-medium text-slate-400">Year</th><th class="text-right py-2 font-medium text-slate-400">Tax Paid</th><th class="text-right py-2 font-medium text-slate-400">Assessed Value</th><th class="text-right py-2 font-medium text-slate-400 pr-2">% Change</th></tr></thead>
                  <tbody><tr v-for="(tax, index) in property.taxHistory.slice(0, 5)" :key="tax.time || index" class="border-b border-slate-800 last:border-b-0"><td class="py-2">{{ tax.time ? new Date(tax.time).getFullYear() : 'N/A' }}</td><td class="py-2 text-right">{{ tax.taxPaid ? formatPrice(tax.taxPaid) : 'N/A' }}</td><td class="py-2 text-right">{{ tax.value ? formatPrice(tax.value) : 'N/A' }}</td><td class="py-2 text-right pr-2" :class="tax.valueIncreaseRate == null ? '' : (tax.valueIncreaseRate > 0 ? 'text-green-500' : 'text-red-500')">{{ tax.valueIncreaseRate != null ? (tax.valueIncreaseRate * 100).toFixed(1) + '%' : 'N/A' }}</td></tr></tbody>
                </table>
              </div><div v-else class="text-slate-400 text-sm italic">No tax history available.</div>
            </div>
  
            <!-- Price History -->
            <div class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.03 5.03a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L5.03 6.09a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm1.03 4.97a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm9-11.94a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L13.97 5.03a.75.75 0 010-1.06zM17 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0117 10zm-2.03 4.97a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM10 15a5 5 0 110-10 5 5 0 010 10zm0-1.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clip-rule="evenodd" /></svg>Price History</h2>
              <div v-if="property.priceHistory && property.priceHistory.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead><tr class="border-b border-slate-700"><th class="text-left py-2 font-medium text-slate-400">Date</th><th class="text-left py-2 font-medium text-slate-400">Event</th><th class="text-right py-2 font-medium text-slate-400">Price</th><th class="text-right py-2 font-medium text-slate-400 pr-2">$/sqft</th></tr></thead>
                  <tbody><tr v-for="(history, index) in property.priceHistory.slice(0, 5)" :key="history.date || index" class="border-b border-slate-800 last:border-b-0"><td class="py-2">{{ formatDate(history.date) }}</td><td class="py-2">{{ history.event || 'N/A' }}</td><td class="py-2 text-right">{{ formatPrice(history.price) }}</td><td class="py-2 text-right pr-2">{{ history.pricePerSquareFoot ? '$' + formatNumber(history.pricePerSquareFoot) : 'N/A' }}</td></tr></tbody>
                </table>
              </div><div v-else class="text-slate-400 text-sm italic">No price history available.</div>
            </div>
  
            <!-- Nearby Schools -->
            <div v-if="property.schools && property.schools.length > 0" class="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>Nearby Schools</h2>
              <div class="space-y-3">
                <div v-for="(school, index) in property.schools" :key="school.name || index" class="bg-slate-800 p-4 rounded-lg">
                  <div class="flex justify-between items-start gap-4">
                    <div class="flex-grow"><div class="font-semibold">{{ school.name || 'N/A' }}</div><div class="text-sm text-slate-400 mt-1">{{ school.level || 'N/A' }} • {{ school.type || 'N/A' }} • Grades {{ school.grades || 'N/A' }}</div><div class="text-sm text-slate-400 mt-1">{{ school.distance ? school.distance.toFixed(1) : 'N/A' }} miles away</div></div>
                    <div v-if="school.rating != null" class="flex-shrink-0"><div class="px-2 py-1 rounded text-white text-sm font-medium" :class="getSchoolRatingClass(school.rating)">{{ school.rating }}/10</div></div><div v-else class="flex-shrink-0 text-sm text-slate-500 italic">N/A</div>
                  </div>
                </div>
              </div>
            </div><div v-else class="bg-slate-900 rounded-lg border border-slate-800 p-6 text-slate-400 italic">Nearby school data not available.</div>
  
          </div> <!-- End Right Column -->
        </div> <!-- End Main Content Grid -->
  
        <!-- Similar Homes Nearby (Full Width Section Below Main Grid) -->
        <div v-if="property.nearbyHomes && property.nearbyHomes.length > 0" class="bg-slate-900 rounded-lg border border-slate-800 p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            Similar Homes Nearby
          </h2>
          <!-- Responsive grid for similar homes -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(home, index) in property.nearbyHomes.slice(0, 6)" :key="home.zpid || index" class="bg-slate-800 p-3 rounded-lg flex items-center gap-3">
              <div class="w-20 h-20 flex-shrink-0 bg-slate-700 rounded-md overflow-hidden">
                <img
                  v-if="home.miniCardPhotos?.[0]?.url"
                  :src="home.miniCardPhotos[0].url"
                  :alt="home.address?.streetAddress || 'Nearby home'"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image</div>
              </div>
              <div class="flex-grow overflow-hidden">
                <div class="text-sm font-medium truncate">{{ home.address?.streetAddress || 'N/A' }}</div>
                <div class="text-xs text-slate-400">
                  {{ home.bedrooms || '?' }} bd • {{ home.bathrooms || '?' }} ba • {{ formatNumber(home.livingArea) || '?' }} sqft
                </div>
                <div class="text-sm font-semibold text-blue-300 mt-1">{{ formatPrice(home.price) }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ home.homeStatus || '' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-slate-900 rounded-lg border border-slate-800 p-6 text-slate-400 italic">
          Similar nearby homes data not available.
        </div>
  
      </div> <!-- End v-else-if="property" -->
      <div v-else class="container mx-auto px-4 py-12 text-center text-slate-400 italic">
        Property data could not be loaded or is unavailable.
      </div>
    </div> <!-- End Root Element -->
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MapDisplay from '~/components/MapDisplay.vue'; // Ensure this path is correct
  
  // --- Configuration ---
  // IMPORTANT: Ensure ZILLOW_API_KEY and MAPBOX_API_TOKEN are set in your .env
  // and exposed via runtimeConfig.public in nuxt.config.ts
  const config = useRuntimeConfig();
  const mapboxToken = config.public.MAPBOX_API_TOKEN;
  const zillowApiKey = config.public.ZILLOW_API_KEY;
  const ZILLOW_API_HOST = 'zillow-com1.p.rapidapi.com'; // Or your chosen RapidAPI host
  
  // --- State ---
  const route = useRoute();
  const router = useRouter();
  
  const property = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const isSaved = ref(false); // NOTE: This is local state only, not persistent
  const selectedImage = ref(null); // For gallery main image display
  
  // Investment calculator variables
  const investment = reactive({
    purchasePrice: 0,
    downPaymentPercent: 20,
    interestRate: 6.5, // Consider fetching current rates
    loanTerm: 30,
    monthlyRent: 0,
    propertyTax: 0,
    insurance: 0,
    maintenancePercent: 5, // Common estimate
    vacancyRate: 5,        // Common estimate
    propertyManagementPercent: 8 // Common estimate if using PM
  });
  
  // --- Helper Functions ---
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
  
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    // Handle both timestamp numbers and date strings
    const date = typeof dateInput === 'number' ? new Date(dateInput) : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getRiskClass = (riskLabel) => {
    if (!riskLabel) return 'bg-slate-700 text-white';
    const labelUpper = riskLabel.toUpperCase();
    switch (labelUpper) {
      case 'MINIMAL': return 'bg-green-900 text-green-200';
      case 'MINOR': return 'bg-green-800 text-green-200';
      case 'MODERATE': return 'bg-yellow-800 text-yellow-200';
      case 'MAJOR': return 'bg-orange-800 text-orange-200';
      case 'SEVERE': return 'bg-red-800 text-red-200';
      case 'EXTREME': return 'bg-red-900 text-red-200';
      default: return 'bg-slate-700 text-white';
    }
  };
  
  const getSchoolRatingClass = (rating) => {
    if (rating == null || isNaN(rating)) return 'bg-slate-700';
    if (rating >= 8) return 'bg-green-300';
    if (rating >= 6) return 'bg-yellow-600';
    if (rating >= 4) return 'bg-orange-600';
    return 'bg-red-600';
  };
  
  const onImageError = (event) => {
    // Handle cases where the primary image fails to load
    event.target.src = 'https://via.placeholder.com/800x600/2a3746/FFFFFF?text=Image+Load+Error';
    event.target.alt = 'Image failed to load';
  };
  
  // --- Investment Calculations (Computed) ---
  const calculatedResults = computed(() => {
    const purchasePrice = Number(investment.purchasePrice) || 0;
    const downPaymentPercent = Number(investment.downPaymentPercent) || 0;
    const interestRate = Number(investment.interestRate) || 0;
    const loanTerm = Number(investment.loanTerm) || 30;
    const monthlyRent = Number(investment.monthlyRent) || 0;
    const propertyTax = Number(investment.propertyTax) || 0;
    const insurance = Number(investment.insurance) || 0;
    const maintenancePercent = Number(investment.maintenancePercent) || 0;
    const vacancyRate = Number(investment.vacancyRate) || 0;
    const propertyManagementPercent = Number(investment.propertyManagementPercent) || 0;
  
    if (purchasePrice <= 0) {
        return { monthlyMortgage: 0, totalMonthlyExpenses: 0, monthlyCashFlow: 0, annualCashFlow: 0, capRate: 0, cashOnCash: 0 };
    }
  
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
  
    // Monthly P&I (Principal & Interest)
    let monthlyMortgage = 0;
    if (loanAmount > 0 && loanTerm > 0) {
        const monthlyInterestRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTerm * 12;
        if (monthlyInterestRate > 0) {
            monthlyMortgage = loanAmount *
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        } else {
            monthlyMortgage = loanAmount / numberOfPayments; // Handles 0% interest case
        }
    }
  
    // Monthly Expenses (PITI + Others)
    const propertyTaxMonthly = propertyTax / 12;
    const insuranceMonthly = insurance / 12;
    const maintenanceMonthly = monthlyRent * (maintenancePercent / 100);
    const vacancyMonthly = monthlyRent * (vacancyRate / 100);
    const propertyManagementMonthly = monthlyRent * (propertyManagementPercent / 100);
  
    const totalMonthlyExpenses = monthlyMortgage + propertyTaxMonthly + insuranceMonthly +
        maintenanceMonthly + vacancyMonthly + propertyManagementMonthly;
  
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
  
    // Cap Rate = Annual NOI / Purchase Price
    // NOI (Net Operating Income) = Annual Rent - Annual Operating Expenses (excluding mortgage)
    const annualOperatingExpenses = (propertyTaxMonthly + insuranceMonthly + maintenanceMonthly + vacancyMonthly + propertyManagementMonthly) * 12;
    const annualNOI = (monthlyRent * 12) - annualOperatingExpenses;
    const capRate = purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0;
  
    // Cash on Cash Return = Annual Cash Flow / Total Cash Invested
    const cashInvested = downPayment; // Simplified: assumes down payment is the primary cash invested
    const cashOnCash = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;
  
    return {
      monthlyMortgage: isNaN(monthlyMortgage) ? 0 : monthlyMortgage,
      totalMonthlyExpenses: isNaN(totalMonthlyExpenses) ? 0 : totalMonthlyExpenses,
      monthlyCashFlow: isNaN(monthlyCashFlow) ? 0 : monthlyCashFlow,
      annualCashFlow: isNaN(annualCashFlow) ? 0 : annualCashFlow,
      capRate: isNaN(capRate) ? 0 : capRate,
      cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash
    };
  });
  
  // Investment Rating Logic
  const investmentRating = computed(() => {
    const { capRate, cashOnCash, monthlyCashFlow } = calculatedResults.value;
    if (isNaN(capRate) || isNaN(cashOnCash) || isNaN(monthlyCashFlow)) return 'N/A';
  
    if (capRate >= 7 && cashOnCash >= 10 && monthlyCashFlow > 250) return 'Excellent';
    if (capRate >= 5.5 && cashOnCash >= 8 && monthlyCashFlow > 150) return 'Good';
    if (capRate >= 4 && cashOnCash >= 5 && monthlyCashFlow > 0) return 'Fair';
    if (monthlyCashFlow > -100) return 'Marginal'; // Slightly negative might be acceptable short term
    return 'Poor';
  });
  
  const ratingClass = computed(() => {
    switch (investmentRating.value) {
      case 'Excellent': return 'bg-green-300 text-white';
      case 'Good': return 'bg-green-600 text-white';
      case 'Fair': return 'bg-yellow-600 text-white';
      case 'Marginal': return 'bg-orange-600 text-white';
      case 'Poor': return 'bg-red-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  });
  
  const ratingDescription = computed(() => {
    switch (investmentRating.value) {
      case 'Excellent': return 'Potentially strong cash flow and high returns.';
      case 'Good': return 'Potentially solid returns with positive cash flow.';
      case 'Fair': return 'Potentially moderate returns, positive cash flow likely.';
      case 'Marginal': return 'Low or slightly negative cash flow; requires careful analysis.';
      case 'Poor': return 'Likely negative cash flow; high risk investment.';
      default: return 'Enter valid inputs for analysis.';
    }
  });
  
  // --- Actions ---
  const toggleSaved = () => {
    isSaved.value = !isSaved.value;
    // In a real app, you'd call an API here to update the user's saved properties
    console.log('Property saved state toggled (local only)');
  };
  
  const shareProperty = async () => {
    const shareData = {
      title: `${property.value?.streetAddress || 'Property'}, ${property.value?.city || ''}, ${property.value?.state || ''}`,
      text: `Check out this property: ${property.value?.streetAddress || 'Property Details'}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Property shared successfully');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!'); // Simple fallback
      } else {
          alert('Sharing not supported on this browser.');
      }
    } catch (err) {
      console.error('Error sharing property:', err);
      // Avoid alerting if user cancels share dialog ('AbortError')
      if (err.name !== 'AbortError') {
          alert('Could not share property.');
      }
    }
  };
  
  const printPage = () => {
    window.print();
  };
  
  const selectImage = (imageUrl) => {
    selectedImage.value = imageUrl;
  };
  
  // --- Data Fetching ---
  const fetchPropertyData = async () => {
    const zpid = route.params.zpid;
    if (!zpid) {
      error.value = 'No property ZPID provided in the URL.';
      loading.value = false;
      return;
    }
     if (!zillowApiKey) {
      error.value = 'Zillow API key is missing or not configured.';
      loading.value = false;
      return;
    }
  
    loading.value = true;
    error.value = null;
    property.value = null; // Reset property data on refetch
    selectedImage.value = null; // Reset selected image
  
    try {
      // 1. Fetch Property Details
      const propertyResponse = await fetch(`https://${ZILLOW_API_HOST}/property?zpid=${zpid}`, {
        headers: {
          'X-RapidAPI-Key': zillowApiKey,
          'X-RapidAPI-Host': ZILLOW_API_HOST
        }
      });
  
      if (!propertyResponse.ok) {
        const errorBody = await propertyResponse.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API Error: ${propertyResponse.status} ${propertyResponse.statusText}. Check console for details.`);
      }
  
      const data = await propertyResponse.json();
  
      // Basic validation of received data
      if (!data || !data.zpid) {
        throw new Error('Property data not found or incomplete response from API.');
      }
  
      // Set property data
      property.value = data;
  
      // Set initial investment values based on fetched property data (only if not already user-modified?)
      // Consider if you want to overwrite user input on refetch. Maybe only set if current value is 0.
      if (investment.purchasePrice === 0) investment.purchasePrice = data.zestimate || 0;
      if (investment.monthlyRent === 0) investment.monthlyRent = data.rentZestimate || 0;
      if (investment.propertyTax === 0) investment.propertyTax = data.taxAnnualAmount || data.resoFacts?.taxAnnualAmount || 0; // Check both possible locations
      if (investment.insurance === 0) investment.insurance = data.annualHomeownersInsurance || 1200; // Add a fallback default?
  
      // Set initial selected image (use primary image URL if available)
      selectedImage.value = data.imgSrc || null;
  
      // 2. Fetch Images (can run concurrently or sequentially)
      // We'll run sequentially here for simplicity, but could use Promise.all for parallel
      try {
          const imagesResponse = await fetch(`https://${ZILLOW_API_HOST}/images?zpid=${data.zpid}`, {
            headers: {
              'X-RapidAPI-Key': zillowApiKey,
              'X-RapidAPI-Host': ZILLOW_API_HOST
            }
          });
  
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            // Ensure imagesData.images is an array before assigning
            if (imagesData && Array.isArray(imagesData.images)) {
               // Add the main imgSrc to the beginning if it's not already in the list (simple check)
              const mainImageExists = imagesData.images.some(img => (img.url || img) === data.imgSrc);
              if (data.imgSrc && !mainImageExists) {
                   property.value.images = [data.imgSrc, ...imagesData.images];
              } else {
                   property.value.images = imagesData.images;
              }
              // If no main imgSrc but images exist, set selectedImage to the first one
              if (!selectedImage.value && property.value.images.length > 0) {
                  selectedImage.value = property.value.images[0].url || property.value.images[0];
              }
            } else {
                // If main imgSrc exists but no other images, create an array with just that
                property.value.images = data.imgSrc ? [data.imgSrc] : [];
            }
          } else {
              console.warn(`Failed to fetch images: ${imagesResponse.status} ${imagesResponse.statusText}`);
              property.value.images = data.imgSrc ? [data.imgSrc] : []; // Fallback to only main image if fetch fails
          }
      } catch (imageError) {
          console.error('Error fetching Zillow images:', imageError);
          property.value.images = data.imgSrc ? [data.imgSrc] : []; // Fallback on error
      }
  
  
    } catch (err) {
      console.error('Error fetching property data:', err);
      error.value = err.message || 'An unexpected error occurred while fetching property data.';
      property.value = null; // Ensure property is null on error
    } finally {
      loading.value = false;
    }
  };
  
  // --- Lifecycle Hooks ---
  onMounted(() => {
    // Initial check for critical configuration
    if (!zillowApiKey) {
      error.value = 'Zillow API key configuration is missing. Please check environment variables and Nuxt config.';
      loading.value = false;
      return;
    }
     if (!mapboxToken) {
         console.warn('Mapbox API token configuration is missing. Map will not display.');
         // Don't block loading for map token, but log a warning.
     }
  
    fetchPropertyData();
  });
  
  </script>
  <style>
  @media print {
    .print\:hidden {
      display: none !important;
    }
    body {
      background-color: white !important;
      color: black !important;
      -webkit-print-color-adjust: exact !important; /* For older WebKit browsers */
      print-color-adjust: exact !important; /* Standard property */
    }
    .bg-slate-950, .bg-slate-900, .bg-slate-800 {
      background-color: white !important;
      border: 1px solid #eee !important;
      color: black !important;
      box-shadow: none !important; /* Remove shadows for print */
    }
    .text-white, .text-slate-300, .text-slate-400, .text-blue-300, .text-blue-400,
    .text-green-500, .text-red-500, .text-orange-500, .text-yellow-500,
    .text-green-200, .text-yellow-200, .text-orange-200, .text-red-200,
    .text-slate-500 {
      color: black !important; /* Simplify colors for print */
    }
    .text-blue-300, .text-blue-400 {
       color: #0056b3 !important; /* Use a darker blue for better print contrast if needed */
    }
     .border-slate-700, .border-slate-800, .border-slate-600, .border-blue-500, .border-transparent {
         border-color: #ccc !important; /* Simplify borders */
     }
     .border-2 {
         border-width: 1px !important; /* Reduce border thickness for print */
     }
  
     /* Hide map in print view unless specifically designed for it */
     /* Adjust selector if MapDisplay component structure changes */
     .lg\:col-span-2 > div:has(> .MapDisplay), /* More robust selector if MapDisplay is direct child */
     .lg\:col-span-2 > div > .MapDisplay /* Original selector as fallback */
      {
         display: none !important;
     }
  
     /* Adjust layout for print */
     .container {
         max-width: 100% !important;
         padding: 0 !important;
         margin: 0 !important;
     }
     .grid {
         display: block !important; /* Stack grid items */
     }
     .lg\:col-span-2, .lg\:col-span-1, .md\:grid-cols-2 > *, .lg\:grid-cols-3 > *, .lg\:grid-cols-4 > * {
         width: 100% !important;
         margin-bottom: 1rem; /* Add some space between stacked items */
     }
     .gap-6, .gap-4, .space-y-6, .space-y-4, .space-y-3 {
         gap: 0.5rem !important; /* Reduce gaps */
         row-gap: 0.5rem !important;
         margin-bottom: 0.5rem !important;
     }
     h1, h2, h3 {
         page-break-after: avoid;
         margin-top: 1rem;
         margin-bottom: 0.5rem;
     }
     table, .bg-slate-800.p-4.rounded-lg { /* Keep table rows and risk boxes together */
         page-break-inside: avoid;
     }
     img {
         max-width: 100% !important;
         height: auto !important;
     }
     /* Ensure SVGs remain visible if needed, adjust color if necessary */
     svg {
         fill: currentColor !important;
     }
  }
  </style>