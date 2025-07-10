/**
 * Water parameter constants and ranges for AquaMind
 */

export interface ParameterRange {
  min: number;
  max: number;
  optimal_min: number;
  optimal_max: number;
  unit: string;
  description: string;
}

export interface TankTypeParameters {
  [key: string]: ParameterRange;
}

/**
 * Standard water parameter ranges by tank type
 */
export const WATER_PARAMETERS: Record<string, TankTypeParameters> = {
  freshwater: {
    temperature_c: {
      min: 18,
      max: 32,
      optimal_min: 22,
      optimal_max: 28,
      unit: '°C',
      description: 'Water temperature in Celsius',
    },
    ph: {
      min: 5.5,
      max: 9.0,
      optimal_min: 6.8,
      optimal_max: 7.8,
      unit: 'pH',
      description: 'pH level (acidity/alkalinity)',
    },
    ammonia_ppm: {
      min: 0,
      max: 0.5,
      optimal_min: 0,
      optimal_max: 0.02,
      unit: 'ppm',
      description: 'Ammonia concentration',
    },
    nitrite_ppm: {
      min: 0,
      max: 0.5,
      optimal_min: 0,
      optimal_max: 0.02,
      unit: 'ppm',
      description: 'Nitrite concentration',
    },
    nitrate_ppm: {
      min: 0,
      max: 100,
      optimal_min: 0,
      optimal_max: 20,
      unit: 'ppm',
      description: 'Nitrate concentration',
    },
    hardness_dgh: {
      min: 1,
      max: 30,
      optimal_min: 5,
      optimal_max: 15,
      unit: '°dGH',
      description: 'General hardness',
    },
    alkalinity_dkh: {
      min: 1,
      max: 20,
      optimal_min: 4,
      optimal_max: 8,
      unit: '°dKH',
      description: 'Carbonate hardness (alkalinity)',
    },
  },
  
  saltwater: {
    temperature_c: {
      min: 22,
      max: 30,
      optimal_min: 24,
      optimal_max: 27,
      unit: '°C',
      description: 'Water temperature in Celsius',
    },
    ph: {
      min: 7.8,
      max: 8.5,
      optimal_min: 8.0,
      optimal_max: 8.3,
      unit: 'pH',
      description: 'pH level (should be alkaline)',
    },
    salinity_ppt: {
      min: 30,
      max: 40,
      optimal_min: 34,
      optimal_max: 36,
      unit: 'ppt',
      description: 'Salinity in parts per thousand',
    },
    ammonia_ppm: {
      min: 0,
      max: 0.25,
      optimal_min: 0,
      optimal_max: 0.01,
      unit: 'ppm',
      description: 'Ammonia concentration',
    },
    nitrite_ppm: {
      min: 0,
      max: 0.25,
      optimal_min: 0,
      optimal_max: 0.01,
      unit: 'ppm',
      description: 'Nitrite concentration',
    },
    nitrate_ppm: {
      min: 0,
      max: 50,
      optimal_min: 0,
      optimal_max: 10,
      unit: 'ppm',
      description: 'Nitrate concentration',
    },
  },
  
  brackish: {
    temperature_c: {
      min: 20,
      max: 30,
      optimal_min: 22,
      optimal_max: 28,
      unit: '°C',
      description: 'Water temperature in Celsius',
    },
    ph: {
      min: 7.0,
      max: 8.5,
      optimal_min: 7.5,
      optimal_max: 8.2,
      unit: 'pH',
      description: 'pH level (slightly alkaline)',
    },
    salinity_ppt: {
      min: 5,
      max: 25,
      optimal_min: 10,
      optimal_max: 20,
      unit: 'ppt',
      description: 'Salinity in parts per thousand',
    },
    ammonia_ppm: {
      min: 0,
      max: 0.3,
      optimal_min: 0,
      optimal_max: 0.02,
      unit: 'ppm',
      description: 'Ammonia concentration',
    },
    nitrite_ppm: {
      min: 0,
      max: 0.3,
      optimal_min: 0,
      optimal_max: 0.02,
      unit: 'ppm',
      description: 'Nitrite concentration',
    },
    nitrate_ppm: {
      min: 0,
      max: 40,
      optimal_min: 0,
      optimal_max: 15,
      unit: 'ppm',
      description: 'Nitrate concentration',
    },
  },
};

/**
 * Parameter testing frequency recommendations (in days)
 */
export const TESTING_FREQUENCY = {
  daily: ['temperature_c'],
  weekly: ['ph', 'ammonia_ppm', 'nitrite_ppm'],
  biweekly: ['nitrate_ppm', 'hardness_dgh', 'alkalinity_dkh'],
  monthly: ['phosphate_ppm', 'salinity_ppt'],
};

/**
 * Critical parameter thresholds that require immediate attention
 */
export const CRITICAL_THRESHOLDS = {
  ammonia_ppm: 0.5,
  nitrite_ppm: 0.5,
  nitrate_ppm: 100,
  ph_low: 6.0,
  ph_high: 9.0,
  temperature_low: 15,
  temperature_high: 35,
};

/**
 * Parameter status evaluation
 */
export function getParameterStatus(
  value: number,
  parameter: ParameterRange
): 'optimal' | 'acceptable' | 'caution' | 'danger' {
  if (value >= parameter.optimal_min && value <= parameter.optimal_max) {
    return 'optimal';
  }
  
  if (value >= parameter.min && value <= parameter.max) {
    return 'acceptable';
  }
  
  // Outside acceptable range but not critically dangerous
  const tolerance = (parameter.max - parameter.min) * 0.1;
  if (value >= parameter.min - tolerance && value <= parameter.max + tolerance) {
    return 'caution';
  }
  
  return 'danger';
}

/**
 * Convert between temperature units
 */
export const temperatureUtils = {
  celsiusToFahrenheit: (celsius: number): number => (celsius * 9/5) + 32,
  fahrenheitToCelsius: (fahrenheit: number): number => (fahrenheit - 32) * 5/9,
};

export default WATER_PARAMETERS;
