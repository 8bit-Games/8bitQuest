/**
 * Browser and device detection utilities
 */

/**
 * Augment Window interface for WebSocket compatibility
 */
declare global {
  interface Window {
    WebSocket?: typeof WebSocket;
    MozWebSocket?: typeof WebSocket;
  }
}

/**
 * Detect object containing browser/device detection functions
 */
export const Detect = {
  /**
   * Check if WebSocket is supported
   * @returns true if WebSocket is available
   */
  supportsWebSocket(): boolean {
    return !!(window.WebSocket || window.MozWebSocket);
  },

  /**
   * Check if user agent contains a specific string
   * @param string - String to search for
   * @returns true if found
   */
  userAgentContains(string: string): boolean {
    return navigator.userAgent.indexOf(string) !== -1;
  },

  /**
   * Detect if device is a tablet
   * @param screenWidth - Screen width in pixels
   * @returns true if tablet device
   */
  isTablet(screenWidth: number): boolean {
    if (screenWidth > 640) {
      if (
        (this.userAgentContains('Android') && this.userAgentContains('Firefox')) ||
        this.userAgentContains('Mobile')
      ) {
        return true;
      }
    }
    return false;
  },

  /**
   * Check if running on Windows
   * @returns true if Windows OS
   */
  isWindows(): boolean {
    return this.userAgentContains('Windows');
  },

  /**
   * Check if running Chrome on Windows
   * @returns true if Chrome on Windows
   */
  isChromeOnWindows(): boolean {
    return this.userAgentContains('Chrome') && this.userAgentContains('Windows');
  },

  /**
   * Check if browser can play MP3 audio
   * @returns true if MP3 is supported
   */
  canPlayMP3(): boolean {
    const audio = document.createElement('audio');
    return !!(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, ''));
  },

  /**
   * Check if browser is Safari
   * @returns true if Safari (not Chrome)
   */
  isSafari(): boolean {
    return this.userAgentContains('Safari') && !this.userAgentContains('Chrome');
  },

  /**
   * Check if browser is Opera
   * @returns true if Opera
   */
  isOpera(): boolean {
    return this.userAgentContains('Opera');
  },
};

export default Detect;
