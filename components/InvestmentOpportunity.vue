<template>
    <div class="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800/50 shadow-xl overflow-hidden">
  
      <!-- Header -->
      <div class="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
        <h2 class="text-xl font-bold flex items-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
          Investment Scenario Analysis
        </h2>
         <div class="text-xs text-slate-400 flex items-center">
           <span v-if="props.property?.zestimate" class="font-medium">
              Zestimate: {{ formatPrice(props.property.zestimate) }}
           </span>
         </div>
      </div>
  
      <!-- Scenario Selection Tabs -->
      <div class="px-6 pt-4 bg-slate-900/30">
         <div class="flex items-center border-b border-slate-700/50 overflow-x-auto hide-scrollbar">
           <button
            v-for="scenario in scenarios"
            :key="scenario.id"
            @click="selectedScenario = scenario.id"
            :class="[
              'relative min-w-fit px-4 py-3 font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0 whitespace-nowrap -mb-px',
              selectedScenario === scenario.id
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent hover:border-slate-600',
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
              <h3 class="text-lg font-semibold text-blue-400">Subject-To / Hybrid Analysis</h3>
              <p class="text-sm text-slate-400 italic mt-1">Analyze taking over existing financing, potentially with seller carryback.</p>
            </div>
             <span class="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">Hybrid Financing</span>
          </div>
  
          <!-- Required Fields Alert -->
          <div class="p-4 border border-dashed border-amber-500/30 rounded-lg bg-amber-500/5 flex items-start space-x-3">
             <div class="text-amber-400/90 mt-1 flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
             </div>
             <div class="flex-grow">
              <label for="existingLoanBalance" class="block text-sm font-medium text-amber-400 mb-2">
                Enter Existing Loan Balance to Begin
              </label>
              <div class="flex gap-3 items-center">
                <div class="relative flex-grow">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">$</span>
                  <input
                    id="existingLoanBalance"
                    v-model.number="subtoInputs.existingLoanBalance"
                    type="number"
                    min="0"
                    placeholder="e.g., 250000"
                    class="input-field pl-8 !border-amber-500/30 focus:!border-amber-500 focus:!ring-amber-500/40"
                  />
                </div>
                <button @click="subtoInputs.existingLoanBalance = null" v-if="subtoInputs.existingLoanBalance" class="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs transition">Reset</button>
              </div>
            </div>
          </div>
  
          <div v-if="subtoInputs.existingLoanBalance > 0" class="space-y-6">
              <!-- Input Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <!-- Subto Inputs Col 1 -->
                  <div class="space-y-4">
                      <h4 class="section-header">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" /></svg>
                          Deal Structure
                      </h4>
                      <div class="input-group">
                          <label class="input-label">Purchase Price ($)</label>
                          <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="subtoInputs.purchasePrice" type="number" min="0" class="input-field pl-8" placeholder="Enter purchase price" />
                          </div>
                      </div>
                       <div class="input-group">
                          <label class="input-label">Existing Loan Balance ($)</label>
                          <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input :value="formatNumber(subtoInputs.existingLoanBalance)" type="text" class="input-field pl-8 bg-slate-700/50 cursor-not-allowed" disabled />
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label">Cash to Seller at Closing ($)</label>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="subtoInputs.cashToSeller" type="number" min="0" class="input-field pl-8" placeholder="Cash to seller" />
                          </div>
                      </div>
                      <div class="input-group">
                          <div class="flex items-center justify-between">
                              <label class="input-label">Existing Loan Monthly PITI ($)</label>
                              <span class="text-red-400 text-xs font-medium">Required</span>
                          </div>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="subtoInputs.existingLoanPITI" type="number" min="0" placeholder="Principal, Interest, Tax, Insurance" class="input-field pl-8 border-amber-500/30 focus:border-amber-500 focus:ring-amber-500/40" />
                          </div>
                          <p class="input-help">Required estimate for the loan being taken over.</p>
                      </div>
                  </div>
  
                  <!-- Subto Inputs Col 2 -->
                  <div class="space-y-4">
                       <h4 class="section-header">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" /></svg>
                          Financing Options
                      </h4>
                      <div class="bg-slate-800/70 rounded-lg p-4 border border-slate-700/50 shadow-sm">
                          <div class="flex justify-between items-center">
                              <p class="text-sm text-slate-300">Calculated Seller Carryback:</p>
                              <p class="text-lg font-semibold text-blue-300">{{ formatPrice(subtoCalculated.sellerCarryAmount) }}</p>
                          </div>
                      </div>
  
                      <template v-if="subtoCalculated.sellerCarryAmount > 0">
                          <div class="input-group">
                              <label class="input-label">Seller Carry Interest Rate (%)</label>
                               <div class="relative">
                                  <input v-model.number="subtoInputs.sellerCarryRate" type="number" step="0.1" min="0" class="input-field pr-8" placeholder="Interest rate" />
                                  <span class="input-symbol-right">%</span>
                               </div>
                          </div>
                          <div class="input-group">
                              <label class="input-label">Seller Carry Term (Years)</label>
                               <div class="relative">
                                  <input v-model.number="subtoInputs.sellerCarryTerm" type="number" min="1" class="input-field pr-10" placeholder="Loan term" />
                                  <span class="input-symbol-right pr-3">yrs</span>
                              </div>
                          </div>
                      </template>
                      <template v-else>
                           <div class="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 flex items-center text-slate-400 italic text-sm">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                              No Seller Carryback needed.
                           </div>
                      </template>
  
                      <div class="input-group">
                          <label class="input-label">Est. Closing Costs (%)</label>
                          <div class="flex gap-2">
                               <div class="relative flex-grow">
                                  <input v-model.number="subtoInputs.closingCostsPercent" type="number" min="0" max="50" step="0.1" class="input-field pr-8" placeholder="Closing cost %" />
                                  <span class="input-symbol-right">%</span>
                               </div>
                              <select v-model="subtoInputs.closingCostsPaidBy" class="input-select flex-shrink-0 w-auto">
                                  <option value="Buyer">Buyer Pays</option><option value="Seller">Seller Pays</option><option value="Split">Split</option>
                              </select>
                          </div>
                      </div>
  
                      <div class="input-group">
                          <label class="input-label">Est. Commissions (%)</label>
                          <div class="flex gap-2">
                              <div class="relative flex-grow">
                                  <input v-model.number="subtoInputs.commissionPercent" type="number" min="0" max="50" step="0.1" class="input-field pr-8" placeholder="Commission %" />
                                  <span class="input-symbol-right">%</span>
                              </div>
                              <select v-model="subtoInputs.commissionPaidBy" class="input-select flex-shrink-0 w-auto">
                                  <option value="Seller">Seller Pays</option><option value="Buyer">Buyer Pays</option><option value="Split">Split</option>
                              </select>
                          </div>
                      </div>
                  </div>
  
                  <!-- Subto Common Inputs -->
                  <div class="md:col-span-2 pt-6 mt-2 border-t border-slate-700/50">
                      <h4 class="section-header mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                          Income & Operating Expenses
                      </h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div class="input-group">
                              <label class="input-label-sm">Monthly Rent ($)</label>
                              <div class="relative">
                                  <span class="input-symbol-left">$</span>
                                  <input v-model.number="subtoInputs.monthlyRent" type="number" min="0" class="input-field pl-8" placeholder="Monthly rent"/>
                              </div>
                          </div>
                          <div class="input-group">
                              <label class="input-label-sm">Vacancy (%)</label>
                               <div class="relative">
                                  <input v-model.number="subtoInputs.vacancyRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Vacancy rate"/>
                                  <span class="input-symbol-right">%</span>
                               </div>
                          </div>
                          <div class="input-group">
                              <label class="input-label-sm">Maintenance (%)</label>
                              <div class="relative">
                                  <input v-model.number="subtoInputs.maintenanceRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Maintenance rate"/>
                                  <span class="input-symbol-right">%</span>
                               </div>
                          </div>
                          <div class="input-group">
                              <label class="input-label-sm">Management (%)</label>
                              <div class="relative">
                                  <input v-model.number="subtoInputs.managementRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Management rate"/>
                                  <span class="input-symbol-right">%</span>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
  
              <!-- Subto Results -->
              <div v-if="subtoInputs.existingLoanPITI > 0" class="pt-6 mt-6 border-t border-slate-700/50">
                  <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h4 class="section-header text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                          Analysis Results
                      </h4>
                      <span class="text-xs text-slate-400 italic">Monthly figures shown</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                       <div class="result-box"><div class="result-label">Total Cash Needed</div><div class="result-value">{{ formatPrice(subtoCalculated.totalCashNeeded) }}</div><div class="result-detail">Cash to Seller + Buyer Costs</div></div>
                       <div class="result-box"><div class="result-label">Existing PITI</div><div class="result-value">{{ formatPrice(subtoInputs.existingLoanPITI) }}/mo</div></div>
                       <div class="result-box"><div class="result-label">Seller Carry Pmt</div><div class="result-value">{{ formatPrice(subtoCalculated.sellerCarryMonthlyPayment) }}/mo</div></div>
                       <div class="result-box"><div class="result-label">Total Monthly Pmt</div><div class="result-value">{{ formatPrice(subtoCalculated.totalMonthlyHousingPayment) }}/mo</div><div class="result-detail">Existing PITI + Carryback</div></div>
                       <div class="result-box"><div class="result-label">Est. Monthly Cash Flow</div><div class="result-value" :class="subtoCalculated.monthlyCashFlow >= 0 ? 'text-green-400' : 'text-red-400'">{{ formatPrice(subtoCalculated.monthlyCashFlow) }}/mo</div></div>
                       <div class="result-box"><div class="result-label">Est. Cash-on-Cash</div><div class="result-value" :class="subtoCalculated.cashOnCash >= 8 ? 'text-green-400' : subtoCalculated.cashOnCash >= 0 ? 'text-yellow-400' : 'text-red-400'">{{ subtoCalculated.cashOnCash.toFixed(1) }}%</div></div>
                  </div>
              </div>
               <div v-else class="flex items-center justify-center p-4 mt-6 text-amber-400 italic bg-amber-500/5 border border-amber-500/20 rounded-lg text-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                   Enter Existing Loan Monthly PITI above to see full results.
              </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center text-center text-slate-500 italic py-10">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
               <p>Please enter the existing loan balance in the yellow box above<br>to calculate Subject-To details.</p>
          </div>
        </div>
  
        <!-- ############################# -->
        <!-- ## Seller Finance Scenario ## -->
        <!-- ############################# -->
        <div v-if="selectedScenario === 'SellerFinancing'" class="space-y-6">
           <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 class="text-lg font-semibold text-blue-400">Seller Financing Analysis</h3>
              <p class="text-sm text-slate-400 italic mt-1">Analyze a deal where the seller provides the primary financing.</p>
            </div>
             <span class="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">Creative Financing</span>
          </div>
  
           <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <!-- SF Inputs Col 1 -->
               <div class="space-y-4">
                   <h4 class="section-header">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" /></svg>
                       Deal Structure
                   </h4>
                   <div class="input-group">
                      <label class="input-label">Purchase Price ($)</label>
                      <div class="relative">
                          <span class="input-symbol-left">$</span>
                          <input v-model.number="sellerFinancingInputs.purchasePrice" @input="sfPriceManuallySet = true" type="number" min="0" class="input-field pl-8" placeholder="Enter purchase price" />
                      </div>
                      <p v-if="!sfPriceManuallySet && props.property?.zestimate" class="input-help">Default: Zestimate ({{ formatPrice(props.property.zestimate) }}) + 10%</p>
                   </div>
                    <div class="input-group">
                      <label class="input-label">Down Payment (%)</label>
                      <div class="relative">
                          <input v-model.number="sellerFinancingInputs.downPaymentPercent" @input="sfDownPaymentManuallySet = true" type="number" min="0" max="100" step="0.1" class="input-field pr-8" placeholder="Down payment %" />
                          <span class="input-symbol-right">%</span>
                      </div>
                      <p v-if="!sfDownPaymentManuallySet" class="input-help">Default: 6%</p>
                   </div>
                   <div class="input-group">
                      <label class="input-label">Seller Note Interest Rate (%)</label>
                      <div class="relative">
                          <input v-model.number="sellerFinancingInputs.sellerRate" type="number" step="0.1" min="0" class="input-field pr-8" placeholder="Interest rate" />
                          <span class="input-symbol-right">%</span>
                       </div>
                   </div>
                   <div class="input-group">
                      <label class="input-label">Seller Note Term (Years)</label>
                       <div class="relative">
                          <input v-model.number="sellerFinancingInputs.sellerTerm" type="number" min="1" class="input-field pr-10" placeholder="Loan term" />
                          <span class="input-symbol-right pr-3">yrs</span>
                      </div>
                   </div>
               </div>
                <!-- SF Inputs Col 2 -->
               <div class="space-y-4">
                   <h4 class="section-header">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" /></svg>
                       Financing Summary & Costs
                   </h4>
                   <div class="bg-slate-800/70 rounded-lg p-4 border border-slate-700/50 shadow-sm space-y-3">
                       <div class="flex justify-between items-center">
                          <p class="text-sm text-slate-300">Calculated Down Payment:</p>
                          <p class="text-lg font-semibold text-blue-300">{{ formatPrice(sellerFinancingCalculated.downPaymentAmount) }}</p>
                       </div>
                       <div class="flex justify-between items-center">
                          <p class="text-sm text-slate-300">Calculated Seller Note:</p>
                          <p class="text-lg font-semibold text-blue-300">{{ formatPrice(sellerFinancingCalculated.sellerNoteAmount) }}</p>
                      </div>
                   </div>
                   <div class="input-group">
                      <label class="input-label">Est. Closing Costs (%)</label>
                      <div class="flex gap-2">
                          <div class="relative flex-grow">
                              <input v-model.number="sellerFinancingInputs.closingCostsPercent" type="number" min="0" max="50" step="0.1" class="input-field pr-8" placeholder="Closing cost %" />
                               <span class="input-symbol-right">%</span>
                           </div>
                          <select v-model="sellerFinancingInputs.closingCostsPaidBy" class="input-select flex-shrink-0 w-auto">
                              <option value="Buyer">Buyer Pays</option><option value="Seller">Seller Pays</option><option value="Split">Split</option>
                          </select>
                      </div>
                   </div>
                   <div class="input-group">
                      <label class="input-label">Est. Commissions (%)</label>
                      <div class="flex gap-2">
                           <div class="relative flex-grow">
                               <input v-model.number="sellerFinancingInputs.commissionPercent" type="number" min="0" max="50" step="0.1" class="input-field pr-8" placeholder="Commission %" />
                               <span class="input-symbol-right">%</span>
                           </div>
                          <select v-model="sellerFinancingInputs.commissionPaidBy" class="input-select flex-shrink-0 w-auto">
                              <option value="Seller">Seller Pays</option><option value="Buyer">Buyer Pays</option><option value="Split">Split</option>
                          </select>
                      </div>
                   </div>
               </div>
  
                <!-- SF Common Inputs -->
               <div class="md:col-span-2 pt-6 mt-2 border-t border-slate-700/50">
                   <h4 class="section-header mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                       Income & Operating Expenses
                   </h4>
                   <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div class="input-group">
                          <label class="input-label-sm">Monthly Rent ($)</label>
                          <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="sellerFinancingInputs.monthlyRent" type="number" min="0" class="input-field pl-8" placeholder="Monthly rent" />
                          </div>
                       </div>
                      <div class="input-group">
                          <label class="input-label-sm">Property Tax ($/yr)</label>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="sellerFinancingInputs.propertyTax" type="number" min="0" class="input-field pl-8" placeholder="Annual tax" />
                          </div>
                       </div>
                      <div class="input-group">
                          <label class="input-label-sm">Insurance ($/yr)</label>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="sellerFinancingInputs.insurance" type="number" min="0" class="input-field pl-8" placeholder="Annual insurance" />
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Vacancy (%)</label>
                          <div class="relative">
                              <input v-model.number="sellerFinancingInputs.vacancyRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Vacancy rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Maintenance (%)</label>
                           <div class="relative">
                              <input v-model.number="sellerFinancingInputs.maintenanceRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Maintenance rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Management (%)</label>
                           <div class="relative">
                              <input v-model.number="sellerFinancingInputs.managementRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Management rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                   </div>
               </div>
          </div>
  
           <!-- SF Results -->
           <div class="pt-6 mt-6 border-t border-slate-700/50">
              <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h4 class="section-header text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      Analysis Results
                  </h4>
                   <span class="text-xs text-slate-400 italic">Monthly figures shown</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   <div class="result-box"><div class="result-label">Total Cash Needed</div><div class="result-value">{{ formatPrice(sellerFinancingCalculated.totalCashNeeded) }}</div><div class="result-detail">Down Pmt + Buyer Costs</div></div>
                   <div class="result-box"><div class="result-label">Seller Note Pmt (P&I)</div><div class="result-value">{{ formatPrice(sellerFinancingCalculated.monthlyPaymentPI) }}/mo</div></div>
                   <div class="result-box"><div class="result-label">Monthly Tax & Ins</div><div class="result-value">{{ formatPrice(sellerFinancingCalculated.monthlyTaxInsurance) }}/mo</div></div>
                   <div class="result-box"><div class="result-label">Total Monthly PITI</div><div class="result-value">{{ formatPrice(sellerFinancingCalculated.totalMonthlyPITI) }}/mo</div></div>
                   <div class="result-box"><div class="result-label">Est. Monthly Cash Flow</div><div class="result-value" :class="sellerFinancingCalculated.monthlyCashFlow >= 0 ? 'text-green-400' : 'text-red-400'">{{ formatPrice(sellerFinancingCalculated.monthlyCashFlow) }}/mo</div></div>
                   <div class="result-box"><div class="result-label">Est. Cash-on-Cash</div><div class="result-value" :class="sellerFinancingCalculated.cashOnCash >= 8 ? 'text-green-400' : sellerFinancingCalculated.cashOnCash >= 0 ? 'text-yellow-400' : 'text-red-400'">{{ sellerFinancingCalculated.cashOnCash.toFixed(1) }}%</div></div>
              </div>
          </div>
        </div>
  
        <!-- ####################### -->
        <!-- ## Cash Offer Scenario ## -->
        <!-- ####################### -->
        <div v-if="selectedScenario === 'Cash'" class="space-y-6">
           <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 class="text-lg font-semibold text-blue-400">Cash Offer Analysis</h3>
              <p class="text-sm text-slate-400 italic mt-1">Analyze buying the property outright with cash.</p>
            </div>
             <span class="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">All Cash</span>
          </div>
  
           <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <!-- Cash Inputs Col 1 -->
               <div class="space-y-4">
                    <h4 class="section-header">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" /></svg>
                       Offer Details
                   </h4>
                  <div class="input-group">
                      <label class="input-label">Cash Offer Price ($)</label>
                      <div class="relative">
                          <span class="input-symbol-left">$</span>
                          <input v-model.number="cashOfferInputs.offerPrice" @input="cashPriceManuallySet = true" type="number" min="0" class="input-field pl-8" placeholder="Enter cash offer price"/>
                      </div>
                      <p v-if="!cashPriceManuallySet && props.property?.zestimate" class="input-help">Default: Zestimate ({{ formatPrice(props.property.zestimate) }}) - 30%</p>
                   </div>
                   <div class="input-group">
                      <label class="input-label">Est. Closing Costs (%)</label>
                       <div class="flex gap-2">
                           <div class="relative flex-grow">
                               <input v-model.number="cashOfferInputs.closingCostsPercent" type="number" min="0" max="50" step="0.1" class="input-field pr-8" placeholder="Closing cost %" />
                               <span class="input-symbol-right">%</span>
                           </div>
                          <select v-model="cashOfferInputs.closingCostsPaidBy" class="input-select flex-shrink-0 w-auto">
                              <option value="Buyer">Buyer Pays</option><option value="Seller">Seller Pays</option><option value="Split">Split</option>
                          </select>
                      </div>
                      <p class="input-help">Typically lower for cash deals (title, recording, etc.).</p>
                   </div>
               </div>
              <!-- Cash Inputs Col 2 (Less needed here) -->
               <div class="space-y-4">
                    <h4 class="section-header">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" /></svg>
                        Cost Summary
                    </h4>
                   <div class="bg-slate-800/70 rounded-lg p-4 border border-slate-700/50 shadow-sm space-y-3">
                       <div class="flex justify-between items-center">
                          <p class="text-sm text-slate-300">Calculated Closing Costs:</p>
                          <p class="text-lg font-semibold text-blue-300">{{ formatPrice(cashOfferCalculated.closingCostsAmount) }}</p>
                       </div>
                       <div class="pt-3 border-t border-slate-700/50 flex justify-between items-center">
                          <p class="text-sm text-blue-300 font-medium">Total Cash Needed:</p>
                          <p class="text-lg font-semibold text-blue-300">{{ formatPrice(cashOfferCalculated.totalCashNeeded) }}</p>
                      </div>
                   </div>
                   <div class="bg-blue-500/10 text-blue-400 text-sm p-4 rounded-lg">
                     <div class="flex items-start space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                          <p>Cash offers often close faster and might secure a larger discount.</p>
                      </div>
                   </div>
               </div>
              <!-- Cash Common Inputs -->
              <div class="md:col-span-2 pt-6 mt-2 border-t border-slate-700/50">
                   <h4 class="section-header mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                       Income & Operating Expenses
                   </h4>
                   <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div class="input-group">
                          <label class="input-label-sm">Monthly Rent ($)</label>
                          <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="cashOfferInputs.monthlyRent" type="number" min="0" class="input-field pl-8" placeholder="Monthly rent"/>
                          </div>
                       </div>
                      <div class="input-group">
                          <label class="input-label-sm">Property Tax ($/yr)</label>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="cashOfferInputs.propertyTax" type="number" min="0" class="input-field pl-8" placeholder="Annual tax"/>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Insurance ($/yr)</label>
                           <div class="relative">
                              <span class="input-symbol-left">$</span>
                              <input v-model.number="cashOfferInputs.insurance" type="number" min="0" class="input-field pl-8" placeholder="Annual insurance"/>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Vacancy (%)</label>
                          <div class="relative">
                              <input v-model.number="cashOfferInputs.vacancyRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Vacancy rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Maintenance (%)</label>
                          <div class="relative">
                              <input v-model.number="cashOfferInputs.maintenanceRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Maintenance rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                      <div class="input-group">
                          <label class="input-label-sm">Management (%)</label>
                           <div class="relative">
                              <input v-model.number="cashOfferInputs.managementRate" type="number" min="0" max="100" class="input-field pr-8" placeholder="Management rate"/>
                              <span class="input-symbol-right">%</span>
                          </div>
                      </div>
                   </div>
               </div>
          </div>
  
           <!-- Cash Results -->
           <div class="pt-6 mt-6 border-t border-slate-700/50">
              <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                   <h4 class="section-header text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      Analysis Results
                  </h4>
                   <span class="text-xs text-slate-400 italic">Monthly figures shown</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   <div class="result-box"><div class="result-label">Total Cash Needed</div><div class="result-value">{{ formatPrice(cashOfferCalculated.totalCashNeeded) }}</div><div class="result-detail">Offer Price + Buyer Costs</div></div>
                   <div class="result-box"><div class="result-label">Annual Net Op. Income (NOI)</div><div class="result-value">{{ formatPrice(cashOfferCalculated.annualNOI) }}</div></div>
                   <div class="result-box"><div class="result-label">Est. Monthly Cash Flow</div><div class="result-value" :class="cashOfferCalculated.monthlyCashFlow >= 0 ? 'text-green-400' : 'text-red-400'">{{ formatPrice(cashOfferCalculated.monthlyCashFlow) }}/mo</div></div>
                   <div class="result-box"><div class="result-label">Est. Cap Rate</div><div class="result-value" :class="cashOfferCalculated.capRate >= 5 ? 'text-green-400' : 'text-orange-400'">{{ cashOfferCalculated.capRate.toFixed(1) }}%</div><div class="result-detail">Annual NOI / Offer Price</div></div>
                   <div class="result-box"><div class="result-label">Est. Cash Return (CoC)</div><div class="result-value" :class="cashOfferCalculated.cashOnCash >= 5 ? 'text-green-400' : cashOfferCalculated.cashOnCash >= 0 ? 'text-yellow-400' : 'text-red-400'">{{ cashOfferCalculated.cashOnCash.toFixed(1) }}%</div><div class="result-detail">Annual CF / Total Cash</div></div>
                   <div class="result-box bg-blue-500/10 border border-blue-500/20">
                       <div class="result-label text-blue-300">Quick Decision Guide</div>
                      <div class="text-sm mt-1">
                          <span v-if="cashOfferCalculated.capRate >= 7" class="text-green-400 font-medium">Strong Cap Rate</span>
                          <span v-else-if="cashOfferCalculated.capRate >= 5" class="text-blue-400 font-medium">Moderate Cap Rate</span>
                          <span v-else class="text-yellow-400 font-medium">Low Cap Rate</span>
                       </div>
                       <div class="result-detail mt-1">Compare to local market averages</div>
                   </div>
               </div>
          </div>
        </div>
  
      </div> <!-- End Scenario Content Area -->
    </div> <!-- End Root Element -->
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch } from 'vue';
  
  const props = defineProps({
    property: {
      type: Object,
      required: true,
    },
  });
  
  // --- Scenario Selection ---
  const scenarios = [
    { id: 'SellerFinancing', name: 'Seller Financing' },
    { id: 'Subto', name: 'Subject-To / Hybrid' },
    { id: 'Cash', name: 'Cash Offer' },
  ];
  const selectedScenario = ref('SellerFinancing'); // Default scenario
  
  // --- State for Tracking Manual Overrides ---
  const sfPriceManuallySet = ref(false);
  const sfDownPaymentManuallySet = ref(false);
  const cashPriceManuallySet = ref(false);
  
  // --- Input State (Separate object per scenario) ---
  const subtoInputs = reactive({
    purchasePrice: 0,
    existingLoanBalance: null, // Trigger for Subto visibility
    cashToSeller: 0,
    existingLoanPITI: null,
    sellerCarryRate: 5,
    sellerCarryTerm: 10,
    closingCostsPercent: 2.5,
    closingCostsPaidBy: 'Buyer',
    commissionPercent: 6,
    commissionPaidBy: 'Seller',
    monthlyRent: 0,
    vacancyRate: 5,
    maintenanceRate: 5,
    managementRate: 8,
  });
  
  const sellerFinancingInputs = reactive({
    purchasePrice: 0,
    downPaymentPercent: 6, // Default
    sellerRate: 6, // Example default
    sellerTerm: 30, // Example default (amortization term)
    closingCostsPercent: 3, // Example default for SF
    closingCostsPaidBy: 'Buyer',
    commissionPercent: 6,
    commissionPaidBy: 'Seller',
    monthlyRent: 0,
    propertyTax: 0, // Required for PITI calculation
    insurance: 0,   // Required for PITI calculation
    vacancyRate: 5,
    maintenanceRate: 5,
    managementRate: 8,
  });
  
  const cashOfferInputs = reactive({
    offerPrice: 0,
    closingCostsPercent: 1.5, // Often lower for cash
    closingCostsPaidBy: 'Buyer',
    monthlyRent: 0,
    propertyTax: 0,
    insurance: 0,
    vacancyRate: 5,
    maintenanceRate: 5,
    managementRate: 8,
  });
  
  
  // --- Helper Functions ---
  const formatPrice = (price) => {
    if (price == null || isNaN(Number(price))) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(price));
  };
  const formatNumber = (num) => {
    if (num == null || isNaN(Number(num))) return 'N/A';
    return new Intl.NumberFormat('en-US').format(Number(num));
  };
  const calculateMortgagePayment = (principal, annualRatePercent, termYears) => {
      if (!principal || principal <= 0 || !termYears || termYears <= 0) return 0;
      // Ensure rate is treated as 0 if null/undefined
      const rate = annualRatePercent == null ? 0 : annualRatePercent;
      const monthlyRate = rate / 100 / 12;
      const numberOfPayments = termYears * 12;
  
      if (monthlyRate === 0) { // Handle 0% interest rate
          // Avoid division by zero if term is also 0 (shouldn't happen with validation but safe)
          return numberOfPayments > 0 ? principal / numberOfPayments : 0;
      }
  
      // Standard mortgage formula
      const factor = Math.pow(1 + monthlyRate, numberOfPayments);
      return principal * (monthlyRate * factor) / (factor - 1);
  };
  
  // --- Watcher for Pre-filling ---
  watch(() => props.property, (newVal) => {
    if (!newVal) return;
  
    const estPrice = Number(newVal.zestimate) || Number(newVal.price) || 0;
    const estRent = Number(newVal.rentZestimate) || 0;
    const estTax = Number(newVal.taxAnnualAmount) || Number(newVal.resoFacts?.taxAnnualAmount) || 0;
    const estInsurance = Number(newVal.annualHomeownersInsurance) || 1200; // Default if unavailable
  
    // Pre-fill common fields if they are currently 0
    if (subtoInputs.monthlyRent === 0) subtoInputs.monthlyRent = estRent;
    if (sellerFinancingInputs.monthlyRent === 0) sellerFinancingInputs.monthlyRent = estRent;
    if (cashOfferInputs.monthlyRent === 0) cashOfferInputs.monthlyRent = estRent;
  
    if (sellerFinancingInputs.propertyTax === 0) sellerFinancingInputs.propertyTax = estTax;
    if (cashOfferInputs.propertyTax === 0) cashOfferInputs.propertyTax = estTax;
  
    if (sellerFinancingInputs.insurance === 0) sellerFinancingInputs.insurance = estInsurance;
    if (cashOfferInputs.insurance === 0) cashOfferInputs.insurance = estInsurance;
  
  
    // --- Pre-fill Scenario Specific Prices (Apply defaults ONLY if not manually set and current value is 0) ---
    if (subtoInputs.purchasePrice === 0) subtoInputs.purchasePrice = estPrice;
  
    if (!sfPriceManuallySet.value && sellerFinancingInputs.purchasePrice === 0 && estPrice > 0) {
        sellerFinancingInputs.purchasePrice = Math.round(estPrice * 1.10);
    }
    if (!sfDownPaymentManuallySet.value) { // Always reset default % if not manual
        sellerFinancingInputs.downPaymentPercent = 6;
    }
  
    if (!cashPriceManuallySet.value && cashOfferInputs.offerPrice === 0 && estPrice > 0) {
         cashOfferInputs.offerPrice = Math.round(estPrice * 0.70);
     }
  
  }, { immediate: true, deep: true }); // Use deep watch for nested property changes
  
  // --- Calculations ---
  
  // Subto Calculations
  const subtoCalculated = computed(() => {
      const pp = Number(subtoInputs.purchasePrice) || 0;
      const loanBal = Number(subtoInputs.existingLoanBalance) || 0;
      const cashSeller = Number(subtoInputs.cashToSeller) || 0;
      const existingPITI = Number(subtoInputs.existingLoanPITI) || 0;
  
      const defaults = { sellerCarryAmount: 0, sellerCarryMonthlyPayment: 0, totalMonthlyHousingPayment: existingPITI, otherOpExMonthly: 0, monthlyCashFlow: 0, totalCashNeeded: cashSeller, cashOnCash: 0 };
      if (pp <= 0 || loanBal <= 0 ) return defaults;
  
      const sellerCarryAmount = Math.max(0, pp - loanBal - cashSeller);
      const sellerCarryMonthlyPayment = calculateMortgagePayment(sellerCarryAmount, subtoInputs.sellerCarryRate, subtoInputs.sellerCarryTerm);
      const totalMonthlyHousingPayment = existingPITI + sellerCarryMonthlyPayment;
  
      const rent = Number(subtoInputs.monthlyRent) || 0;
      const vacancyMonthly = rent * (Number(subtoInputs.vacancyRate) / 100);
      const maintMonthly = rent * (Number(subtoInputs.maintenanceRate) / 100);
      const mgmtMonthly = rent * (Number(subtoInputs.managementRate) / 100);
      const otherOpExMonthly = vacancyMonthly + maintMonthly + mgmtMonthly;
  
      const monthlyCashFlow = rent - totalMonthlyHousingPayment - otherOpExMonthly;
      const annualCashFlow = monthlyCashFlow * 12;
  
      let buyerClosingCosts = 0;
      if (subtoInputs.closingCostsPaidBy === 'Buyer' || subtoInputs.closingCostsPaidBy === 'Split') {
          buyerClosingCosts = pp * (Number(subtoInputs.closingCostsPercent) / 100);
          if (subtoInputs.closingCostsPaidBy === 'Split') buyerClosingCosts /= 2;
      }
      let buyerCommissions = 0;
      if (subtoInputs.commissionPaidBy === 'Buyer' || subtoInputs.commissionPaidBy === 'Split') {
          buyerCommissions = pp * (Number(subtoInputs.commissionPercent) / 100);
          if (subtoInputs.commissionPaidBy === 'Split') buyerCommissions /= 2;
      }
      const totalCashNeeded = cashSeller + buyerClosingCosts + buyerCommissions;
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
  
      return {
        sellerCarryAmount, sellerCarryMonthlyPayment, totalMonthlyHousingPayment,
        otherOpExMonthly, monthlyCashFlow, totalCashNeeded,
        cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
      };
  });
  
  // Seller Financing Calculations
  const sellerFinancingCalculated = computed(() => {
      const pp = Number(sellerFinancingInputs.purchasePrice) || 0;
      const dpPercent = Number(sellerFinancingInputs.downPaymentPercent) || 0;
  
      const defaults = { downPaymentAmount: 0, sellerNoteAmount: 0, monthlyPaymentPI: 0, monthlyTaxInsurance: 0, totalMonthlyPITI: 0, otherOpExMonthly: 0, monthlyCashFlow: 0, totalCashNeeded: 0, cashOnCash: 0 };
      if (pp <= 0) return defaults;
  
      const downPaymentAmount = pp * (dpPercent / 100);
      const sellerNoteAmount = pp - downPaymentAmount;
      const monthlyPaymentPI = calculateMortgagePayment(sellerNoteAmount, sellerFinancingInputs.sellerRate, sellerFinancingInputs.sellerTerm);
  
      const taxMonthly = (Number(sellerFinancingInputs.propertyTax) || 0) / 12;
      const insMonthly = (Number(sellerFinancingInputs.insurance) || 0) / 12;
      const monthlyTaxInsurance = taxMonthly + insMonthly;
      const totalMonthlyPITI = monthlyPaymentPI + monthlyTaxInsurance;
  
      const rent = Number(sellerFinancingInputs.monthlyRent) || 0;
      const vacancyMonthly = rent * (Number(sellerFinancingInputs.vacancyRate) / 100);
      const maintMonthly = rent * (Number(sellerFinancingInputs.maintenanceRate) / 100);
      const mgmtMonthly = rent * (Number(sellerFinancingInputs.managementRate) / 100);
      const otherOpExMonthly = vacancyMonthly + maintMonthly + mgmtMonthly;
  
      const monthlyCashFlow = rent - totalMonthlyPITI - otherOpExMonthly;
      const annualCashFlow = monthlyCashFlow * 12;
  
      let buyerClosingCosts = 0;
      if (sellerFinancingInputs.closingCostsPaidBy === 'Buyer' || sellerFinancingInputs.closingCostsPaidBy === 'Split') {
          buyerClosingCosts = pp * (Number(sellerFinancingInputs.closingCostsPercent) / 100);
          if (sellerFinancingInputs.closingCostsPaidBy === 'Split') buyerClosingCosts /= 2;
      }
      let buyerCommissions = 0;
      if (sellerFinancingInputs.commissionPaidBy === 'Buyer' || sellerFinancingInputs.commissionPaidBy === 'Split') {
          buyerCommissions = pp * (Number(sellerFinancingInputs.commissionPercent) / 100);
          if (sellerFinancingInputs.commissionPaidBy === 'Split') buyerCommissions /= 2;
      }
      const totalCashNeeded = downPaymentAmount + buyerClosingCosts + buyerCommissions;
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
  
       return {
        downPaymentAmount, sellerNoteAmount, monthlyPaymentPI, monthlyTaxInsurance, totalMonthlyPITI,
        otherOpExMonthly, monthlyCashFlow, totalCashNeeded,
        cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
      };
  });
  
  // Cash Offer Calculations
  const cashOfferCalculated = computed(() => {
      const offerPrice = Number(cashOfferInputs.offerPrice) || 0;
  
      const defaults = { closingCostsAmount: 0, totalCashNeeded: 0, annualNOI: 0, monthlyCashFlow: 0, capRate: 0, cashOnCash: 0 };
      if (offerPrice <= 0) return defaults;
  
      let buyerClosingCosts = 0;
       if (cashOfferInputs.closingCostsPaidBy === 'Buyer' || cashOfferInputs.closingCostsPaidBy === 'Split') {
          buyerClosingCosts = offerPrice * (Number(cashOfferInputs.closingCostsPercent) / 100);
          if (cashOfferInputs.closingCostsPaidBy === 'Split') buyerClosingCosts /= 2;
      }
      const closingCostsAmount = buyerClosingCosts;
      const totalCashNeeded = offerPrice + closingCostsAmount;
  
      const rent = Number(cashOfferInputs.monthlyRent) || 0;
      const annualGrossRent = rent * 12;
  
      const taxAnnual = Number(cashOfferInputs.propertyTax) || 0;
      const insAnnual = Number(cashOfferInputs.insurance) || 0;
      const vacancyAnnual = annualGrossRent * (Number(cashOfferInputs.vacancyRate) / 100);
      const maintAnnual = annualGrossRent * (Number(cashOfferInputs.maintenanceRate) / 100);
      const mgmtAnnual = annualGrossRent * (Number(cashOfferInputs.managementRate) / 100);
      const totalAnnualOpEx = taxAnnual + insAnnual + vacancyAnnual + maintAnnual + mgmtAnnual;
  
      const annualNOI = annualGrossRent - totalAnnualOpEx;
      const monthlyCashFlow = annualNOI / 12;
      const annualCashFlow = annualNOI;
  
      const capRate = offerPrice > 0 ? (annualNOI / offerPrice) * 100 : 0;
      const cashOnCash = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;
  
       return {
          closingCostsAmount, totalCashNeeded, annualNOI, monthlyCashFlow,
          capRate: isNaN(capRate) ? 0 : capRate,
          cashOnCash: isNaN(cashOnCash) ? 0 : cashOnCash,
      };
  });
  
  </script>
  
  <style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Input Group Styling */
  .input-group {
    @apply space-y-1 mb-2; /* Add slightly more bottom margin */
  }
  
  .input-field {
    @apply w-full h-10 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all appearance-none; /* Added appearance-none */
    /* Padding is handled inline based on symbol */
  }
  
  .input-select {
    @apply h-10 px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all;
  }
  
  .input-label {
    @apply block text-sm text-slate-400;
  }
  
  .input-label-sm {
     @apply block text-xs font-medium text-slate-400; /* Made slightly bolder */
  }
  
  .input-help {
    @apply text-xs text-slate-500 mt-1.5 italic; /* Increased top margin */
  }
  
  /* Input Symbols */
  .input-symbol-left {
      @apply absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none;
  }
  .input-symbol-right {
      @apply absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none;
  }
  
  /* Section Header */
  .section-header {
      @apply text-sm font-semibold text-slate-300 flex items-center mb-3; /* Increased bottom margin */
  }
  
  /* Result Box Styling */
  .result-box {
    @apply bg-slate-800/80 p-4 rounded-lg border border-slate-700/50 shadow-sm transition hover:bg-slate-800 hover:border-slate-600;
  }
  
  .result-label {
    @apply text-xs text-slate-400 mb-1 uppercase tracking-wider font-medium;
  }
  
  .result-value {
    @apply text-lg font-bold text-white;
  }
  
  .result-detail {
    @apply text-xs text-slate-500 italic mt-1;
  }
  </style>