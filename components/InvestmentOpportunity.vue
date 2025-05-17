<template>
  <div
    class="bg-gradient-to-br from-black to-gray-900 rounded-xl border border-yellow-gold/30 shadow-xl overflow-hidden"
  >
    <!-- Header -->
    <div
      class="p-6 border-b border-yellow-gold/30 flex items-center justify-between bg-black/50"
    >
      <h2 class="text-xl font-bold flex items-center text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-3 text-yellow-gold"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        Investment Scenario Analysis
      </h2>
      <div class="text-xs text-gray-400 flex items-center">
        <span v-if="props.property?.zestimate" class="font-medium">
          Zestimate: {{ formatPrice(props.property.zestimate) }}
        </span>
      </div>
    </div>

    <!-- Scenario Selection Tabs -->
    <div class="px-6 pt-4 bg-black/30">
      <div
        class="flex items-center border-b border-yellow-gold/20 overflow-x-auto hide-scrollbar"
      >
        <button
          v-for="scenario in scenarios"
          :key="scenario.id"
          @click="selectedScenario = scenario.id"
          :class="[
            'relative min-w-fit px-4 py-3 font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:ring-offset-0 whitespace-nowrap -mb-px',
            selectedScenario === scenario.id
              ? 'text-yellow-gold border-b-2 border-yellow-gold'
              : 'text-gray-400 hover:text-gray-300 border-b-2 border-transparent hover:border-gray-600',
          ]"
        >
          {{ scenario.name }}
        </button>
      </div>
    </div>

    <!-- Scenario Content Area -->
    <div class="p-6">
      <!-- ########################## -->
      <!-- ## Subject-To Scenario ### -->
      <!-- ########################## -->
      <div v-if="selectedScenario === 'Subto'" class="space-y-6">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 class="text-lg font-semibold text-yellow-gold">
              Subject-To / Hybrid Analysis
            </h3>
            <p class="text-sm text-gray-400 italic mt-1">
              Analyze taking over existing financing, potentially with seller
              carryback.
            </p>
          </div>
          <span
            class="bg-yellow-gold/10 text-yellow-gold text-xs px-3 py-1 rounded-full font-medium"
            >Hybrid Financing</span
          >
        </div>

        <!-- Required Fields Alert -->
        <div
          class="p-4 border border-dashed border-amber-500/30 rounded-lg bg-amber-500/5 flex items-start space-x-3"
        >
          <div class="text-amber-400/90 mt-1 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-grow">
            <label
              for="existingLoanBalance"
              class="block text-sm font-medium text-amber-400 mb-2"
            >
              Enter Existing Loan Balance to Begin
            </label>
            <div class="flex gap-3 items-center">
              <div class="relative flex-grow">
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none"
                  >$</span
                >
                <input
                  id="existingLoanBalance"
                  v-model.number="subtoInputs.existingLoanBalance"
                  type="number"
                  min="0"
                  placeholder="e.g., 250000"
                  class="input-field pl-8 !border-amber-500/30 focus:!border-amber-500 focus:!ring-amber-500/40"
                />
              </div>
              <button
                @click="autoFillMortgageData"
                class="px-3 py-1.5 rounded-lg border border-yellow-gold/30 bg-yellow-gold/10 hover:bg-yellow-gold/20 text-yellow-gold text-xs transition"
              >
                Auto-Fill
              </button>
              <button
                @click="subtoInputs.existingLoanBalance = null"
                v-if="subtoInputs.existingLoanBalance"
                class="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-400 text-xs transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div v-if="subtoInputs.existingLoanBalance > 0" class="space-y-6">
          <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Subto Inputs Col 1 -->
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
                Deal Structure
              </h4>
              <div class="input-group">
                <label class="input-label">Purchase Price ($)</label>
                <div class="relative">
                  <span class="input-symbol-left">$</span>
                  <input
                    v-model.number="subtoInputs.purchasePrice"
                    type="number"
                    min="0"
                    class="input-field pl-8"
                    placeholder="Enter purchase price"
                  />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Existing Loan Balance ($)</label>
                <div class="relative">
                  <span class="input-symbol-left">$</span>
                  <input
                    :value="formatNumber(subtoInputs.existingLoanBalance)"
                    type="text"
                    class="input-field pl-8 bg-gray-800/50 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Cash to Seller at Closing ($)</label>
                <div class="relative">
                  <span class="input-symbol-left">$</span>
                  <input
                    v-model.number="subtoInputs.cashToSeller"
                    type="number"
                    min="0"
                    class="input-field pl-8"
                    placeholder="Cash to seller"
                  />
                </div>
              </div>
              <div class="input-group">
                <div class="flex items-center justify-between">
                  <label class="input-label"
                    >Existing Loan Monthly PITI ($)</label
                  >
                  <span class="text-red-400 text-xs font-medium">Required</span>
                </div>
                <div class="relative">
                  <span class="input-symbol-left">$</span>
                  <input
                    v-model.number="subtoInputs.existingLoanPITI"
                    type="number"
                    min="0"
                    placeholder="Principal, Interest, Tax, Insurance"
                    class="input-field pl-8 border-amber-500/30 focus:border-amber-500 focus:ring-amber-500/40"
                  />
                </div>
                <p class="input-help">
                  Required estimate for the loan being taken over.
                </p>
              </div>
            </div>

            <!-- Subto Inputs Col 2 -->
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
                Financing Options
              </h4>

              <!-- NEW: Include Seller Carryback Toggle -->
              <div class="input-group">
                <div class="flex items-center justify-between">
                  <label class="input-label">Include Seller Carryback</label>
                  <div class="relative">
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="subtoInputs.includeSellerCarryback"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-gold/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-gold/50"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="bg-gray-900/70 rounded-lg p-4 border border-yellow-gold/30 shadow-sm"
              >
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-300">
                    Calculated Seller Carryback:
                  </p>
                  <p class="text-lg font-semibold text-yellow-gold">
                    {{ formatPrice(subtoCalculated.sellerCarryAmount) }}
                  </p>
                </div>
              </div>

              <!-- MODIFIED: Conditional Seller Carryback Options -->
              <template v-if="subtoInputs.includeSellerCarryback && subtoCalculated.sellerCarryAmount > 0">
                <div class="input-group">
                  <label class="input-label"
                    >Seller Carry Interest Rate (%)</label
                  >
                  <div class="relative">
                    <input
                      v-model.number="subtoInputs.sellerCarryRate"
                      type="number"
                      step="0.1"
                      min="0"
                      class="input-field pr-8"
                      placeholder="Interest rate"
                    />
                    <span class="input-symbol-right">%</span>
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Seller Carry Term (Years)</label>
                  <div class="relative">
                    <input
                      v-model.number="subtoInputs.sellerCarryTerm"
                      type="number"
                      min="1"
                      class="input-field pr-10"
                      placeholder="Loan term"
                    />
                    <span class="input-symbol-right pr-3">yrs</span>
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label"
                    >Balloon Payment Term (Years)</label
                  >
                  <div class="relative">
                    <input
                      v-model.number="subtoInputs.balloonTerm"
                      type="number"
                      min="1"
                      max="30"
                      class="input-field pr-10"
                      placeholder="Balloon term"
                    />
                    <span class="input-symbol-right pr-3">yrs</span>
                  </div>
                  <p class="input-help">
                    Term for balloon payment (shorter than amortization)
                  </p>
                </div>
              </template>
              <template v-else>
                 <div class="bg-gray-900/30 rounded-lg p-4 border border-yellow-gold/20 flex items-center text-gray-400 italic text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path v-if="subtoInputs.includeSellerCarryback" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <span v-if="!subtoInputs.includeSellerCarryback">Seller Carryback is disabled.</span>
                    <span v-else>No Seller Carryback needed.</span>
                  </div>
              </template>

              <div class="input-group">
                <label class="input-label">Est. Closing Costs (%)</label>
                <div class="flex gap-2">
                  <div class="relative flex-grow">
                    <input
                      v-model.number="subtoInputs.closingCostsPercent"
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      class="input-field pr-8"
                      placeholder="Closing cost %"
                    />
                    <span class="input-symbol-right">%</span>
                  </div>
                  <select
                    v-model="subtoInputs.closingCostsPaidBy"
                    class="input-select flex-shrink-0 w-auto"
                  >
                    <option value="Buyer">Buyer Pays</option>
                    <option value="Seller">Seller Pays</option>
                    <option value="Split">Split</option>
                  </select>
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Est. Commissions (%)</label>
                <div class="flex gap-2">
                  <div class="relative flex-grow">
                    <input
                      v-model.number="subtoInputs.commissionPercent"
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      class="input-field pr-8"
                      placeholder="Commission %"
                    />
                    <span class="input-symbol-right">%</span>
                  </div>
                  <select
                    v-model="subtoInputs.commissionPaidBy"
                    class="input-select flex-shrink-0 w-auto"
                  >
                    <option value="Seller">Seller Pays</option>
                    <option value="Buyer">Buyer Pays</option>
                    <option value="Split">Split</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Subto Common Inputs -->
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
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="input-group">
                  <label class="input-label-sm">Monthly Rent ($)</label>
                  <div class="relative">
                    <span class="input-symbol-left">$</span>
                    <input
                      v-model.number="subtoInputs.monthlyRent"
                      type="number"
                      min="0"
                      class="input-field pl-8"
                      placeholder="Monthly rent"
                    />
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label-sm">Vacancy (%)</label>
                  <div class="relative">
                    <input
                      v-model.number="subtoInputs.vacancyRate"
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
                      v-model.number="subtoInputs.maintenanceRate"
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
                      v-model.number="subtoInputs.managementRate"
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

          <!-- Subto Results -->
          <div
            v-if="subtoInputs.existingLoanPITI > 0"
            class="pt-6 mt-6 border-t border-yellow-gold/20"
          >
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
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-yellow-gold/10"
              >
                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Total Cash Needed
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{ formatPrice(subtoCalculated.totalCashNeeded) }}
                  </div>
                  <div class="text-xs text-gray-500 italic mt-1">
                    Cash to Seller + Buyer Costs
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Existing PITI
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{ formatPrice(subtoInputs.existingLoanPITI) }}/mo
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Seller Carry Pmt
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{
                      formatPrice(subtoCalculated.sellerCarryMonthlyPayment)
                    }}/mo
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Principal <span v-if="subtoCalculated.sellerCarryAmount > 0 && subtoInputs.includeSellerCarryback" class="text-gray-500">(Carry)</span>
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{ formatPrice(subtoCalculated.monthlyPrincipal) }}/mo
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Interest <span v-if="subtoCalculated.sellerCarryAmount > 0 && subtoInputs.includeSellerCarryback" class="text-gray-500">(Carry)</span>
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{ formatPrice(subtoCalculated.monthlyInterest) }}/mo
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Total Monthly Pmt
                  </div>
                  <div class="text-lg font-bold text-white mt-1">
                    {{
                      formatPrice(subtoCalculated.totalMonthlyHousingPayment)
                    }}/mo
                  </div>
                  <div class="text-xs text-gray-500 italic mt-1">
                    Existing PITI + Carryback
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
                      subtoCalculated.monthlyCashFlow >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    "
                  >
                    {{ formatPrice(subtoCalculated.monthlyCashFlow) }}/mo
                  </div>
                </div>

                <div class="p-4 relative">
                  <div
                    class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                  >
                    Est. Cash-on-Cash
                  </div>
                  <div
                    class="text-lg font-bold mt-1"
                    :class="
                      subtoCalculated.cashOnCash >= 8
                        ? 'text-green-400'
                        : subtoCalculated.cashOnCash >= 0
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    "
                  >
                    {{ subtoCalculated.cashOnCash.toFixed(1) }}%
                  </div>
                </div>

                <div
                  v-if="
                    subtoInputs.includeSellerCarryback &&
                    subtoCalculated.sellerCarryAmount > 0 &&
                    subtoInputs.balloonTerm &&
                    subtoInputs.balloonTerm < subtoInputs.sellerCarryTerm
                  "
                  class="p-4 relative bg-yellow-gold/5"
                >
                  <div
                    class="text-xs text-yellow-gold uppercase tracking-wider font-medium"
                  >
                    Balloon Payment
                  </div>
                  <div class="text-lg font-bold text-yellow-gold mt-1">
                    {{ formatPrice(subtoCalculated.balloonPayment) }}
                  </div>
                  <div class="text-xs text-gray-500 italic mt-1">
                    Due after {{ subtoInputs.balloonTerm }} years
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex items-center justify-center p-4 mt-6 text-amber-400 italic bg-amber-500/5 border border-amber-500/20 rounded-lg text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Enter Existing Loan Monthly PITI above to see full results.
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center text-center text-gray-500 italic py-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 mx-auto mb-3 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
          <p>
            Please enter the existing loan balance in the yellow box above<br />to
            calculate Subject-To details.
          </p>
        </div>
      </div>

      <!-- ############################# -->
      <!-- ## Seller Finance Scenario ## -->
      <!-- ############################# -->
      <div v-if="selectedScenario === 'SellerFinancing'" class="space-y-6">
        <!-- ... (Seller Financing content remains the same) ... -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 class="text-lg font-semibold text-yellow-gold">
              Seller Financing Analysis
            </h3>
            <p class="text-sm text-gray-400 italic mt-1">
              Analyze a deal where the seller provides the primary financing.
            </p>
          </div>
          <span
            class="bg-yellow-gold/10 text-yellow-gold text-xs px-3 py-1 rounded-full font-medium"
            >Creative Financing</span
          >
        </div>

        <!-- Input Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <!-- SF Inputs Col 1 -->
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
              Deal Structure
            </h4>
            <div class="input-group">
              <label class="input-label">Purchase Price ($)</label>
              <div class="relative">
                <span class="input-symbol-left">$</span>
                <input
                  v-model.number="sellerFinancingInputs.purchasePrice"
                  @input="sfPriceManuallySet = true"
                  type="number"
                  min="0"
                  class="input-field pl-8"
                  placeholder="Enter purchase price"
                />
              </div>
              <p
                v-if="!sfPriceManuallySet && props.property?.zestimate"
                class="input-help"
              >
                Default: Zestimate ({{ formatPrice(props.property.zestimate) }})
                + 10%
              </p>
            </div>
            <div class="input-group">
              <label class="input-label">Down Payment (%)</label>
              <div class="relative">
                <input
                  v-model.number="sellerFinancingInputs.downPaymentPercent"
                  @input="sfDownPaymentManuallySet = true"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="input-field pr-8"
                  placeholder="Down payment %"
                />
                <span class="input-symbol-right">%</span>
              </div>
              <p v-if="!sfDownPaymentManuallySet" class="input-help">
                Default: 6%
              </p>
            </div>
            <div class="input-group">
              <label class="input-label">Seller Note Interest Rate (%)</label>
              <div class="relative">
                <input
                  v-model.number="sellerFinancingInputs.sellerRate"
                  type="number"
                  step="0.1"
                  min="0"
                  class="input-field pr-8"
                  placeholder="Interest rate"
                />
                <span class="input-symbol-right">%</span>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label"
                >Seller Note Amortization (Years)</label
              >
              <div class="relative">
                <input
                  v-model.number="sellerFinancingInputs.sellerTerm"
                  type="number"
                  min="1"
                  class="input-field pr-10"
                  placeholder="Amortization period"
                />
                <span class="input-symbol-right pr-3">yrs</span>
              </div>
              <p class="input-help">
                Standard amortization period (typically 30 years)
              </p>
            </div>
            <div class="input-group">
              <label class="input-label">Balloon Payment Term (Years)</label>
              <div class="relative">
                <input
                  v-model.number="sellerFinancingInputs.balloonTerm"
                  type="number"
                  min="1"
                  max="30"
                  class="input-field pr-10"
                  placeholder="Balloon term"
                />
                <span class="input-symbol-right pr-3">yrs</span>
              </div>
              <p class="input-help">
                Term for balloon payment (shorter than amortization)
              </p>
            </div>
          </div>
          <!-- SF Inputs Col 2 -->
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
              Financing Summary & Costs
            </h4>
            <div
              class="bg-gray-900/70 rounded-lg p-4 border border-yellow-gold/30 shadow-sm space-y-3"
            >
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-300">Calculated Down Payment:</p>
                <p class="text-lg font-semibold text-yellow-gold">
                  {{ formatPrice(sellerFinancingCalculated.downPaymentAmount) }}
                </p>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-300">Calculated Seller Note:</p>
                <p class="text-lg font-semibold text-yellow-gold">
                  {{ formatPrice(sellerFinancingCalculated.sellerNoteAmount) }}
                </p>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-300">Monthly P&I Payment:</p>
                <p class="text-lg font-semibold text-yellow-gold">
                  {{
                    formatPrice(sellerFinancingCalculated.monthlyPaymentPI)
                  }}/mo
                </p>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Est. Closing Costs (%)</label>
              <div class="flex gap-2">
                <div class="relative flex-grow">
                  <input
                    v-model.number="sellerFinancingInputs.closingCostsPercent"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    class="input-field pr-8"
                    placeholder="Closing cost %"
                  />
                  <span class="input-symbol-right">%</span>
                </div>
                <select
                  v-model="sellerFinancingInputs.closingCostsPaidBy"
                  class="input-select flex-shrink-0 w-auto"
                >
                  <option value="Buyer">Buyer Pays</option>
                  <option value="Seller">Seller Pays</option>
                  <option value="Split">Split</option>
                </select>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Est. Commissions (%)</label>
              <div class="flex gap-2">
                <div class="relative flex-grow">
                  <input
                    v-model.number="sellerFinancingInputs.commissionPercent"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    class="input-field pr-8"
                    placeholder="Commission %"
                  />
                  <span class="input-symbol-right">%</span>
                </div>
                <select
                  v-model="sellerFinancingInputs.commissionPaidBy"
                  class="input-select flex-shrink-0 w-auto"
                >
                  <option value="Seller">Seller Pays</option>
                  <option value="Buyer">Buyer Pays</option>
                  <option value="Split">Split</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SF Common Inputs -->
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
                    v-model.number="sellerFinancingInputs.monthlyRent"
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
                    v-model.number="sellerFinancingInputs.propertyTax"
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
                    v-model.number="sellerFinancingInputs.insurance"
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
                    v-model.number="sellerFinancingInputs.vacancyRate"
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
                    v-model.number="sellerFinancingInputs.maintenanceRate"
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
                    v-model.number="sellerFinancingInputs.managementRate"
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

        <!-- SF Results -->
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
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723a3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
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
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-yellow-gold/10"
            >
              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Total Cash Needed
                </div>
                <div class="text-lg font-bold text-white mt-1">
                  {{ formatPrice(sellerFinancingCalculated.totalCashNeeded) }}
                </div>
                <div class="text-xs text-gray-500 italic mt-1">
                  Down Pmt + Buyer Costs
                </div>
              </div>

              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Seller Note Principal
                </div>
                <div class="text-lg font-bold text-white mt-1">
                  {{
                    formatPrice(sellerFinancingCalculated.monthlyPrincipal)
                  }}/mo
                </div>
              </div>

              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Seller Note Interest
                </div>
                <div class="text-lg font-bold text-white mt-1">
                  {{
                    formatPrice(sellerFinancingCalculated.monthlyInterest)
                  }}/mo
                </div>
              </div>

              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Monthly Tax & Ins
                </div>
                <div class="text-lg font-bold text-white mt-1">
                  {{
                    formatPrice(sellerFinancingCalculated.monthlyTaxInsurance)
                  }}/mo
                </div>
              </div>

              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Total Monthly PITI
                </div>
                <div class="text-lg font-bold text-white mt-1">
                  {{
                    formatPrice(sellerFinancingCalculated.totalMonthlyPITI)
                  }}/mo
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
                    sellerFinancingCalculated.monthlyCashFlow >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  "
                >
                  {{
                    formatPrice(sellerFinancingCalculated.monthlyCashFlow)
                  }}/mo
                </div>
              </div>

              <div class="p-4 relative">
                <div
                  class="text-xs text-gray-400 uppercase tracking-wider font-medium"
                >
                  Est. Cash-on-Cash
                </div>
                <div
                  class="text-lg font-bold mt-1"
                  :class="
                    sellerFinancingCalculated.cashOnCash >= 8
                      ? 'text-green-400'
                      : sellerFinancingCalculated.cashOnCash >= 0
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  "
                >
                  {{ sellerFinancingCalculated.cashOnCash.toFixed(1) }}%
                </div>
              </div>

              <div
                v-if="
                  sellerFinancingInputs.balloonTerm &&
                  sellerFinancingInputs.balloonTerm <
                    sellerFinancingInputs.sellerTerm
                "
                class="p-4 relative bg-yellow-gold/5"
              >
                <div
                  class="text-xs text-yellow-gold uppercase tracking-wider font-medium"
                >
                  Balloon Payment
                </div>
                <div class="text-lg font-bold text-yellow-gold mt-1">
                  {{ formatPrice(sellerFinancingCalculated.balloonPayment) }}
                </div>
                <div class="text-xs text-gray-500 italic mt-1">
                  Due after {{ sellerFinancingInputs.balloonTerm }} years
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ####################### -->
      <!-- ## Cash Offer Scenario ## -->
      <!-- ####################### -->
      <div v-if="selectedScenario === 'Cash'" class="space-y-6">
        <!-- ... (Cash Offer content remains the same) ... -->
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
                v-if="!cashPriceManuallySet && props.property?.zestimate"
                class="input-help"
              >
                Default: Zestimate ({{ formatPrice(props.property.zestimate) }})
                - 30%
              </p>
            </div>
            <div class="input-group">
              <label class="input-label">Est. Closing Costs (%)</label>
              <div class="flex gap-2">
                <div class="relative flex-grow">
                  <input
                    v-model.number="cashOfferInputs.closingCostsPercent"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    class="input-field pr-8"
                    placeholder="Closing cost %"
                  />
                  <span class="input-symbol-right">%</span>
                </div>
                <select
                  v-model="cashOfferInputs.closingCostsPaidBy"
                  class="input-select flex-shrink-0 w-auto"
                >
                  <option value="Buyer">Buyer Pays</option>
                  <option value="Seller">Seller Pays</option>
                  <option value="Split">Split</option>
                </select>
              </div>
              <p class="input-help">
                Typically lower for cash deals (title, recording, etc.).
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
                <p class="text-sm text-gray-300">Calculated Closing Costs:</p>
                <p class="text-lg font-semibold text-yellow-gold">
                  {{ formatPrice(cashOfferCalculated.closingCostsAmount) }}
                </p>
              </div>
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
                  Total Cash Needed:
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
            <!-- Custom Offer Note -->
            <div class="input-group mt-4">
              <label class="input-label">Notes for Cash Offer</label>
              <textarea
                v-model="cashOfferInputs.notes"
                class="input-field p-3 h-24"
                placeholder="Add any additional notes or considerations for this cash offer"
              ></textarea>
            </div>
          </div>
          <!-- Cash Common Inputs -->
          <div class="md:col-span-2 pt-6 mt-2 border-t border-yellow-gold/20">
            <!-- Cash Common Inputs (Continued) -->
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
                  Total Cash Needed
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useInvestmentCalculatorStore } from "~/stores/investmentCalculator";

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  reapi_property: { // Specific REAPI data
    type: Object,
    required: true,
  },
});

// Initialize the Pinia store
const store = useInvestmentCalculatorStore();

// --- Scenario Selection ---
const scenarios = [
  { id: "SellerFinancing", name: "Seller Financing" },
  { id: "Subto", name: "Subject-To / Hybrid" },
  { id: "Cash", name: "Cash Offer" },
];

const selectedScenario = computed({
  get: () => store.selectedScenario,
  set: (value) => store.setSelectedScenario(value)
});

// --- Helper Functions ---
const formatPrice = (price) => {
  if (price == null || isNaN(Number(price))) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price));
};

const formatNumber = (num) => {
  if (num == null || isNaN(Number(num))) return "N/A";
  return new Intl.NumberFormat("en-US").format(Number(num));
};

const showAmortizationSchedule = computed({
  get: () => store.showAmortizationSchedule,
  set: () => store.toggleAmortizationSchedule() // Make sure this exists if used
});

// --- Create computed properties for two-way binding with inputs ---
const subtoInputs = computed({
  get: () => store.subtoInputs,
  set: (newValues) => store.updateSubtoInputs(newValues) // Ensure this action exists
});

const sellerFinancingInputs = computed({
  get: () => store.sellerFinancingInputs,
  set: (newValues) => store.updateSellerFinancingInputs(newValues)
});

const cashOfferInputs = computed({
  get: () => store.cashOfferInputs,
  set: (newValues) => store.updateCashOfferInputs(newValues)
});

// --- Manual Override Tracking ---
const sfPriceManuallySet = computed({
  get: () => store.sfPriceManuallySet,
  set: (value) => store.setSfPriceManuallySet(value)
});

const sfDownPaymentManuallySet = computed({
  get: () => store.sfDownPaymentManuallySet,
  set: (value) => store.setSfDownPaymentManuallySet(value)
});

const cashPriceManuallySet = computed({
  get: () => store.cashPriceManuallySet,
  set: (value) => store.setCashPriceManuallySet(value)
});

const autoFillMortgageData = () => {
  store.autoFillMortgageData();
};

// Get calculated values from the store
const subtoCalculated = computed(() => store.subtoCalculated);
const sellerFinancingCalculated = computed(() => store.sellerFinancingCalculated);
const cashOfferCalculated = computed(() => store.cashOfferCalculated);
// Amortization schedules if needed by other parts of your template (not shown in snippet)
// const sellerFinancingAmortizationSchedule = computed(() => store.sellerFinancingAmortizationSchedule);
// const subtoAmortizationSchedule = computed(() => store.subtoAmortizationSchedule);

watch(
  () => props.property,
  (newVal) => {
    if (!newVal) return;
    store.setPropertyData(props.property, props.reapi_property);
  },
  { immediate: true, deep: true }
);

watch(
  () => sellerFinancingInputs.value.purchasePrice,
  () => {
    sfPriceManuallySet.value = true;
  }
);

watch(
  () => sellerFinancingInputs.value.downPaymentPercent,
  () => {
    sfDownPaymentManuallySet.value = true;
  }
);

watch(
  () => cashOfferInputs.value.offerPrice,
  () => {
    cashPriceManuallySet.value = true;
  }
);

onMounted(() => {
  store.setPropertyData(props.property, props.reapi_property);
});
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Input Group Styling */
.input-group {
  @apply space-y-1 mb-2; /* Add slightly more bottom margin */
}

.input-field {
  @apply w-full h-10 bg-gray-900/70 border border-yellow-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:border-yellow-gold transition-all appearance-none;
  /* Padding is handled inline based on symbol */
}

.input-select {
  @apply h-10 px-3 py-2 bg-gray-900/70 border border-yellow-gold/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:border-yellow-gold transition-all;
}

.input-label {
  @apply block text-sm text-gray-400;
}

.input-label-sm {
  @apply block text-xs font-medium text-gray-400; /* Made slightly bolder */
}

.input-help {
  @apply text-xs text-gray-500 mt-1.5 italic; /* Increased top margin */
}

/* Input Symbols */
.input-symbol-left {
  @apply absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none;
}
.input-symbol-right {
  @apply absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none;
}

/* Section Header */
.section-header {
  @apply text-sm font-semibold text-gray-300 flex items-center mb-3; /* Increased bottom margin */
}
</style>