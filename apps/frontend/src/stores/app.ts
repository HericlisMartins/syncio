import axios from 'axios'
import { defineStore } from 'pinia'

import type {
  ApiResponse,
  AppState,
  ComparisonResult,
  PayloadResponse,
  Product,
} from '@syncio/shared-types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    payload1: null,
    payload2: null,
    comparison: null,
    loading: false,
    error: null,
    countdown: 30,
  }),

  getters: {
    bothPayloadsReceived: (state) => !!state.payload1 && !!state.payload2,
    hasComparison: (state) => !!state.comparison,
    isPayloadPhase: (state) => !state.payload1 || !state.payload2,
    isComparisonPhase: (state) => !!state.payload1 && !!state.payload2,
  },

  actions: {
    async sendPayload1() {
      this.loading = true
      this.error = null

      try {
        // Fetch the first payload from the assessment URL
        const payloadData = await this.fetchPayloadData(1)

        const response = await axios.post<ApiResponse<PayloadResponse>>(
          `${API_BASE_URL}/payloads/1`,
          { payload: payloadData },
        )

        if (response.data.success && response.data.data) {
          this.payload1 = response.data.data
          this.startCountdown()
        } else {
          throw new Error(response.data.message || 'Failed to send payload 1')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred'
      } finally {
        this.loading = false
      }
    },

    async sendPayload2() {
      this.loading = true
      this.error = null

      try {
        // Fetch the second payload from the assessment URL
        const payloadData = await this.fetchPayloadData(2)

        const response = await axios.post<ApiResponse<PayloadResponse>>(
          `${API_BASE_URL}/payloads/2`,
          { payload: payloadData },
        )

        if (response.data.success && response.data.data) {
          this.payload2 = response.data.data
          await this.comparePayloads()
        } else {
          throw new Error(response.data.message || 'Failed to send payload 2')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred'
      } finally {
        this.loading = false
      }
    },

    async comparePayloads() {
      if (!this.payload1 || !this.payload2) return

      this.loading = true
      this.error = null

      try {
        const response = await axios.post<ApiResponse<ComparisonResult>>(
          `${API_BASE_URL}/compare`,
          {
            payload1_id: this.payload1.id,
            payload2_id: this.payload2.id,
          },
        )

        if (response.data.success && response.data.data) {
          this.comparison = response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to compare payloads')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred'
      } finally {
        this.loading = false
      }
    },

    async fetchPayloadData(payloadNumber: 1 | 2): Promise<Product> {
      // This would normally fetch from the assessment URL
      // For now, using mock data that matches the assessment structure
      const mockData: Product = {
        id: `product_${payloadNumber}`,
        title: `Sample Product ${payloadNumber}`,
        body_html: `<p>Description for product ${payloadNumber}</p>`,
        vendor: 'Syncio',
        product_type: 'Electronics',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        tags: 'sample,test,product',
        status: 'active',
        published_scope: 'web',
        admin_graphql_api_id: `gid://shopify/Product/${payloadNumber}`,
        images: [
          {
            id: `img_${payloadNumber}_1`,
            url: `https://example.com/image${payloadNumber}_1.jpg`,
            position: 1,
            alt: `Product ${payloadNumber} Image 1`,
          },
        ],
        image: {
          id: `img_${payloadNumber}_1`,
          url: `https://example.com/image${payloadNumber}_1.jpg`,
          position: 1,
          alt: `Product ${payloadNumber} Image 1`,
        },
        variants: [
          {
            id: `var_${payloadNumber}_1`,
            sku: `SKU${payloadNumber}001`,
            barcode: `123456789${payloadNumber}`,
            price: payloadNumber === 1 ? 99.99 : 109.99,
            inventory_quantity: payloadNumber === 1 ? 10 : 8,
            title: `Variant ${payloadNumber}`,
            weight: 500,
            grams: 500,
            image_id: `img_${payloadNumber}_1`,
          },
        ],
        options: [
          {
            id: `opt_${payloadNumber}_1`,
            name: 'Size',
            position: 1,
            values: ['Small', 'Medium', 'Large'],
          },
        ],
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockData
    },

    startCountdown() {
      this.countdown = 30
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.sendPayload2()
        }
      }, 1000)
    },

    reset() {
      this.payload1 = null
      this.payload2 = null
      this.comparison = null
      this.loading = false
      this.error = null
      this.countdown = 30
    },
  },
})
