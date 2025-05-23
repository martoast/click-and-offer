<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 class="text-lg font-semibold text-yellow-gold">
            Cash Offer Analysis
          </h3>
          <p class="text-sm text-gray-400 italic mt-1">
            Analyze buying the property outright with cash.
          </p>
        </div>
        <span
          class="bg-yellow-gold/10 text-yellow-gold text-xs px-3 py-1 rounded-full font-medium"
          >All Cash</span
        >
      </div>
  
      <!-- Input Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <!-- Cash Inputs Col 1 -->
        <div class="space-y-4">
          <h4 class="section-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
              />
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clip-rule="evenodd"
              />
            </svg>
            Offer Details
          </h4>
          <div class="input-group">
            <label class="input-label">Cash Offer Price ($)</label>
            <div class="relative">
              <span class="input-symbol-left">$</span>
              <input
                v-model.number="cashOfferInputs.offerPrice"
                @input="cashPriceManuallySet = true"
                type="number"
                min="0"
                class="input-field pl-8"
                placeholder="Enter cash offer price"
              />
            </div>
            <p
              v-if="!cashPriceManuallySet && property?.zestimate"
              class="input-help"
            >
              Default: Zestimate ({{ formatPrice(property.zestimate) }})
              - 30%
            </p>
          </div>
          
          <!-- New Field: Custom Fields Section -->
          <div class="pt-4 mt-2 border-t border-yellow-gold/20">
            <h5 class="text-sm font-medium text-gray-300 mb-3">
              Additional Custom Fields
            </h5>
            <div class="input-group">
              <label class="input-label">Custom Amount 1 ($)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="cashOfferInputs.customAmount1"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Custom Amount 2 ($)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="cashOfferInputs.customAmount2"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Cash Inputs Col 2 (Less needed here) -->
        <div class="space-y-4">
          <h4 class="section-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                clip-rule="evenodd"
              />
            </svg>
            Cost Summary
          </h4>
          <div
            class="bg-gray-900/70 rounded-lg p-4 border border-yellow-gold/30 shadow-sm space-y-3"
          >
            
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-300">Additional Costs:</p>
              <p class="text-lg font-semibold text-yellow-gold">
                {{ formatPrice(cashOfferCalculated.additionalCosts) }}
              </p>
            </div>
            <div
              class="pt-3 border-t border-yellow-gold/20 flex justify-between items-center"
            >
              <p class="text-sm text-yellow-gold font-medium">
                Balance to Close:
              </p>
              <p class="text-lg font-semibold text-yellow-gold">
                {{ formatPrice(cashOfferCalculated.totalCashNeeded) }}
              </p>
            </div>
          </div>
          <div
            class="bg-yellow-gold/10 text-yellow-gold text-sm p-4 rounded-lg"
          >
            <div class="flex items-start space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <p>
                Cash offers often close faster and might secure a larger
                discount.
              </p>
            </div>
          </div>
          
        </div>
        <!-- Cash Common Inputs -->
        <div class="md:col-span-2 pt-6 mt-2 border-t border-yellow-gold/20">
          <h4 class="section-header mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            Income & Operating Expenses
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="input-group">
              <label class="input-label-sm">Monthly Rent ($)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="cashOfferInputs.monthlyRent"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Monthly rent"
                />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label-sm">Property Tax ($/yr)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="cashOfferInputs.propertyTax"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Annual tax"
                />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label-sm">Insurance ($/yr)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="cashOfferInputs.insurance"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Annual insurance"
                />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label-sm">Vacancy (%)</label>
              <div class="relative">
                <input
                  v-model.number="cashOfferInputs.vacancyRate"
                  type="number"
                  min="0"
                  max="100"
                  class="input-field pr-8"
                  placeholder="Vacancy rate"
                />
                <span class="input-symbol-right">%</span>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label-sm">Maintenance (%)</label>
              <div class="relative">
                <input
                  v-model.number="cashOfferInputs.maintenanceRate"
                  type="number"
                  min="0"
                  max="100"
                  class="input-field pr-8"
                  placeholder="Maintenance rate"
                />
                <span class="input-symbol-right">%</span>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label-sm">Management (%)</label>
              <div class="relative">
                <input
                  v-model.number="cashOfferInputs.managementRate"
                  type="number"
                  min="0"
                  max="100"
                  class="input-field pr-8"
                  placeholder="Management rate"
                />
                <span class="input-symbol-right">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Cash Results -->
      <div class="pt-6 mt-6 border-t border-yellow-gold/20">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h4 class="section-header text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Analysis Results
          </h4>
          <span class="text-xs text-gray-400 italic"
            >Monthly figures shown</span
          >
        </div>
  
        <div
          class="bg-gray-900/50 rounded-lg border border-yellow-gold/20 overflow-hidden"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-yellow-gold/10"
          >
            <div class="p-4 relative">
              <div
                class="text-xs text-gray-400 uppercase tracking-wider font-medium"
              >
                Balance to Close
              </div>
              <div class="text-lg font-bold text-white mt-1">
                {{ formatPrice(cashOfferCalculated.totalCashNeeded) }}
              </div>
              <div class="text-xs text-gray-500 italic mt-1">
                Offer Price + All Costs
              </div>
            </div>
  
            <div class="p-4 relative">
              <div
                class="text-xs text-gray-400 uppercase tracking-wider font-medium"
              >
                Annual Net Op. Income (NOI)
              </div>
              <div class="text-lg font-bold text-white mt-1">
                {{ formatPrice(cashOfferCalculated.annualNOI) }}
              </div>
            </div>
  
            <div class="p-4 relative">
              <div
                class="text-xs text-gray-400 uppercase tracking-wider font-medium"
              >
                Est. Monthly Cash Flow
              </div>
              <div
                class="text-lg font-bold mt-1"
                :class="
                  cashOfferCalculated.monthlyCashFlow >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                "
              >
                {{ formatPrice(cashOfferCalculated.monthlyCashFlow) }}/mo
              </div>
            </div>
  
            <div class="p-4 relative">
              <div
                class="text-xs text-gray-400 uppercase tracking-wider font-medium"
              >
                Est. Cap Rate
              </div>
              <div
                class="text-lg font-bold mt-1"
                :class="
                  cashOfferCalculated.capRate >= 5
                    ? 'text-green-400'
                    : 'text-orange-400'
                "
              >
                {{ cashOfferCalculated.capRate.toFixed(1) }}%
              </div>
              <div class="text-xs text-gray-500 italic mt-1">
                Annual NOI / Offer Price
              </div>
            </div>
  
            <div class="p-4 relative">
              <div
                class="text-xs text-gray-400 uppercase tracking-wider font-medium"
              >
                Est. Cash Return (CoC)
              </div>
              <div
                class="text-lg font-bold mt-1"
                :class="
                  cashOfferCalculated.cashOnCash >= 5
                    ? 'text-green-400'
                    : cashOfferCalculated.cashOnCash >= 0
                    ? 'text-yellow-400'
                    : 'text-red-400'
                "
              >
                {{ cashOfferCalculated.cashOnCash.toFixed(1) }}%
              </div>
              <div class="text-xs text-gray-500 italic mt-1">
                Annual CF / Total Cash
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useInvestmentCalculatorStore } from '~/stores/investmentCalculator';
  
  const props = defineProps({
    property: {
      type: Object,
      required: true,
    }
  });
  
  const store = useInvestmentCalculatorStore();
  
  // Create computed properties for two-way binding with inputs
  const cashOfferInputs = computed({
    get: () => store.cashOfferInputs,
    set: (newValues) => store.updateCashOfferInputs(newValues)
  });
  
  // Get calculated values from the store
  const cashOfferCalculated = computed(() => store.cashOfferCalculated);
  
  // Manual Override Tracking
  const cashPriceManuallySet = computed({
    get: () => store.cashPriceManuallySet,
    set: (value) => store.setCashPriceManuallySet(value)
  });
  
  // Helper Functions
  const formatPrice = (price) => {
    if (price == null || isNaN(Number(price))) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };
  </script>