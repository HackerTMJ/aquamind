// Database layer using AsyncStorage for local persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tank interface for the application
export interface Tank {
  id: string;
  name: string;
  sizeliters: number;
  tankType: string;
  photoUrl?: string;
  description?: string;
  setupDate: Date;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  displaySize: string;
  typeDisplayName: string;
  isNew: boolean;
}

// WaterParameter interface for the application
export interface WaterParameter {
  id: string;
  tankId: string;
  parameterType: string;
  value: number;
  unit: string;
  testedDate: Date;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  displayValue: string;
  parameterDisplayName: string;
  isWithinRange: boolean;
  statusColor: string;
}

// Internal data format for storage
interface TankData {
  id: string;
  name: string;
  sizeliters: number;
  tankType: string;
  photoUrl?: string;
  description?: string;
  setupDate: string; // stored as ISO string
  isActive: boolean;
  userId: string;
  createdAt: string; // stored as ISO string
  updatedAt: string; // stored as ISO string
}

// Tank service using AsyncStorage
export const tankService = {
  // Convert stored data to Tank interface
  convertToTank(data: TankData): Tank {
    const setupDate = new Date(data.setupDate);
    const createdAt = new Date(data.createdAt);
    const updatedAt = new Date(data.updatedAt);

    return {
      id: data.id,
      name: data.name,
      sizeliters: data.sizeliters,
      tankType: data.tankType,
      photoUrl: data.photoUrl,
      description: data.description,
      setupDate,
      isActive: data.isActive,
      userId: data.userId,
      createdAt,
      updatedAt,
      displaySize: `${data.sizeliters}L`,
      typeDisplayName: data.tankType.charAt(0).toUpperCase() + data.tankType.slice(1),
      isNew: Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  },

  // Convert Tank to storage format
  convertToData(tank: Tank): TankData {
    return {
      id: tank.id,
      name: tank.name,
      sizeliters: tank.sizeliters,
      tankType: tank.tankType,
      photoUrl: tank.photoUrl,
      description: tank.description,
      setupDate: tank.setupDate.toISOString(),
      isActive: tank.isActive,
      userId: tank.userId,
      createdAt: tank.createdAt.toISOString(),
      updatedAt: tank.updatedAt.toISOString(),
    };
  },

  async getAllTanks(userId: string): Promise<Tank[]> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_tanks');
      if (!stored) return [];

      const tankDataList: TankData[] = JSON.parse(stored);
      return tankDataList
        .filter(tank => tank.userId === userId)
        .map(data => this.convertToTank(data));
    } catch (error) {
      console.error('Error loading tanks:', error);
      return [];
    }
  },

  async getTankById(id: string): Promise<Tank | undefined> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_tanks');
      if (!stored) return undefined;

      const tankDataList: TankData[] = JSON.parse(stored);
      const tankData = tankDataList.find(tank => tank.id === id);
      return tankData ? this.convertToTank(tankData) : undefined;
    } catch (error) {
      console.error('Error loading tank:', error);
      return undefined;
    }
  },

  async createTank(tankInfo: {
    name: string;
    sizeliters: number;
    tankType: string;
    photoUrl?: string;
    description?: string;
    setupDate: Date;
    userId: string;
  }): Promise<Tank> {
    try {
      const now = new Date();
      const tank: Tank = {
        id: Date.now().toString(),
        name: tankInfo.name,
        sizeliters: tankInfo.sizeliters,
        tankType: tankInfo.tankType,
        photoUrl: tankInfo.photoUrl,
        description: tankInfo.description,
        setupDate: tankInfo.setupDate,
        isActive: true,
        userId: tankInfo.userId,
        createdAt: now,
        updatedAt: now,
        displaySize: `${tankInfo.sizeliters}L`,
        typeDisplayName: tankInfo.tankType.charAt(0).toUpperCase() + tankInfo.tankType.slice(1),
        isNew: true,
      };

      // Get existing tanks
      const stored = await AsyncStorage.getItem('aquamind_tanks');
      const tankDataList: TankData[] = stored ? JSON.parse(stored) : [];

      // Add new tank
      tankDataList.push(this.convertToData(tank));

      // Save back to storage
      await AsyncStorage.setItem('aquamind_tanks', JSON.stringify(tankDataList));

      return tank;
    } catch (error) {
      console.error('Error creating tank:', error);
      throw error;
    }
  },

  async updateTank(tank: Tank, updates: Partial<Tank>): Promise<Tank> {
    try {
      const updatedTank: Tank = {
        ...tank,
        ...updates,
        updatedAt: new Date(),
      };

      // Recalculate computed properties
      updatedTank.displaySize = `${updatedTank.sizeliters}L`;
      updatedTank.typeDisplayName =
        updatedTank.tankType.charAt(0).toUpperCase() + updatedTank.tankType.slice(1);
      updatedTank.isNew = Date.now() - updatedTank.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

      // Get existing tanks
      const stored = await AsyncStorage.getItem('aquamind_tanks');
      const tankDataList: TankData[] = stored ? JSON.parse(stored) : [];

      // Find and update the tank
      const index = tankDataList.findIndex(t => t.id === tank.id);
      if (index !== -1) {
        tankDataList[index] = this.convertToData(updatedTank);
        await AsyncStorage.setItem('aquamind_tanks', JSON.stringify(tankDataList));
      }

      return updatedTank;
    } catch (error) {
      console.error('Error updating tank:', error);
      throw error;
    }
  },

  async deleteTank(tank: Tank): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_tanks');
      if (!stored) return;

      const tankDataList: TankData[] = JSON.parse(stored);
      const filtered = tankDataList.filter(t => t.id !== tank.id);

      await AsyncStorage.setItem('aquamind_tanks', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting tank:', error);
      throw error;
    }
  },

  // Clear all tank data (useful for debugging)
  async clearAllTanks(): Promise<void> {
    try {
      await AsyncStorage.removeItem('aquamind_tanks');
    } catch (error) {
      console.error('Error clearing tanks:', error);
      throw error;
    }
  },
};

// Internal data format for water parameter storage
interface WaterParameterData {
  id: string;
  tankId: string;
  parameterType: string;
  value: number;
  unit: string;
  testedDate: string; // stored as ISO string
  notes?: string;
  userId: string;
  createdAt: string; // stored as ISO string
  updatedAt: string; // stored as ISO string
}

// Water parameter validation ranges
const PARAMETER_RANGES = {
  ph: { min: 6.0, max: 8.5, unit: '', optimal: { min: 6.8, max: 7.8 } },
  ammonia: { min: 0, max: 0.25, unit: 'ppm', optimal: { min: 0, max: 0.02 } },
  nitrite: { min: 0, max: 0.25, unit: 'ppm', optimal: { min: 0, max: 0.02 } },
  nitrate: { min: 0, max: 40, unit: 'ppm', optimal: { min: 0, max: 20 } },
  temperature: { min: 18, max: 32, unit: '°C', optimal: { min: 22, max: 28 } },
  oxygen: { min: 5, max: 15, unit: 'mg/L', optimal: { min: 7, max: 10 } },
  hardness: { min: 0, max: 30, unit: 'dGH', optimal: { min: 5, max: 15 } },
  alkalinity: { min: 0, max: 20, unit: 'dKH', optimal: { min: 3, max: 8 } },
} as const;

// Water parameter service with full AsyncStorage implementation
export const waterParameterService = {
  // Convert stored data to WaterParameter interface
  convertToWaterParameter(data: WaterParameterData): WaterParameter {
    const testedDate = new Date(data.testedDate);
    const createdAt = new Date(data.createdAt);
    const updatedAt = new Date(data.updatedAt);

    const range = PARAMETER_RANGES[data.parameterType as keyof typeof PARAMETER_RANGES];
    const isWithinRange = range ? data.value >= range.min && data.value <= range.max : true;

    let statusColor = '#4CAF50'; // green - good
    if (range) {
      if (data.value < range.min || data.value > range.max) {
        statusColor = '#F44336'; // red - danger
      } else if (data.value < range.optimal.min || data.value > range.optimal.max) {
        statusColor = '#FF9800'; // orange - warning
      }
    }

    return {
      id: data.id,
      tankId: data.tankId,
      parameterType: data.parameterType,
      value: data.value,
      unit: data.unit,
      testedDate,
      notes: data.notes || '',
      userId: data.userId,
      createdAt,
      updatedAt,
      displayValue: `${data.value}${data.unit}`,
      parameterDisplayName:
        data.parameterType.charAt(0).toUpperCase() + data.parameterType.slice(1),
      isWithinRange,
      statusColor,
    };
  },

  // Convert WaterParameter to storage format
  convertToData(parameter: WaterParameter): WaterParameterData {
    return {
      id: parameter.id,
      tankId: parameter.tankId,
      parameterType: parameter.parameterType,
      value: parameter.value,
      unit: parameter.unit,
      testedDate: parameter.testedDate.toISOString(),
      notes: parameter.notes,
      userId: parameter.userId,
      createdAt: parameter.createdAt.toISOString(),
      updatedAt: parameter.updatedAt.toISOString(),
    };
  },

  async createParameter(data: {
    tankId: string;
    parameterType: string;
    value: number;
    unit: string;
    testedDate: Date;
    notes?: string;
    userId: string;
  }): Promise<WaterParameter> {
    try {
      const now = new Date();
      const parameter: WaterParameter = {
        id: Date.now().toString(),
        tankId: data.tankId,
        parameterType: data.parameterType,
        value: data.value,
        unit: data.unit,
        testedDate: data.testedDate,
        notes: data.notes || '',
        userId: data.userId,
        createdAt: now,
        updatedAt: now,
        displayValue: `${data.value}${data.unit}`,
        parameterDisplayName:
          data.parameterType.charAt(0).toUpperCase() + data.parameterType.slice(1),
        isWithinRange: true,
        statusColor: '#4CAF50',
      };

      // Apply validation and status calculation
      const processedParameter = this.convertToWaterParameter(this.convertToData(parameter));

      // Get existing parameters
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      const parameterDataList: WaterParameterData[] = stored ? JSON.parse(stored) : [];

      // Add new parameter
      parameterDataList.push(this.convertToData(processedParameter));

      // Save back to storage
      await AsyncStorage.setItem('aquamind_water_parameters', JSON.stringify(parameterDataList));

      return processedParameter;
    } catch (error) {
      console.error('Error creating water parameter:', error);
      throw error;
    }
  },

  async getParametersForTank(tankId: string): Promise<WaterParameter[]> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      if (!stored) return [];

      const parameterDataList: WaterParameterData[] = JSON.parse(stored);
      return parameterDataList
        .filter(param => param.tankId === tankId)
        .map(data => this.convertToWaterParameter(data))
        .sort((a, b) => b.testedDate.getTime() - a.testedDate.getTime()); // newest first
    } catch (error) {
      console.error('Error loading water parameters:', error);
      return [];
    }
  },

  async getLatestParameterByType(
    tankId: string,
    parameterType: string
  ): Promise<WaterParameter | undefined> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      if (!stored) return undefined;

      const parameterDataList: WaterParameterData[] = JSON.parse(stored);
      const filteredParams = parameterDataList
        .filter(param => param.tankId === tankId && param.parameterType === parameterType)
        .sort((a, b) => new Date(b.testedDate).getTime() - new Date(a.testedDate).getTime());

      if (filteredParams.length === 0) return undefined;
      return this.convertToWaterParameter(filteredParams[0]);
    } catch (error) {
      console.error('Error loading latest parameter:', error);
      return undefined;
    }
  },

  async getAllParametersForUser(userId: string): Promise<WaterParameter[]> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      if (!stored) return [];

      const parameterDataList: WaterParameterData[] = JSON.parse(stored);
      return parameterDataList
        .filter(param => param.userId === userId)
        .map(data => this.convertToWaterParameter(data))
        .sort((a, b) => b.testedDate.getTime() - a.testedDate.getTime());
    } catch (error) {
      console.error('Error loading user parameters:', error);
      return [];
    }
  },

  async updateParameter(
    parameter: WaterParameter,
    updates: Partial<WaterParameter>
  ): Promise<WaterParameter> {
    try {
      const updatedParameter: WaterParameter = {
        ...parameter,
        ...updates,
        updatedAt: new Date(),
      };

      // Reprocess with validation
      const processedParameter = this.convertToWaterParameter(this.convertToData(updatedParameter));

      // Get existing parameters
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      const parameterDataList: WaterParameterData[] = stored ? JSON.parse(stored) : [];

      // Find and update the parameter
      const index = parameterDataList.findIndex(p => p.id === parameter.id);
      if (index !== -1) {
        parameterDataList[index] = this.convertToData(processedParameter);
        await AsyncStorage.setItem('aquamind_water_parameters', JSON.stringify(parameterDataList));
      }

      return processedParameter;
    } catch (error) {
      console.error('Error updating water parameter:', error);
      throw error;
    }
  },

  async deleteParameter(parameter: WaterParameter): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('aquamind_water_parameters');
      if (!stored) return;

      const parameterDataList: WaterParameterData[] = JSON.parse(stored);
      const filtered = parameterDataList.filter(p => p.id !== parameter.id);

      await AsyncStorage.setItem('aquamind_water_parameters', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting water parameter:', error);
      throw error;
    }
  },

  // Get parameter validation info
  getParameterRange(parameterType: string) {
    return PARAMETER_RANGES[parameterType as keyof typeof PARAMETER_RANGES];
  },

  // Get available parameter types
  getParameterTypes() {
    return Object.keys(PARAMETER_RANGES);
  },

  // Clear all parameter data (useful for debugging)
  async clearAllParameters(): Promise<void> {
    try {
      await AsyncStorage.removeItem('aquamind_water_parameters');
    } catch (error) {
      console.error('Error clearing water parameters:', error);
      throw error;
    }
  },
};
