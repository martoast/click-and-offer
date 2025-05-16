<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" @click="closeModalOnBackdropClick">
    <div class="absolute inset-0 bg-black bg-opacity-70"></div>
    
    <div class="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-yellow-gold/30 w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
      <!-- Modal Header -->
      <div class="p-4 border-b border-yellow-gold/30 flex justify-between items-center">
        <h3 class="text-lg font-bold text-white">Offer Email Template for {{ propertyAddress }}</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Modal Body - Make this section scrollable -->
      <div class="p-6 overflow-y-auto flex-1">
        <div class="flex mb-4">
          <div class="flex-1">
            <label class="block text-xs text-gray-400 mb-1">Your Name</label>
            <input 
              type="text" 
              v-model="yourName" 
              class="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-yellow-600 focus:outline-none"
              placeholder="Your Name"
            />
          </div>
        </div>
        
        <!-- NapkinSigned Section -->
        <div class="mb-5">
          <div class="flex items-center mb-3">
            <div class="flex-1 h-px bg-yellow-gold/30"></div>
            <div class="px-3 text-yellow-gold text-sm font-medium">NapkinSigned App Section</div>
            <div class="flex-1 h-px bg-yellow-gold/30"></div>
          </div>
          
          <!-- Editable Text Area for NapkinSigned -->
          <textarea 
            v-model="napkinSignedText" 
            class="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-gray-200 font-mono text-sm mb-3 whitespace-pre-wrap h-44 w-full overflow-y-auto focus:border-yellow-600 focus:outline-none"
          ></textarea>
          
          <div class="flex justify-end">
            <button 
              @click="copyNapkinSignedText" 
              class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-md flex items-center transition-colors"
              :class="{ 'copied-animation': napkinCopied }"
            >
              <svg v-if="!napkinCopied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ napkinCopied ? 'Copied!' : 'Copy NapkinSigned Text' }}
            </button>
          </div>
        </div>
        
        <!-- Email Template Section -->
        <div>
          <div class="flex items-center mb-3">
            <div class="flex-1 h-px bg-yellow-gold/30"></div>
            <div class="px-3 text-yellow-gold text-sm font-medium">Email Text Section</div>
            <div class="flex-1 h-px bg-yellow-gold/30"></div>
          </div>
          
          <!-- Editable Text Area for Email -->
          <textarea 
            v-model="emailText" 
            class="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-gray-200 font-mono text-sm mb-3 whitespace-pre-wrap h-44 w-full overflow-y-auto focus:border-yellow-600 focus:outline-none"
            ref="emailTextRef"
          ></textarea>
          
          <div class="flex justify-end">
            <button 
              @click="copyEmailText" 
              class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-md flex items-center transition-colors"
              :class="{ 'copied-animation': emailCopied }"
            >
              <svg v-if="!emailCopied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ emailCopied ? 'Copied!' : 'Copy Email Text' }}
            </button>
          </div>
        </div>
        
        <div class="text-xs text-gray-400 italic mt-3">
          You can edit any text directly in the text areas before copying
        </div>
      </div>

      <!-- Modal Footer - Always visible at bottom -->
      <div class="p-4 border-t border-yellow-gold/30 bg-gray-900/50 flex justify-end space-x-4">
        <button 
          @click="copyBothTexts" 
          class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-medium rounded-md flex items-center transition-colors"
          :class="{ 'copied-animation': bothCopied }"
        >
          <svg v-if="!bothCopied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          {{ bothCopied ? 'Copied Both!' : 'Copy All Text' }}
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
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  propertyAddress: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    default: "N/A"
  },
  listingAgentName: {
    type: String,
    default: "N/A"
  },
  formattedPurchaseOrListingPrice: {
    type: String,
    default: "N/A"
  },
  formattedOpenLoanBalance: {
    type: String,
    default: "N/A"
  },
  estimatedValue: {
    type: Number,
    default: null
  },
  apn: {
    type: String,
    default: "N/A"
  },
  county: {
    type: String,
    default: "N/A"
  },
  legalDescription: {
    type: String,
    default: "N/A"
  },
  agentPhone: {
    type: String,
    default: "N/A"
  },
  commissionPercent: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:showModal']);

// --- Local State for Modal ---
const napkinCopied = ref(false);
const emailCopied = ref(false);
const bothCopied = ref(false);
const emailTextRef = ref(null);

// --- Customizable Fields ---
const yourName = ref("");

// --- Methods ---
const formatPrice = (price) => {
  if (price == null || isNaN(Number(price)) || String(price).trim() === "") return "N/A";
  return new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(Number(price));
};

// Close modal and restore background scrolling
const closeModal = () => {
  emit('update:showModal', false);
  document.body.classList.remove('overflow-hidden');
};

// Close modal when clicking on backdrop (outside the modal)
const closeModalOnBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

// Copy text to clipboard functions
const copyNapkinSignedText = async () => {
  try {
    await navigator.clipboard.writeText(napkinSignedText.value);
    napkinCopied.value = true;
    setTimeout(() => {
      napkinCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const copyEmailText = async () => {
  try {
    await navigator.clipboard.writeText(emailText.value);
    emailCopied.value = true;
    setTimeout(() => {
      emailCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const copyBothTexts = async () => {
  try {
    const combinedText = `${napkinSignedText.value}\n\n${emailText.value}`;
    await navigator.clipboard.writeText(combinedText);
    bothCopied.value = true;
    setTimeout(() => {
      bothCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

// Parse price from formatted string or use direct value
const parsePriceValue = (formattedPrice) => {
  if (!formattedPrice || formattedPrice === "N/A") return 0;
  return parseFloat(formattedPrice.replace(/[^0-9.-]+/g, '')) || 0;
};

// Calculate commission amount based on purchase price
const calculatedAgentCommission = computed(() => {
  const purchasePrice = parsePriceValue(props.formattedPurchaseOrListingPrice);
  if (!purchasePrice) return "N/A";
  return formatPrice(purchasePrice * (props.commissionPercent / 100));
});

// Calculate balance to close (Purchase Price - Loan Balance)
const calculatedBalanceToClose = computed(() => {
  const purchasePrice = parsePriceValue(props.formattedPurchaseOrListingPrice);
  const openLoanBalance = parsePriceValue(props.formattedOpenLoanBalance);
  if (!purchasePrice) return "N/A";
  return formatPrice(purchasePrice - openLoanBalance);
});

// Cash to seller is same as balance to close for simple purchase
const calculatedCashToSeller = computed(() => {
  return calculatedBalanceToClose.value;
});

// Placeholder values for seller carryback calculations
// In a real app, these would be calculated based on actual inputs
const calculatedSellerCarrybackAmount = computed(() => {
  return "N/A";
});

const calculatedSellerCarrybackInterestRate = computed(() => {
  return "N/A";
});

const calculatedSellerCarrybackMonthlyPayments = computed(() => {
  return "N/A";
});

// Generate NapkinSigned text template with calculated values
const generateNapkinSignedTemplate = () => {
  const address = props.propertyAddress;
  const agentName = props.listingAgentName;
  const ownerName = props.sellerName;
  
  return `If you are using NapkinSigned APP please copy this text:
Property Address: ${address}
APN: ${props.apn}
Legal Description: ${props.legalDescription}
County: ${props.county}
Sellers Name: ${ownerName}
Open Loan Balance: ${props.formattedOpenLoanBalance}
Cash to Seller at Closing: ${calculatedCashToSeller.value}
Balance to Close: ${calculatedBalanceToClose.value}
Seller Carryback Amount: ${calculatedSellerCarrybackAmount.value}
Seller Carryback Interest Rate: ${calculatedSellerCarrybackInterestRate.value}
Seller Carryback Monthly Payments: ${calculatedSellerCarrybackMonthlyPayments.value}
Listing Agent's Name: ${agentName}
Listing Agent's Phone: ${props.agentPhone}
Listing Agent's Email: ${agentName !== "N/A" ? "[Agent Email]" : "N/A"}
Agent Commission: ${props.commissionPercent}%
Agent Commission Amount: ${calculatedAgentCommission.value}
Purchase Price / Listing Price: ${props.formattedPurchaseOrListingPrice}`;
};

// Generate email text template with calculated values
const generateEmailTemplate = () => {
  const address = props.propertyAddress;
  const agentName = props.listingAgentName;
  const ownerName = props.sellerName;
  const recipientName = agentName !== "N/A" ? agentName : ownerName;
  const name = yourName.value || "Your Name";
  
  return `Hi ${recipientName},

Hope you're doing great. Please see the attached offer for ${address}:

•    Purchase Price / Listing Price: ${props.formattedPurchaseOrListingPrice}
•    Open Loan Balance: ${props.formattedOpenLoanBalance}
•    Balance to Close: ${calculatedBalanceToClose.value}
•    Cash to Seller at Closing: ${calculatedCashToSeller.value}
•    Seller Carryback Amount: ${calculatedSellerCarrybackAmount.value}
•    Seller Carryback Interest Rate: ${calculatedSellerCarrybackInterestRate.value}
•    Seller Carryback Monthly Payments: ${calculatedSellerCarrybackMonthlyPayments.value}
•    Agent Commission: ${props.commissionPercent}%
•    Agent Commission Amount: ${calculatedAgentCommission.value}
•    Listing Agent's Email: ${agentName !== "N/A" ? "[Agent Email]" : "N/A"}

If you're interested, please forward the mortgage statement if applicable or any counter terms to help us move faster.

For more info, visit our Transaction Guide:
https://urcreativesolutions.info/

Looking forward to working with you!

Be Great,
${name}`;
};

// Create reactive email and napkin signed text areas that users can edit
const napkinSignedText = ref("");
const emailText = ref("");

// Initialize fields on modal opening
watch(() => props.showModal, (isVisible) => {
  if (isVisible) {
    // Generate the templates with current values
    napkinSignedText.value = generateNapkinSignedTemplate();
    emailText.value = generateEmailTemplate();
    
    // Add overflow-hidden to body
    document.body.classList.add('overflow-hidden');
  }
}, { immediate: true });

// Update the templates when inputs change
watch([
  () => props.propertyAddress,
  () => props.sellerName,
  () => props.listingAgentName,
  () => props.formattedPurchaseOrListingPrice,
  () => props.formattedOpenLoanBalance,
  () => props.estimatedValue,
  () => props.apn,
  () => props.county,
  () => props.legalDescription,
  () => props.agentPhone,
  () => props.commissionPercent,
  () => yourName.value
], () => {
  if (props.showModal) {
    napkinSignedText.value = generateNapkinSignedTemplate();
    emailText.value = generateEmailTemplate();
  }
}, { deep: true });
</script>

<style scoped>
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

/* Custom scrollbar for text areas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #2d3748;
  border-radius: 8px;
}

textarea::-webkit-scrollbar-thumb {
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