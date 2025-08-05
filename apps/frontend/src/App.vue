<script setup lang="ts">
import ComparisonResult from './components/ComparisonResult.vue'
import ErrorAlert from './components/ErrorAlert.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import PayloadSender from './components/PayloadSender.vue'
import { useAppStore } from './stores/app'

const store = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Syncio Assessment
        </h1>
        <p class="text-lg text-gray-600">
          JSON Payload Comparison Tool
        </p>
      </header>

      <!-- Error Alert -->
      <ErrorAlert v-if="store.error" :message="store.error" @dismiss="store.error = null" />

      <!-- Loading Spinner -->
      <LoadingSpinner v-if="store.loading" />

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto">
        <!-- Payload Sender Section -->
        <div v-if="store.isPayloadPhase" class="space-y-6">
          <PayloadSender />
        </div>

        <!-- Comparison Results Section -->
        <div v-else-if="store.isComparisonPhase && store.hasComparison" class="space-y-6">
          <ComparisonResult :comparison="store.comparison!" />
        </div>

        <!-- Waiting for Comparison -->
        <div v-else-if="store.isComparisonPhase && !store.hasComparison" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-md">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-yellow-800">Comparing payloads...</span>
          </div>
        </div>
      </div>

      <!-- Reset Button -->
      <div v-if="store.hasComparison" class="text-center mt-8">
        <button
          @click="store.reset"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  </div>
</template>
