// server/middleware/realEstateApi.js
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Only handle API routes
  if (!event.path.startsWith('/api/real-estate')) {
    return
  }

  try {
    // Extract the API route from the path
    const route = event.path.replace('/api/real-estate/', '')
    const body = await readBody(event)
    const config = useRuntimeConfig()
    
    // Get the API keys from server runtime config
    const apiKey = config.realEstateApiKey
    const userId = config.realEstateUserId || 'UniqueUserIdentifier' // Default value or from config
    
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API key is not configured'
      })
    }

    // Make the request to the Real Estate API with BOTH headers
    const response = await fetch(`https://api.realestateapi.com/v2/${route}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey,  // This is the API key
        'x-user-id': userId   // This is the user identifier
      },
      body: JSON.stringify(body)
    })

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.text()
      throw createError({
        statusCode: response.status,
        statusMessage: errorData || `API request failed with status: ${response.status}`
      })
    }

    // Return the response data
    return await response.json()
  } catch (error) {
    console.error('Real Estate API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal Server Error'
    })
  }
})