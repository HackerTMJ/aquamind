/**
 * Validation utilities for AquaMind forms and data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Tank validation rules
 */
export const validateTank = (tank: {
  name?: string;
  type?: string;
  volume_liters?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
}): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!tank.name || tank.name.trim().length === 0) {
    errors.push('Tank name is required');
  } else if (tank.name.length > 50) {
    errors.push('Tank name must be less than 50 characters');
  }

  // Type validation
  const validTypes = ['freshwater', 'saltwater', 'brackish', 'pond'];
  if (!tank.type || !validTypes.includes(tank.type)) {
    errors.push('Please select a valid tank type');
  }

  // Volume validation
  if (tank.volume_liters !== undefined) {
    if (tank.volume_liters <= 0) {
      errors.push('Volume must be greater than 0');
    } else if (tank.volume_liters > 10000) {
      errors.push('Volume seems unusually large (max 10,000L)');
    }
  }

  // Dimension validation
  if (tank.length_cm !== undefined && tank.length_cm <= 0) {
    errors.push('Length must be greater than 0');
  }
  if (tank.width_cm !== undefined && tank.width_cm <= 0) {
    errors.push('Width must be greater than 0');
  }
  if (tank.height_cm !== undefined && tank.height_cm <= 0) {
    errors.push('Height must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Fish validation rules
 */
export const validateFish = (fish: {
  name?: string;
  species_id?: string;
  quantity?: number;
  size_cm?: number;
  age_months?: number;
}): ValidationResult => {
  const errors: string[] = [];

  // Name validation (optional but if provided should be valid)
  if (fish.name && fish.name.length > 30) {
    errors.push('Fish name must be less than 30 characters');
  }

  // Species validation
  if (!fish.species_id) {
    errors.push('Please select a fish species');
  }

  // Quantity validation
  if (fish.quantity !== undefined) {
    if (fish.quantity <= 0 || !Number.isInteger(fish.quantity)) {
      errors.push('Quantity must be a positive whole number');
    } else if (fish.quantity > 1000) {
      errors.push('Quantity seems unusually large (max 1,000)');
    }
  }

  // Size validation
  if (fish.size_cm !== undefined) {
    if (fish.size_cm <= 0) {
      errors.push('Size must be greater than 0');
    } else if (fish.size_cm > 500) {
      errors.push('Size seems unusually large (max 500cm)');
    }
  }

  // Age validation
  if (fish.age_months !== undefined) {
    if (fish.age_months < 0) {
      errors.push('Age cannot be negative');
    } else if (fish.age_months > 600) {
      errors.push('Age seems unusually large (max 600 months)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Water parameter validation
 */
export const validateWaterParameter = (
  parameter: string,
  value: number,
  tankType: string = 'freshwater'
): ValidationResult => {
  const errors: string[] = [];

  // Basic number validation
  if (isNaN(value) || !isFinite(value)) {
    errors.push('Please enter a valid number');
    return { isValid: false, errors };
  }

  // Parameter-specific validation
  switch (parameter) {
    case 'temperature_c':
      if (value < -5 || value > 50) {
        errors.push('Temperature must be between -5°C and 50°C');
      }
      break;

    case 'ph':
      if (value < 0 || value > 14) {
        errors.push('pH must be between 0 and 14');
      }
      break;

    case 'ammonia_ppm':
    case 'nitrite_ppm':
    case 'nitrate_ppm':
    case 'phosphate_ppm':
      if (value < 0) {
        errors.push('Concentration cannot be negative');
      } else if (value > 1000) {
        errors.push('Concentration seems unusually high (max 1000 ppm)');
      }
      break;

    case 'salinity_ppt':
      if (value < 0 || value > 50) {
        errors.push('Salinity must be between 0 and 50 ppt');
      }
      break;

    case 'hardness_dgh':
    case 'alkalinity_dkh':
      if (value < 0 || value > 50) {
        errors.push('Hardness must be between 0 and 50 degrees');
      }
      break;

    case 'dissolved_oxygen_ppm':
      if (value < 0 || value > 20) {
        errors.push('Dissolved oxygen must be between 0 and 20 ppm');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * User profile validation
 */
export const validateUserProfile = (profile: {
  email?: string;
  username?: string;
  full_name?: string;
  experience_level?: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Email validation
  if (!profile.email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Username validation
  if (profile.username) {
    if (profile.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (profile.username.length > 20) {
      errors.push('Username must be less than 20 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(profile.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  }

  // Full name validation
  if (profile.full_name && profile.full_name.length > 50) {
    errors.push('Full name must be less than 50 characters');
  }

  // Experience level validation
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (profile.experience_level && !validLevels.includes(profile.experience_level)) {
    errors.push('Please select a valid experience level');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generic required field validation
 */
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateTank,
  validateFish,
  validateWaterParameter,
  validateUserProfile,
  validatePassword,
  validateEmail,
  validateRequired,
};
