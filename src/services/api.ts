import { Property, SearchProperty } from '../types';
import { mockProperties, searchMockProperties } from '../data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch featured properties for the home page.
   */
  getFeaturedProperties: async (): Promise<Property[]> => {
    await delay(300);
    return mockProperties;
  },

  /**
   * Search for properties based on filters.
   */
  searchProperties: async (filters: any): Promise<SearchProperty[]> => {
    await delay(500);
    // TODO: implement real filtering logic when backend is connected
    // For now, return all mock properties
    return searchMockProperties;
  },

  /**
   * Get properties by their IDs (e.g., for saved properties list)
   */
  getPropertiesByIds: async (ids: string[]): Promise<SearchProperty[]> => {
    await delay(300);
    return searchMockProperties.filter(prop => ids.includes(prop.id.toString()));
  },

  /**
   * Save a property for the user.
   */
  saveProperty: async (propertyId: string): Promise<boolean> => {
    await delay(200);
    // TODO: Connect to backend
    return true;
  },

  /**
   * Remove a saved property.
   */
  removeSavedProperty: async (propertyId: string): Promise<boolean> => {
    await delay(200);
    // TODO: Connect to backend
    return true;
  },
  
  /**
   * Authenticate / Onboard user
   */
  authenticate: async (data: any): Promise<any> => {
    await delay(600);
    // TODO: backend sign-in / sign-up
    return { token: 'mock-token', user: data };
  }
};
