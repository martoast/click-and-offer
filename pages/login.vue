<template>
  <div
    class="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden"
  >
    <!-- Background gradient -->
    <div
      class="absolute inset-0 bg-gradient-radial from-yellow-gold/5 via-gray-900/30 to-black/90"
    ></div>

    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="i in 5"
        :key="i"
        class="absolute rounded-full opacity-10 animate-float"
        :style="{
          width: `${50 + i * 30}px`,
          height: `${50 + i * 30}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 2}s`,
          animationDuration: `${15 + i * 5}s`,
          background:
            i % 2 === 0
              ? 'linear-gradient(135deg, #d4af3780, #202020)'
              : 'linear-gradient(135deg, #f9d77680, #202020)',
        }"
      ></div>
    </div>

    <!-- Main content -->
    <div
      class="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12"
    >
      <!-- Left side - Login form -->
      <div
        class="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        <img src="/logo.png" alt="Click&Offer Logo" class="h-16 mb-8" />

        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span class="text-yellow-gold">Click&Offer</span>
        </h1>

        <p class="text-lg text-gray-300 mb-8 max-w-lg">
          Your all-in-one platform for analyzing properties, generating offers,
          and closing deals with confidence.
        </p>

        <button
          @click="loginWithWhop"
          class="bg-gradient-to-r from-yellow-600 to-yellow-gold px-8 py-4 rounded-lg font-bold text-black hover:from-yellow-gold hover:to-yellow-gold-light transition-all duration-300 shadow-md border border-yellow-gold-dark/50 relative overflow-hidden group mb-6"
        >
          <span class="relative z-10 flex items-center justify-center text-lg">
            Login with Whop
            <span class="ml-2">→</span>
          </span>
          <span
            class="absolute inset-0 bg-gradient-to-r from-yellow-gold-light to-yellow-gold opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          ></span>
        </button>

        <!-- New Membership CTA -->
        <div class="text-center lg:text-left">
          <p class="text-gray-400 mb-4">Not a UR Hustle House Member Yet?</p>
          <a
            href="https://whop.com/ur-hustle-house/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-yellow-gold hover:text-yellow-gold-light transition-colors"
          >
            Join now to get your first deal
            <span class="ml-2">→</span>
          </a>
        </div>
      </div>

      <!-- Right side - Demo video -->
      <div
        class="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-2xl border border-yellow-gold/30"
      >
        <iframe
          src="https://streamable.com/e/8i8yw4"
          frameborder="0"
          width="100%"
          height="100%"
          allowfullscreen
          style="aspect-ratio: 16/9"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

onMounted(() => {
  // Check if user is already authenticated
  const hasAccess = localStorage.getItem("whopAccess");
  if (hasAccess) {
    navigateTo("/");
  }
  
});

const loginWithWhop = () => {
  const clientId = config.public.WHOP_CLIENT_ID;
  const redirectUri = config.public.WHOP_REDIRECT_URI;

  const authUrl = `https://whop.com/oauth/?scope=openid+user&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  window.location.href = authUrl;
};
</script>

<style>
.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}
</style>
