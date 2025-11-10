/**
 * Game configuration
 */

/**
 * Server configuration interface
 */
export interface ServerConfig {
  host: string;
  port: number;
  dispatcher: boolean;
}

/**
 * Configuration object
 */
export interface GameConfig {
  dev: ServerConfig;
  build: ServerConfig;
  local?: ServerConfig;
}

/**
 * Default development configuration
 */
const devConfig: ServerConfig = {
  host: 'localhost',
  port: 8000,
  dispatcher: false,
};

/**
 * Build configuration
 * In production, this will be loaded from config_build.json
 */
const buildConfig: ServerConfig = {
  host: 'localhost',
  port: 8000,
  dispatcher: false,
};

/**
 * Main configuration object
 */
export const config: GameConfig = {
  dev: devConfig,
  build: buildConfig,
};

/**
 * Load local configuration if available
 * This is async and will update the config object when complete
 */
export async function loadLocalConfig(): Promise<void> {
  try {
    const response = await fetch('../config/config_local.json');
    if (response.ok) {
      const localConfig = await response.json();
      config.local = localConfig;
    }
  } catch (e) {
    // Local config is optional, no action needed
  }
}

/**
 * Load build configuration
 * This is async and will update the config object when complete
 */
export async function loadBuildConfig(): Promise<void> {
  try {
    const response = await fetch('../config/config_build.json');
    if (response.ok) {
      const buildConfigData = await response.json();
      config.build = buildConfigData;
    }
  } catch (e) {
    console.warn('Could not load build config, using defaults');
  }
}

export default config;
