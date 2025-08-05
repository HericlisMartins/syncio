<script setup lang="ts">
import type {
  ComparisonResult,
  DiffResult,
} from '@/types'

interface Props {
  comparison: ComparisonResult
}

defineProps<Props>()

const getDiffIcon = (type: DiffResult['type']) => {
  switch (type) {
    case 'added':
      return '+'
    case 'removed':
      return '-'
    case 'modified':
      return '~'
    default:
      return '='
  }
}

const getDiffColor = (type: DiffResult['type']) => {
  switch (type) {
    case 'added':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'removed':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'modified':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Comparison Results</h2>
      
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ comparison.differences.length }}
          </div>
          <div class="text-sm text-blue-800">Total Changes</div>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ comparison.summary.added }}
          </div>
          <div class="text-sm text-green-800">Added</div>
        </div>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-red-600">
            {{ comparison.summary.removed }}
          </div>
          <div class="text-sm text-red-800">Removed</div>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600">
            {{ comparison.summary.modified }}
          </div>
          <div class="text-sm text-yellow-800">Modified</div>
        </div>
      </div>

      <!-- No Changes -->
      <div v-if="!comparison.hasChanges" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No Differences Found</h3>
        <p class="mt-1 text-gray-500">The two payloads are identical.</p>
      </div>
    </div>

    <!-- Differences List -->
    <div v-if="comparison.hasChanges" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Detailed Changes</h3>
      
      <div class="space-y-3">
        <div
          v-for="(diff, index) in comparison.differences"
          :key="index"
          :class="['border rounded-lg p-4', getDiffColor(diff.type)]"
        >
          <div class="flex items-start space-x-3">
            <!-- Diff Icon -->
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 font-mono font-bold">
                {{ getDiffIcon(diff.type) }}
              </span>
            </div>
            
            <!-- Diff Content -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium mb-2">
                <span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  {{ diff.path }}
                </span>
              </div>
              
              <p class="text-sm mb-3">{{ diff.message }}</p>
              
              <!-- Value Changes -->
              <div v-if="diff.type === 'modified'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-xs font-medium text-gray-700 mb-1">Old Value:</div>
                  <pre class="text-xs bg-white border rounded p-2 overflow-auto max-h-32">{{ formatValue(diff.oldValue) }}</pre>
                </div>
                <div>
                  <div class="text-xs font-medium text-gray-700 mb-1">New Value:</div>
                  <pre class="text-xs bg-white border rounded p-2 overflow-auto max-h-32">{{ formatValue(diff.newValue) }}</pre>
                </div>
              </div>
              
              <div v-else-if="diff.type === 'added'">
                <div class="text-xs font-medium text-gray-700 mb-1">Added Value:</div>
                <pre class="text-xs bg-white border rounded p-2 overflow-auto max-h-32">{{ formatValue(diff.newValue) }}</pre>
              </div>
              
              <div v-else-if="diff.type === 'removed'">
                <div class="text-xs font-medium text-gray-700 mb-1">Removed Value:</div>
                <pre class="text-xs bg-white border rounded p-2 overflow-auto max-h-32">{{ formatValue(diff.oldValue) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
