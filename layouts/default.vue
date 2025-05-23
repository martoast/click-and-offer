<!-- layouts/default.vue -->
<template>
    <div>
      <!-- Loading state while checking auth -->
      <Transition name="fade">
        <div v-if="!authChecked" class="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
          <!-- Gradient background -->
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-gold/10 via-transparent to-black"></div>
          
          <!-- Static background circles -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-yellow-gold/5 blur-3xl top-[10%] left-[5%]"></div>
            <div class="absolute w-40 h-40 md:w-56 md:h-56 rounded-full bg-yellow-gold/5 blur-3xl bottom-[20%] right-[10%]"></div>
            <div class="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-yellow-gold/5 blur-3xl top-[60%] left-[80%]"></div>
          </div>
          
          <!-- Loading spinner -->
          <div class="relative z-10 flex flex-col items-center">
            <img src="/logo.png" alt="Click&Offer Logo" class="h-12 md:h-16 mb-6 opacity-50" />
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 border-2 border-yellow-gold border-t-transparent rounded-full animate-spin"></div>
              <span class="text-yellow-gold text-sm">Loading...</span>
            </div>
          </div>
        </div>
      </Transition>
      
      <!-- Main content after auth check -->
      <div v-show="authChecked">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  const authChecked = useState('authChecked');
  </script>
  
  <style scoped>
  /* Fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>