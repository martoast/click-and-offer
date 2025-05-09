<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Top-Left Logo -->
    <div class="absolute hidden md:block top-4 left-4 z-20">
      <a href="/">
        <img src="/logo.png" alt="Click&Offer Logo" class="h-10 md:h-12" />
      </a>
    </div>

    <!-- Back Button & Property Actions -->
    <div
      class="container mx-auto px-4 py-4 flex justify-between items-center print:hidden"
    >
      <button
        @click="router.push('/')"
        class="flex items-center text-yellow-gold-light hover:text-blue-200 transition-colors"
        aria-label="Back to search results"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Search
      </button>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-yellow-gold-light text-sm flex items-center"
          @click="printPage"
          aria-label="Print property details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clip-rule="evenodd"
            />
          </svg>
          Print
        </button>
        <button
          class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-yellow-gold-light text-sm flex items-center"
          @click="shareProperty"
          aria-label="Share property link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
            />
          </svg>
          Share
        </button>
      </div>
    </div>

    <!-- Loading States -->
    <div
      v-if="loading || loadingState.images"
      class="container mx-auto px-4 py-4"
    >
      <!-- Full Loading State -->
      <div v-if="loading" class="py-12 text-center">
        <div
          class="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-slate-300">Loading property data...</p>
      </div>

      <!-- Images Loading Indicator - only shown when basic data is loaded but images are still loading -->
      <div
        v-else-if="loadingState.images"
        class="bg-blue-900/20 border border-blue-900/30 rounded-lg px-4 py-2 flex items-center justify-center print:hidden"
      >
        <div
          class="w-4 h-4 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin mr-3"
        ></div>
        <p class="text-sm text-yellow-gold-light">
          Loading additional images...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="container mx-auto px-4 py-12 text-center">
      <div
        class="bg-slate-900 border border-slate-800 text-red-500 p-6 rounded-lg max-w-lg mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="font-semibold">Failed to load property data</p>
        <p class="text-sm mt-1">{{ error }}</p>
        <button
          @click="fetchPropertyData"
          class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors print:hidden"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Property Content -->
    <div v-else-if="zillowData" class="container mx-auto px-4 pb-16 space-y-8">
      <!-- Property Overview Section -->
      <PropertyOverview
        :property="zillowData"
        :reapi_property="realEstateData"
        :mapbox-token="mapboxToken"
      />

      <PropertyComps
        v-if="
          realEstateData &&
          realEstateData.comps &&
          realEstateData.comps.length > 0
        "
        :data="realEstateData"
        :mapbox-token="mapboxToken"
      />

      <!-- Investment Opportunity Section -->
      <InvestmentOpportunity
        :property="zillowData"
        :reapi_property="realEstateData"
      />

      <!-- AI Assistant CTA Button (shown when chat is not active) -->
      <!-- Replace the AI Assistant CTA Button content with this revised version -->
      <div
        v-if="!showAIChat"
        class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg print:hidden"
      >
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-6 md:mb-0 text-center md:text-left">
            <h3 class="text-xl font-bold text-white mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-yellow-gold"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              Ready to Lock This Deal?
            </h3>
            <p class="text-gray-400 max-w-xl">
              I'll help you structure offers, run the numbers, craft messages to
              sellers, and give you winning scripts for any objections.
            </p>
          </div>
          <button
            @click="showAIChat = true"
            class="bg-gradient-to-r from-yellow-600 to-yellow-gold px-6 py-3 rounded-lg font-bold text-sm text-black hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 relative overflow-hidden group"
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
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              Get Deal Strategies
              <span class="ml-2">→</span>
            </span>
            <span
              class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></span>
          </button>
        </div>
      </div>

      <!-- AI Chat Interface (shown when activated) -->
      <div
        v-if="showAIChat"
        class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 shadow-lg overflow-hidden print:hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-900 to-black p-4 border-b border-yellow-gold/30 flex items-center justify-between"
        >
          <h3 class="text-lg font-bold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-yellow-gold"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
            Real Estate Deal Advisor
          </h3>
          <button
            @click="showAIChat = false"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Minimize chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Chat Messages Area -->
        <div
          ref="chatContainer"
          class="h-80 overflow-y-auto p-4 space-y-4"
          :class="{ 'flex items-center justify-center': messages.length === 0 }"
        >
          <!-- Welcome Message -->
          <div
            v-if="messages.length === 0"
            class="text-center text-gray-400 max-w-md mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mx-auto mb-3 text-yellow-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p class="font-bold mb-2 text-yellow-gold text-lg">
              Your Real Estate Deal Advisor
            </p>
            <p class="text-sm mb-4">
              I'll analyze this property and help you structure creative deals,
              craft winning offers, handle objections, and maximize your
              profits.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <button
                v-for="(suggestion, i) in chatSuggestions"
                :key="i"
                @click="sendMessage(suggestion)"
                class="bg-gray-900 hover:bg-gray-800 py-2 px-3 rounded-md text-sm text-left transition-colors text-yellow-gold-light border border-yellow-gold/10"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Chat Messages -->
          <template v-for="(message, index) in messages" :key="index">
            <!-- User Message -->
            <div v-if="message.role === 'user'" class="flex justify-end">
              <div
                class="bg-yellow-600/30 text-white rounded-lg py-2 px-4 max-w-[80%] border border-yellow-gold/20"
              >
                <p class="whitespace-pre-wrap text-sm">{{ message.content }}</p>
              </div>
            </div>

            <!-- AI Message -->
            <div v-else class="flex justify-start">
              <div
                class="bg-gray-900/80 text-white rounded-lg py-2 px-4 max-w-[80%] border border-yellow-gold/10"
              >
                <p
                  class="whitespace-pre-wrap text-sm"
                  v-html="formatMessage(message.content)"
                ></p>
              </div>
            </div>
          </template>

          <!-- Loading Indicator -->
          <div v-if="chatLoading" class="flex justify-start">
            <div
              class="bg-gray-900/80 text-white rounded-lg py-2 px-4 border border-yellow-gold/10"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-2 h-2 bg-yellow-gold rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                ></div>
                <div
                  class="w-2 h-2 bg-yellow-gold rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                ></div>
                <div
                  class="w-2 h-2 bg-yellow-gold rounded-full animate-bounce"
                  style="animation-delay: 300ms"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div
          class="bg-gradient-to-r from-gray-900 to-black p-4 border-t border-yellow-gold/30"
        >
          <form @submit.prevent="sendMessage()" class="flex space-x-2">
            <input
              v-model="userInput"
              type="text"
              placeholder="Ask about deal structures, offers, scripts, or strategies..."
              class="w-full px-4 py-2 bg-black border border-yellow-gold/20 rounded-md text-white focus:ring-2 focus:ring-yellow-gold focus:border-transparent focus:outline-none"
              :disabled="chatLoading"
            />
            <button
              type="submit"
              class="bg-gradient-to-r from-yellow-600 to-yellow-gold px-4 py-2 text-black font-medium rounded-md hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              :disabled="chatLoading || !userInput.trim()"
            >
              <span class="relative z-10 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span
                class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              ></span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && !error"
      class="container mx-auto px-4 py-12 text-center text-slate-400 italic"
    >
      Property data could not be loaded or is unavailable.
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import PropertyOverview from "~/components/PropertyOverview.vue";
import InvestmentOpportunity from "~/components/InvestmentOpportunity.vue";

// --- Configuration ---
const config = useRuntimeConfig();
const mapboxToken = config.public.MAPBOX_API_TOKEN;
const zillowApiKey = config.public.ZILLOW_API_KEY;
const ZILLOW_API_HOST = "zillow-com1.p.rapidapi.com";

// --- State ---
const route = useRoute();
const router = useRouter();

const realEstateData = ref(null);
const zillowData = ref(null);
const loading = ref(true);
const error = ref(null);
const loadingState = reactive({
  realEstate: true,
  zillow: false,
  images: false,
});

// AI Chat State
const showAIChat = ref(false);
const userInput = ref("");
const messages = ref([]);
const chatLoading = ref(false);
const chatContainer = ref(null);
const threadId = ref(null);

// Suggested questions for the user
const chatSuggestions = [
  "What are the best deal structures for this property?",
  "Run the numbers for a Subject-To offer on this property",
  "Create a seller finance offer with terms I can use",
  "What objections might I face with this property and how to handle them?",
  "Help me craft a compelling initial message to the seller",
  "What's a creative strategy to maximize my profit on this deal?",
];

// Computed property that combines both data sources
const property = computed(() => {
  if (!realEstateData.value) return null;

  return {
    ...realEstateData.value,
    zillow: zillowData.value || {},
  };
});

// --- Actions ---
const shareProperty = async () => {
  const address =
    realEstateData.value?.propertyInfo?.address?.label || "Property";

  const shareData = {
    title: `${address}`,
    text: `Check out this property: ${address}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } else {
      alert("Sharing not supported on this browser.");
    }
  } catch (err) {
    console.error("Error sharing property:", err);
    if (err.name !== "AbortError") {
      alert("Could not share property.");
    }
  }
};

const printPage = () => {
  window.print();
};

// --- AI Chat Functions ---
// Format the message content with simple markdown-like parsing
const formatMessage = (content) => {
  if (!content) return "";

  // Convert line breaks to <br>
  let formatted = content.replace(/\n/g, "<br>");

  // Bold text between ** **
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italics text between * *
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

  return formatted;
};

// Scroll to the bottom of the chat container
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Send a message to the AI
const sendMessage = async (text) => {
  const messageContent = text || userInput.value.trim();
  if (!messageContent || chatLoading.value) return;

  // Add user message to the chat
  messages.value.push({
    role: "user",
    content: messageContent,
  });

  // Reset input field
  userInput.value = "";

  // Scroll to bottom to show new message
  scrollToBottom();

  // Show loading indicator
  chatLoading.value = true;

  try {
    // Call the API with the threadId if it exists
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.value,
        property: property.value,
        threadId: threadId.value,
      }),
    });

    const data = await response.json();

    if (data.status === "success" && data.message) {
      // Store the threadId for future messages
      if (data.threadId) {
        threadId.value = data.threadId;
      }

      // Add AI response to chat
      messages.value.push({
        role: "assistant",
        content: data.message.content,
      });
    } else {
      // Handle API error
      messages.value.push({
        role: "assistant",
        content:
          data.message ||
          "I'm sorry, I encountered an error. Please try again.",
      });
      console.error("AI Chat Error:", data.error || "Unknown error");
    }
  } catch (error) {
    console.error("AI Chat Error:", error);
    messages.value.push({
      role: "assistant",
      content:
        "I'm sorry, there was a problem connecting to the AI service. Please try again later.",
    });
  } finally {
    chatLoading.value = false;
    scrollToBottom();
  }
};

// Watch for changes in messages to scroll to bottom
watch(messages, () => {
  scrollToBottom();
});

// --- API Helper Function ---
const fetchWithRetry = async (url, options, maxRetries = 2, delayMs = 1000) => {
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, options);

      // Handle rate limiting (status 429)
      if (response.status === 429) {
        console.warn(
          `Rate limit hit, attempt ${retries + 1}/${maxRetries + 1}`
        );
        retries++;

        if (retries <= maxRetries) {
          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * retries)
          );
          continue;
        } else {
          throw new Error(`Rate limit exceeded after ${maxRetries} retries`);
        }
      }

      // Handle other errors
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `API Error Response (${url}):`,
          response.status,
          errorBody
        );
        throw new Error(
          `API Error (${response.status}): ${
            errorBody || "Failed to fetch data"
          }`
        );
      }

      return response.json();
    } catch (err) {
      retries++;

      if (
        retries <= maxRetries &&
        !err.message.includes("Rate limit exceeded")
      ) {
        console.warn(
          `Request failed, retrying (${retries}/${maxRetries})...`,
          err
        );
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs * retries));
      } else {
        throw err;
      }
    }
  }
};

// --- Data Fetching Functions ---
const fetchPropertyData = async () => {
  const propertyId = route.params.id;

  if (!propertyId) {
    error.value = "No property ID provided in the URL.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  realEstateData.value = null;
  zillowData.value = null;
  loadingState.realEstate = true;

  try {
    // Determine if the ID is a numeric ID or an encoded address
    const requestBody = {};

    if (/^\d+$/.test(propertyId)) {
      // If it's numeric, use it as an ID
      requestBody.id = propertyId;
    } else {
      // Otherwise, assume it's an encoded address
      requestBody.address = decodeURIComponent(propertyId);
    }

    // Call the Real Estate API through our server middleware
    console.log(
      `Fetching property details from Real Estate API for: ${propertyId}`
    );
    const response = await fetch("/api/real-estate/PropertyDetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...requestBody,
        comps: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data) {
      throw new Error(
        "Property data not found or incomplete response from API."
      );
    }

    console.log("Property details fetched successfully from Real Estate API");
    realEstateData.value = data.data;
    loadingState.realEstate = false;

    // Fetch Zillow data if we have a valid address
    if (realEstateData.value?.propertyInfo?.address?.label) {
      fetchZillowData(realEstateData.value.propertyInfo.address.label);
    } else {
      // No valid address, skip Zillow API
      loading.value = false;
    }
  } catch (err) {
    console.error(
      "Error during property data fetching from Real Estate API:",
      err
    );
    error.value = err.message || "Failed to load property data.";
    loading.value = false;
    loadingState.realEstate = false;
  }
};

const fetchZillowData = async (formattedAddress) => {
  if (!formattedAddress || !zillowApiKey) {
    loading.value = false;
    return;
  }

  loadingState.zillow = true;

  try {
    console.log(`Finding Zillow property for address: ${formattedAddress}`);

    // 1. First try to search for the property by address
    const encodedAddress = encodeURIComponent(formattedAddress);
    const searchWithParamsUrl = `https://${ZILLOW_API_HOST}/propertyExtendedSearch?location=${encodedAddress}`;

    const searchData = await fetchWithRetry(searchWithParamsUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": zillowApiKey,
        "X-RapidAPI-Host": ZILLOW_API_HOST,
      },
    });
    if (!searchData.zpid) {
      console.log("no zpid found");
      return;
    }

    console.log(searchData.zpid);
    // 2. Get the first result's zpid
    const zpid = searchData.zpid;
    console.log(`Found Zillow property with zpid: ${zpid}`);

    // Now fetch property details using zpid
    await fetchZillowPropertyDetails(zpid);
  } catch (err) {
    console.warn("Error finding Zillow property:", err);
    // Don't set the main error - we still have Real Estate API data
    loadingState.zillow = false;
    loading.value = false;
  }
};

const fetchZillowPropertyDetails = async (zpid) => {
  if (!zpid || !zillowApiKey) {
    loadingState.zillow = false;
    loading.value = false;
    return;
  }

  try {
    // Wait a bit to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 1. Fetch property details
    console.log(`Fetching Zillow property details for zpid: ${zpid}`);

    const fetchedPropertyData = await fetchWithRetry(
      `https://${ZILLOW_API_HOST}/property?zpid=${zpid}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": zillowApiKey,
          "X-RapidAPI-Host": ZILLOW_API_HOST,
        },
      }
    );

    if (!fetchedPropertyData || !fetchedPropertyData.zpid) {
      throw new Error(
        "Zillow property data not found or incomplete response from API."
      );
    }

    console.log("Zillow property details fetched successfully");

    // Create a temporary version with the main data
    zillowData.value = {
      ...fetchedPropertyData,
      images: fetchedPropertyData.imgSrc ? [fetchedPropertyData.imgSrc] : [],
    };

    // Update loading state for images
    loadingState.zillow = false;
    loadingState.images = true;

    // 2. Fetch images with its own try/catch to allow partial loading
    await fetchZillowImages(zpid, fetchedPropertyData);
  } catch (err) {
    console.error("Error during Zillow property data fetching:", err);
    loadingState.zillow = false;
    loadingState.images = false;
    loading.value = false;
  }
};

const fetchZillowImages = async (zpid, propertyData) => {
  try {
    // Wait a bit before fetching images to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`Fetching Zillow images for zpid: ${zpid}`);

    const imagesData = await fetchWithRetry(
      `https://${ZILLOW_API_HOST}/images?zpid=${zpid}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": zillowApiKey,
          "X-RapidAPI-Host": ZILLOW_API_HOST,
        },
      }
    );

    console.log("Zillow images fetched successfully");

    if (
      imagesData &&
      Array.isArray(imagesData.images) &&
      imagesData.images.length > 0
    ) {
      // Check if main image is already in the array
      const mainImageExists = imagesData.images.some(
        (img) => (img.url || img) === propertyData.imgSrc
      );

      // Update property with images
      zillowData.value = {
        ...propertyData,
        images: mainImageExists
          ? imagesData.images
          : propertyData.imgSrc
          ? [propertyData.imgSrc, ...imagesData.images]
          : imagesData.images,
      };
    }
  } catch (imageError) {
    console.warn(
      "Failed to fetch Zillow images, continuing with basic property data:",
      imageError
    );
    // Don't rethrow - we still have the main property data
  } finally {
    // Update loading state when images operation completes
    loadingState.images = false;
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  console.log(
    "Property page component mounted. Checking config and fetching data..."
  );

  // Validate configuration
  if (!mapboxToken) {
    console.warn(
      "Mapbox API token configuration is missing. Map will not display."
    );
  }

  // Fetch property data
  fetchPropertyData();

  // Initialize chat scroll
  scrollToBottom();
});
</script>
