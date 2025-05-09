<template>
    <div class="flex flex-col h-full">
      <!-- Chat Header -->
      <div class="bg-slate-800 p-4 rounded-t-lg border-b border-slate-700 flex items-center justify-between">
        <h3 class="text-lg font-medium text-yellow-gold-light">Property AI Assistant</h3>
        <button 
          @click="$emit('close')" 
          class="text-slate-400 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Chat Messages -->
      <div 
        ref="chatContainer" 
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900"
        :class="{ 'min-h-[300px]': messages.length === 0 }"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center text-slate-400 max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-yellow-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p class="font-medium mb-2">Ask me about this property</p>
            <p class="text-sm mb-4">I can answer questions about features, pricing, neighborhood, or investment potential.</p>
            <div class="grid grid-cols-1 gap-2 text-left">
              <button 
                v-for="(suggestion, i) in chatSuggestions" 
                :key="i"
                @click="sendMessage(suggestion)"
                class="bg-slate-800 hover:bg-slate-700 py-2 px-3 rounded-md text-sm text-left transition-colors text-yellow-gold-light"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Chat Messages -->
        <template v-for="(message, index) in messages" :key="index">
          <!-- User Message -->
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="bg-blue-700 text-white rounded-lg py-2 px-4 max-w-[80%]">
              <p class="whitespace-pre-wrap text-sm">{{ message.content }}</p>
            </div>
          </div>
          
          <!-- AI Message -->
          <div v-else class="flex justify-start">
            <div class="bg-slate-800 text-slate-100 rounded-lg py-2 px-4 max-w-[80%]">
              <p class="whitespace-pre-wrap text-sm" v-html="formatMessage(message.content)"></p>
            </div>
          </div>
        </template>
        
        <!-- Loading Indicator -->
        <div v-if="loading" class="flex justify-start">
          <div class="bg-slate-800 text-slate-100 rounded-lg py-2 px-4">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Input -->
      <div class="bg-slate-800 p-4 rounded-b-lg border-t border-slate-700">
        <form @submit.prevent="sendMessage()" class="flex space-x-2">
          <input
            v-model="userInput"
            type="text"
            placeholder="Ask about this property..."
            class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-yellow-gold-light focus:border-transparent"
            :disabled="loading"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-yellow-gold-light text-black font-medium rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !userInput.trim()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  
  const props = defineProps({
    property: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  // Chat state
  const userInput = ref('');
  const messages = ref([]);
  const loading = ref(false);
  const chatContainer = ref(null);
  const threadId = ref(null);
  
  // Suggested questions for the user
  const chatSuggestions = [
    "What are the best features of this property?",
    "Is this a good investment opportunity?",
    "Tell me about the neighborhood.",
    "What are the comparable properties in this area?",
    "What improvements could increase the value?"
  ];
  
  // Format the message content with simple markdown-like parsing
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Convert line breaks to <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // Bold text between ** **
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italics text between * *
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
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
    if (!messageContent || loading.value) return;
    
    // Add user message to the chat
    messages.value.push({
      role: 'user',
      content: messageContent
    });
    
    // Reset input field
    userInput.value = '';
    
    // Scroll to bottom to show new message
    scrollToBottom();
    
    // Show loading indicator
    loading.value = true;
    
    try {
      // Call the API with the threadId if it exists
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages.value,
          property: props.property,
          threadId: threadId.value
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.message) {
        // Store the threadId for future messages
        if (data.threadId) {
          threadId.value = data.threadId;
        }
        
        // Add AI response to chat
        messages.value.push({
          role: 'assistant',
          content: data.message.content
        });
      } else {
        // Handle API error
        messages.value.push({
          role: 'assistant',
          content: data.message || "I'm sorry, I encountered an error. Please try again."
        });
        console.error('AI Chat Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      messages.value.push({
        role: 'assistant',
        content: "I'm sorry, there was a problem connecting to the AI service. Please try again later."
      });
    } finally {
      loading.value = false;
      scrollToBottom();
    }
  };
  
  // Watch for changes in messages to scroll to bottom
  watch(messages, () => {
    scrollToBottom();
  });
  
  onMounted(() => {
    scrollToBottom();
  });
  </script>