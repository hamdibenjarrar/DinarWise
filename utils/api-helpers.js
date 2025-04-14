/**
 * Safely parse a JSON response, handling the "body stream already read" error
 * @param {Response} response - The fetch response object
 * @returns {Promise<Object>} - The parsed JSON or an error object
 */
export async function safelyParseJSON(response) {
    try {
      // Clone the response before reading it to avoid "body stream already read" errors
      const clonedResponse = response.clone()
  
      try {
        return await response.json()
      } catch (error) {
        console.warn("Error parsing JSON, trying text instead:", error)
  
        try {
          const text = await clonedResponse.text()
  
          // Try to parse the text as JSON
          try {
            return JSON.parse(text)
          } catch (e) {
            // If it's not valid JSON, return it as a message
            return { message: text, error: "Response was not valid JSON" }
          }
        } catch (textError) {
          console.error("Error reading response as text:", textError)
          return { error: "Failed to read response" }
        }
      }
    } catch (error) {
      console.error("Fatal error handling response:", error)
      return { error: "Fatal error handling response" }
    }
  }
  
  /**
   * Safely handle a fetch request with proper error handling
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - The response data or error
   */
  export async function safeFetch(url, options = {}) {
    try {
      // Add a timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
  
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
  
      clearTimeout(timeoutId)
  
      // Check if the request was successful
      if (!response.ok) {
        const errorData = await safelyParseJSON(response)
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }
  
      // For non-JSON responses (like file downloads)
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await safelyParseJSON(response)
      } else {
        return { response }
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      throw error
    }
  }
  
  /**
   * Handle file downloads from API
   * @param {string} url - The URL to download from
   * @param {string} filename - The filename to save as
   */
  export async function downloadFile(url, filename) {
    try {
      // Use window.open for direct downloads instead of fetch
      window.open(url, "_blank")
    } catch (error) {
      console.error(`Error downloading from ${url}:`, error)
      throw error
    }
  }
  