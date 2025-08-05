<script setup lang="ts">
import { useAppStore } from '../stores/app'

const store = useAppStore()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">Payload Sender</h2>
    
    <div class="space-y-6">
      <!-- Payload 1 Section -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Step 1: Send First Payload</h3>
        
        <div v-if="!store.payload1" class="space-y-3">
          <p class="text-gray-600">
            Click the button below to send the first JSON payload to the backend.
          </p>
          <button
            @click="store.sendPayload1"
            :disabled="store.loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span v-if="store.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Payload 1</span>
          </button>
        </div>
        
        <div v-else class="space-y-3">
          <div class="flex items-center text-green-600">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">Payload 1 sent successfully!</span>
          </div>
          <div class="text-sm text-gray-600">
            <p><strong>ID:</strong> {{ store.payload1.id }}</p>
            <p><strong>Received at:</strong> {{ new Date(store.payload1.received_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Countdown Section -->
      <div v-if="store.payload1 && !store.payload2" class="border-l-4 border-yellow-500 pl-4">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Step 2: Automatic Payload 2</h3>
        
        <div class="space-y-3">
          <p class="text-gray-600">
            The second payload will be sent automatically in:
          </p>
          <div class="flex items-center space-x-2">
            <div class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-mono text-lg">
              {{ store.countdown }} seconds
            </div>
            <div class="text-sm text-gray-500">
              (This simulates a webhook delay)
            </div>
          </div>
        </div>
      </div>

      <!-- Payload 2 Section -->
      <div v-if="store.payload2" class="border-l-4 border-green-500 pl-4">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Step 2: Second Payload</h3>
        
        <div class="space-y-3">
          <div class="flex items-center text-green-600">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">Payload 2 sent successfully!</span>
          </div>
          <div class="text-sm text-gray-600">
            <p><strong>ID:</strong> {{ store.payload2.id }}</p>
            <p><strong>Received at:</strong> {{ new Date(store.payload2.received_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
