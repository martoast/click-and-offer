<template>
  <div class="property-display">
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Property Gallery and Details Section (Left Column on Desktop) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Gallery Card -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg"
        >
          <div
            class="relative h-96 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center"
          >
            <!-- Zillow Images (if available) -->
            <template
              v-if="
                property.imgSrc ||
                (property.images && property.images.length > 0)
              "
            >
              <img
                :src="selectedImage || property.imgSrc"
                alt="Property main image"
                class="absolute inset-0 w-full h-full object-cover"
                @error="onImageError"
              />
            </template>

            <!-- Google Maps Fallback (when Zillow images not available) -->
            <template v-else>
              <div class="absolute inset-0">
                <!-- Loading Indicator -->
                <div
                  v-if="isLoadingImage"
                  class="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10"
                >
                  <div
                    class="w-10 h-10 border-4 border-slate-700 border-t-yellow-gold rounded-full animate-spin"
                  ></div>
                </div>

                <!-- Street View / Satellite Image -->
                <img
                  :src="googleImageUrl"
                  alt="Property View"
                  class="w-full h-full object-cover transition-opacity duration-300"
                  :class="{
                    'opacity-0': isLoadingImage,
                    'opacity-100': !isLoadingImage,
                  }"
                  @load="handleImageLoaded"
                  @error="handleImageError"
                />

                <!-- Controls for Google Maps View -->
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-300 italic">
                      {{
                        viewMode === "street" ? "Street View" : "Satellite View"
                      }}
                    </div>
                    <button
                      @click="toggleView"
                      class="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-200"
                      title="Toggle between Street View and Satellite View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="h-5 w-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Image Error State -->
                <div
                  v-if="imageError && viewMode === 'street'"
                  class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 z-5 p-4 text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="h-12 w-12 text-gray-400 mb-2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p class="text-gray-300">
                    Street view not available for this location
                  </p>
                  <button
                    @click="retryLoadImage"
                    class="mt-3 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Try Satellite View
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Thumbnail Gallery (Only for Zillow images) -->
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
            v-else-if="!hasZillowImages"
            class="mt-4 text-gray-400 text-sm italic"
          >
            Using Google Maps imagery - no listing photos available.
          </div>
        </div>

        <!-- Property Details Card (No changes) -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg"
        >
          <!-- Property details content stays the same -->
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-yellow-gold"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fill-rule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              />
            </svg>
            Property Summary
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Address:</span>
              <span class="text-white font-medium">{{
                computedPropertyAddress
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">City/State/Zip:</span>
              <span class="text-white font-medium">
                {{
                  reapi_property.propertyInfo?.address?.city ||
                  property.city ||
                  property.address?.city ||
                  "N/A"
                }},
                {{
                  reapi_property.propertyInfo?.address?.state ||
                  property.state ||
                  property.address?.state ||
                  "N/A"
                }}
                {{
                  reapi_property.propertyInfo?.address?.zip ||
                  property.zipcode ||
                  property.address?.zipcode ||
                  "N/A"
                }}
              </span>
            </div>
            <!-- Rest of property details remain unchanged -->
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">County:</span>
              <span class="text-white font-medium">{{ computedCounty }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">APN:</span>
              <span class="text-white font-medium">{{ computedApn }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2"
            >
              <span class="text-gray-400">Legal Description:</span>
              <span class="text-white font-medium text-right">{{
                computedLegalDescription
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Type:</span>
              <span class="text-white font-medium">{{
                reapi_property.propertyType || property.homeType || "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Bedrooms:</span>
              <span class="text-white font-medium">{{
                reapi_property.propertyInfo?.bedrooms ||
                property.bedrooms ||
                "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Bathrooms:</span>
              <span class="text-white font-medium">{{
                reapi_property.propertyInfo?.bathrooms ||
                property.bathrooms ||
                "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Living Area:</span>
              <span class="text-white font-medium"
                >{{
                  formatNumber(
                    reapi_property.propertyInfo?.livingSquareFeet ||
                      property.livingArea ||
                      property.livingAreaValue
                  ) || "N/A"
                }}
                sqft</span
              >
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Lot Size:</span>
              <span class="text-white font-medium"
                >{{
                  formatNumber(
                    reapi_property.lotInfo?.lotSquareFeet || property.lotSize
                  ) || "N/A"
                }}
                sqft</span
              >
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Year Built:</span>
              <span class="text-white font-medium">{{
                reapi_property.propertyInfo?.yearBuilt ||
                property.yearBuilt ||
                "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Last Sale Date:</span>
              <span class="text-white font-medium">{{
                formatDate(
                  reapi_property.lastSale?.saleDate || property.lastSaleDate
                ) || "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Last Sale Price:</span>
              <span class="text-white font-medium">{{
                formatPrice(
                  reapi_property.lastSale?.saleAmount || property.lastSalePrice
                ) || "N/A"
              }}</span>
            </div>
            <div
              v-if="property.resoFacts?.hoaFee || property.monthlyHoaFee"
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">HOA Fee:</span>
              <span class="text-white font-medium">
                {{
                  formatPrice(
                    property.resoFacts?.hoaFee || property.monthlyHoaFee
                  )
                }}/{{ property.resoFacts?.hoaFeeFreq || "mo" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column stays the same -->
      <div class="space-y-6">
        <!-- Property Header Card -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg"
        >
          <!-- Content remains the same -->
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              {{ computedPropertyAddress }}
            </h1>
            <p class="text-gray-400">
              {{
                reapi_property.propertyInfo?.address?.city ||
                property.city ||
                "N/A"
              }},
              {{
                reapi_property.propertyInfo?.address?.state ||
                property.state ||
                "N/A"
              }}
              {{
                reapi_property.propertyInfo?.address?.zip ||
                property.zipcode ||
                "N/A"
              }}
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
                {{
                  reapi_property.propertyInfo?.bedrooms ||
                  property.bedrooms ||
                  "N/A"
                }}
                bed
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
                {{
                  reapi_property.propertyInfo?.bathrooms ||
                  property.bathrooms ||
                  "N/A"
                }}
                bath
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
                {{
                  formatNumber(
                    reapi_property.propertyInfo?.livingSquareFeet ||
                      property.livingArea
                  ) || "N/A"
                }}
                sqft
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
                Built:
                {{
                  reapi_property.propertyInfo?.yearBuilt ||
                  property.yearBuilt ||
                  "N/A"
                }}
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
                <div class="text-yellow-gold text-2xl md:text-3xl font-bold">
                  {{
                    formatPrice(
                      reapi_property.estimatedValue || property.zestimate
                    )
                  }}
                </div>
                <div
                  v-if="
                    (reapi_property.estimatedValue || property.zestimate) &&
                    (reapi_property.propertyInfo?.livingSquareFeet ||
                      property.livingArea)
                  "
                  class="text-sm text-gray-400 mt-1"
                >
                  {{
                    formatPrice(
                      Math.round(
                        (reapi_property.estimatedValue || property.zestimate) /
                          (reapi_property.propertyInfo?.livingSquareFeet ||
                            property.livingArea)
                      )
                    )
                  }}/sqft
                </div>
              </div>
              <div
                v-if="
                  property.rentZestimate ||
                  reapi_property.demographics?.suggestedRent
                "
                class="text-right"
              >
                <div class="mb-0">
                  <span class="text-gray-400 text-sm">Suggested Rent</span>
                </div>
                <div class="text-yellow-gold text-xl font-semibold">
                  {{
                    formatPrice(
                      property.rentZestimate ||
                        reapi_property.demographics?.suggestedRent
                    )
                  }}/mo
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Details Card -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg"
        >
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-yellow-gold"
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
            Financial Details
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Purchase/Listing Price:</span>
              <span class="text-white font-medium">{{
                computedFormattedPurchaseOrListingPrice
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Open Loan Balance:</span>
              <span class="text-white font-medium">{{
                computedFormattedOpenLoanBalance
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Estimated Equity:</span>
              <span class="text-white font-medium">{{
                formatPrice(
                  reapi_property.equity || reapi_property.estimatedEquity
                )
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Equity Percentage:</span>
              <span class="text-white font-medium">{{
                reapi_property.equityPercent != null
                  ? `${reapi_property.equityPercent}%`
                  : "N/A"
              }}</span>
            </div>
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Est. Monthly Payment:</span>
              <span class="text-white font-medium"
                >{{
                  formatPrice(reapi_property.estimatedMortgagePayment)
                }}/mo</span
              >
            </div>
            <div
              v-if="
                reapi_property.currentMortgages &&
                reapi_property.currentMortgages.length > 0
              "
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Lender:</span>
              <span class="text-white font-medium">{{
                reapi_property.currentMortgages[0].lenderName || "N/A"
              }}</span>
            </div>
            <div
              v-if="
                reapi_property.currentMortgages &&
                reapi_property.currentMortgages.length > 0
              "
              class="flex justify-between border-b border-yellow-gold/20 py-2"
            >
              <span class="text-gray-400">Loan Maturity Date:</span>
              <span class="text-white font-medium">{{
                formatDate(reapi_property.currentMortgages[0].maturityDate) ||
                "N/A"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Owner & Agent Information -->
        <div
          class="bg-gradient-to-br from-black to-gray-900 rounded-lg border border-yellow-gold/30 p-6 shadow-lg"
        >
          <h2 class="text-xl font-bold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-yellow-gold"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013-3c.295 0 .584.043.852.127z"
              />
            </svg>
            Owner & Agent Information
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div
              class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2"
            >
              <span class="text-gray-400">Owner's Name:</span>
              <span class="text-white font-medium">{{
                computedSellerName
              }}</span>
            </div>

            <template v-if="computedAgentInfo">
              <div
                class="flex items-center border-b border-yellow-gold/20 py-3 sm:col-span-2"
              >
                <div
                  class="flex-shrink-0 mr-3"
                  v-if="computedListingAgentImage"
                >
                  <img
                    :src="computedListingAgentImage"
                    alt="Agent photo"
                    class="w-14 h-14 rounded-full object-cover border border-yellow-gold/30"
                  />
                </div>
                <div class="flex-grow">
                  <span class="text-gray-400">Agent:</span>
                  <div class="font-bold text-white">
                    {{ computedListingAgentName }}
                  </div>
                  <div class="text-yellow-gold text-sm">
                    {{ computedListingAgentBusinessName }}
                  </div>
                </div>
              </div>

              <div
                class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2"
              >
                <span class="text-gray-400">Contact Number:</span>
                <span class="text-white font-medium">{{
                  computedListingAgentPhone
                }}</span>
              </div>

              <div
                class="flex justify-between border-b border-yellow-gold/20 py-2 sm:col-span-2"
              >
                <span class="text-gray-400">Contact Email:</span>
                <span class="text-white font-medium">{{
                  computedListingAgentEmail
                }}</span>
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

    <!-- Offer Email Modal Component -->
    <OfferEmailModal
      v-model:showModal="showModal"
      :apn="computedApn"
      :county="computedCounty"
      :propertyAddress="computedPropertyAddress"
      :sellerName="computedSellerName"
      :listingAgentName="computedListingAgentName"
      :formattedPurchaseOrListingPrice="computedFormattedPurchaseOrListingPrice"
      :formattedOpenLoanBalance="computedFormattedOpenLoanBalance"
      :estimatedValue="computedEstimatedValue"
      :legalDescription="computedLegalDescription"
      :agentPhone="computedListingAgentPhone"
      :agentEmail="computedListingAgentEmail"
      :commissionPercent="3"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import OfferEmailModal from "./OfferEmailModal.vue";

const props = defineProps({
  property: {
    // Assuming this is primarily Zillow data or a general merged object for display
    type: Object,
    required: true,
    default: () => ({}), // Add default empty object
  },
  reapi_property: {
    // Specific REAPI data
    type: Object,
    required: true,
  },
  mapboxToken: {
    type: String,
    default: "",
  },
  contractSystemUrl: {
    type: String,
    default: "https://contracts.yourdomain.com",
  },
});

const config = useRuntimeConfig();
const googleMapsApiKey = config.public.GOOGLE_MAPS_API_KEY;

const NA_FALLBACK = "N/A";

// --- Local State for Gallery ---
const selectedImage = ref(null);

// --- Local State for Modal ---
const showModal = ref(false);

// --- Google Maps View State ---
const viewMode = ref("street");
const isLoadingImage = ref(true);
const imageError = ref(false);

// Check if we have Zillow images
const hasZillowImages = computed(() => {
  return Boolean(
    props.property.imgSrc ||
      (props.property.images && props.property.images.length > 0)
  );
});

// Get property coordinates for Google Maps
const propertyCoordinates = computed(() => {
  return {
    latitude:
      props.reapi_property?.propertyInfo?.latitude ||
      props.property?.latitude ||
      null,
    longitude:
      props.reapi_property?.propertyInfo?.longitude ||
      props.property?.longitude ||
      null,
  };
});

// Computed Google Maps image URL based on view mode
const googleImageUrl = computed(() => {
  const { latitude, longitude } = propertyCoordinates.value;

  if (!latitude || !longitude) {
    return "/placeholder.png"; // Fallback to placeholder if no coordinates
  }

  if (viewMode.value === "street") {
    return `https://maps.googleapis.com/maps/api/streetview?location=${latitude},${longitude}&size=800x600&key=${googleMapsApiKey}`;
  } else {
    // Satellite view
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=19&size=800x600&maptype=satellite&markers=color:red%7C${latitude},${longitude}&key=${googleMapsApiKey}`;
  }
});

// --- Methods ---
const formatPrice = (price) => {
  if (price == null || isNaN(Number(price)) || String(price).trim() === "")
    return NA_FALLBACK;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
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
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return NA_FALLBACK;
  }
};

const onImageError = (event) => {
  // Update to use local placeholder image
  event.target.src = "/placeholder.png";
  event.target.alt = "Image failed to load";
};

const selectImage = (imageUrl) => {
  selectedImage.value = imageUrl;
};

// Open modal
const openModal = () => {
  showModal.value = true;
};

// Google Maps image handling
const handleImageLoaded = () => {
  isLoadingImage.value = false;
  imageError.value = false;
};

const handleImageError = () => {
  isLoadingImage.value = false;
  imageError.value = true;
};

const toggleView = () => {
  viewMode.value = viewMode.value === "street" ? "satellite" : "street";
  isLoadingImage.value = true;
  imageError.value = false;
};

const retryLoadImage = () => {
  viewMode.value = "satellite";
  isLoadingImage.value = true;
  imageError.value = false;
};

// --- Computed Properties for REAPI specific data ---
const computedPropertyAddress = computed(() => {
  return (
    props.reapi_property?.propertyInfo?.address?.address ||
    props.property?.streetAddress ||
    props.property?.address?.streetAddress ||
    NA_FALLBACK
  );
});

const computedOpenLoanBalance = computed(() => {
  const balance = props.reapi_property.estimatedMortgageBalance;
  return balance !== undefined && 
    balance !== null && 
    String(balance).trim() !== "" 
    ? Number(balance) 
    : null;
});

const computedFormattedOpenLoanBalance = computed(() =>
  formatPrice(computedOpenLoanBalance.value)
);

const computedApn = computed(() => {
  return (
    props.reapi_property?.lotInfo?.apn ||
    props.property?.resoFacts?.parcelNumber ||
    NA_FALLBACK
  );
});

const computedLegalDescription = computed(() => {
  return props.reapi_property?.lotInfo?.legalDescription || NA_FALLBACK;
});

const computedCounty = computed(() => {
  return (
    props.reapi_property?.propertyInfo?.address?.county ||
    props.property?.county ||
    NA_FALLBACK
  );
});

const computedSellerName = computed(() => {
  return props.reapi_property?.ownerInfo?.owner1FullName || NA_FALLBACK;
});

// Get agent information from contact_recipients
const computedAgentInfo = computed(() => {
  if (
    props.property?.contact_recipients &&
    props.property.contact_recipients.length > 0
  ) {
    return props.property.contact_recipients[0];
  }
  return null;
});

const computedListingAgentName = computed(() => {
  const { mlsHistory } = props.reapi_property;
  return (mlsHistory && mlsHistory.length > 0 && mlsHistory[0].agentName)
    ? mlsHistory[0].agentName 
    : (computedAgentInfo.value?.display_name || NA_FALLBACK);
});

const computedListingAgentBusinessName = computed(() => {
  const { mlsHistory } = props.reapi_property;
  return (mlsHistory && mlsHistory.length > 0 && mlsHistory[0].agentOffice)
    ? mlsHistory[0].agentOffice
    : (computedAgentInfo.value?.business_name || NA_FALLBACK);
});

const computedListingAgentPhone = computed(() => {
  const { mlsHistory } = props.reapi_property;
  
  if (mlsHistory && mlsHistory.length > 0 && mlsHistory[0].agentPhone) {
    return mlsHistory[0].agentPhone;
  }
  
  if (computedAgentInfo.value?.phone) {
    const phone = computedAgentInfo.value.phone;
    return `(${phone.areacode}) ${phone.prefix}-${phone.number}`;
  }
  
  return NA_FALLBACK;
});

const computedListingAgentEmail = computed(() => {
  const { mlsHistory } = props.reapi_property;
  return (mlsHistory && mlsHistory.length > 0 && mlsHistory[0].agentEmail)
    ? mlsHistory[0].agentEmail
    : (computedAgentInfo.value?.email || NA_FALLBACK);
});


const computedListingAgentImage = computed(() => {
  return computedAgentInfo.value?.image_url || null;
});

// Property value calculations
const computedEstimatedValue = computed(() => {
  return (
    props.reapi_property?.estimatedValue || props.property?.zestimate || null
  );
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
    if (Number(reapi.mlsListingPrice) > 10000 || reapi.mlsType === "ForSale") {
      return Number(reapi.mlsListingPrice);
    }
  }

  // Check for price in Zillow data
  if (props.property?.price && !isNaN(Number(props.property.price))) {
    return Number(props.property.price);
  }

  // Last resort - check last sale price
  const lastSalePrice =
    props.property?.lastSalePrice || reapi?.lastSale?.saleAmount || null;

  return lastSalePrice;
});

const computedFormattedPurchaseOrListingPrice = computed(() =>
  formatPrice(computedPurchaseOrListingPrice.value)
);

// --- Image Gallery Watchers ---
watch(
  () => props.property,
  (newVal) => {
    if (newVal && newVal.imgSrc) {
      selectedImage.value = newVal.imgSrc;
    } else if (newVal && newVal.images && newVal.images.length > 0) {
      // Ensure image is an object with a url or a string
      const firstImage = newVal.images[0];
      selectedImage.value =
        typeof firstImage === "string" ? firstImage : firstImage?.url;
    } else {
      selectedImage.value = null; // Reset if no images, will fall back to Google Maps
      // Initialize Google Maps view if needed
      if (
        !hasZillowImages.value &&
        propertyCoordinates.value.latitude &&
        propertyCoordinates.value.longitude
      ) {
        isLoadingImage.value = true;
        imageError.value = false;
      }
    }
  },
  { immediate: true, deep: true }
);

// Initialize Google Maps view when component is mounted if needed
onMounted(() => {
  if (
    !hasZillowImages.value &&
    propertyCoordinates.value.latitude &&
    propertyCoordinates.value.longitude
  ) {
    isLoadingImage.value = true;
  }
});
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