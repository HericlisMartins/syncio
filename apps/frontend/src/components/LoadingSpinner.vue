<script setup lang="ts">
// Simple loading spinner component
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div class="relative">
      <!-- Outer rotating circle -->
      <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      
      <!-- Inner pulsing dot -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</template>
