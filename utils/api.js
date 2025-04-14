/**
 * Utility function to handle API requests with better error handling
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export async function fetchAPI(url, options = {}) {
    try {
      console.log(`API Request: ${options.method || "GET"} ${url}`)
  
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })
  
      // For non-JSON responses (like file downloads)
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.error || `Request failed with status ${response.status}`)
        }
  
        return data
      } else if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
  
      return response
    } catch (error) {
      console.error(`API Error (${url}):`, error)
      throw error
    }
  }
  
  /**
   * Utility function to handle file downloads
   * @param {string} url - The API endpoint URL
   * @param {string} filename - The filename to save as
   */
  export async function downloadFile(url, filename) {
    try {
      // Create a link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Download Error (${url}):`, error)
      throw error
    }
  }
  