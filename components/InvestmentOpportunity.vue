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
      <!-- Subject-To Scenario -->
      <SubjectToScenario v-if="selectedScenario === 'Subto'" />

      <!-- Seller Financing Scenario -->
      <SellerFinancingScenario 
        v-if="selectedScenario === 'SellerFinancing'" 
        :reapi_property="props.reapi_property"
      />

      <!-- Cash Offer Scenario -->
      <CashOfferScenario 
        v-if="selectedScenario === 'Cash'" 
        :property="props.property"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useInvestmentCalculatorStore } from "~/stores/investmentCalculator";


const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  reapi_property: {
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

// Watch for property changes and update store
watch(
  () => props.property,
  (newVal) => {
    if (!newVal) return;
    store.setPropertyData(props.property, props.reapi_property);
  },
  { immediate: true, deep: true }
);

// Initialize property data on mount
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
  @apply space-y-1 mb-2;
}

.input-field {
  @apply w-full h-10 bg-gray-900/70 border border-yellow-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:border-yellow-gold transition-all appearance-none;
}

.input-select {
  @apply h-10 px-3 py-2 bg-gray-900/70 border border-yellow-gold/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-gold/40 focus:border-yellow-gold transition-all;
}

.input-label {
  @apply block text-sm text-gray-400;
}

.input-label-sm {
  @apply block text-xs font-medium text-gray-400;
}

.input-help {
  @apply text-xs text-gray-500 mt-1.5 italic;
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
  @apply text-sm font-semibold text-gray-300 flex items-center mb-3;
}
</style>