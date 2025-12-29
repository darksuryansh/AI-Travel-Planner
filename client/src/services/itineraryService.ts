/**

  - Generate AI itinerary
  - Get all user's itineraries
  - Get single itinerary
  - Create manual itinerary
  - Update itinerary
  - Delete itinerary

 */

import api from './api';
import {
  Itinerary,
  GenerateItineraryRequest,
  GenerateItineraryResponse,
  ItinerariesResponse,
  CreateItineraryRequest,
  UpdateItineraryRequest,
  ApiResponse,
} from '../types/api';




export const generateItinerary = async (
  params: GenerateItineraryRequest
): Promise<{ itinerary: Itinerary; saved: boolean; itineraryId?: string }> => {
  try {
    console.log('🤖 Generating AI itinerary for:', params.destination);
    console.log('📤 Request params:', params);
    
    const response = await api.post<GenerateItineraryResponse>(
      '/generate-itinerary',
      params
    );
    
    console.log('✅ Received response:', response.data);
    
    const { data, saved, itineraryId } = response.data;
    
    if (saved && itineraryId) {
      console.log('✅ Itinerary generated and saved with ID:', itineraryId);
    } else {
      console.log('ℹ️ Itinerary generated (not saved - user not logged in)');
    }
    
    return { itinerary: data, saved, itineraryId };
    
  } catch (error: any) {
    console.error('❌ Error generating itinerary:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error response:', error.response?.data);
    
    // Provide more specific error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - AI generation is taking too long. Please try again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error - AI service may be unavailable. Please try again later.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message.includes('Network Error')) {
      throw new Error('Network error - Please check your internet connection and ensure the server is running.');
    }
    
    throw new Error(error.message || 'Failed to generate itinerary');
  }
};



export const getAllItineraries = async (
  limit = 20,
  offset = 0
): Promise<Itinerary[]> => {
  try {
    console.log(' Fetching all itineraries...');
    
    // GET request with query parameters
    const response = await api.get<ItinerariesResponse>('/itineraries', {
      params: { limit, offset }
    });
    
    console.log(' Fetched', response.data.count, 'itineraries');
    
    return response.data.data;
    
  } catch (error: any) {
    console.error(' Error fetching itineraries:', error.message);
    throw new Error(error.message || 'Failed to fetch itineraries');
  }
};


export const getItineraryById = async (id: string): Promise<Itinerary> => {
  try {
    console.log(' Fetching itinerary:', id);
    
    const response = await api.get<ApiResponse<Itinerary>>(`/itineraries/${id}`);
    
    console.log(' Fetched itinerary:', response.data.data.title);
    
    return response.data.data;
    
  } catch (error: any) {
    console.error(' Error fetching itinerary:', error.message);
    throw new Error(error.message || 'Failed to fetch itinerary');
  }
};


export const createItinerary = async (
  data: CreateItineraryRequest
): Promise<Itinerary> => {
  try {
    console.log(' Creating itinerary:', data.title);
    
    const response = await api.post<ApiResponse<Itinerary>>('/itineraries', data);
    
    console.log(' Created itinerary with ID:', response.data.data.id);
    
    return response.data.data;
    
  } catch (error: any) {
    console.error(' Error creating itinerary:', error.message);
    throw new Error(error.message || 'Failed to create itinerary');
  }
};


export const updateItinerary = async (
  id: string,
  data: UpdateItineraryRequest
): Promise<Itinerary> => {
  try {
    console.log(' Updating itinerary:', id);
    
    const response = await api.put<ApiResponse<Itinerary>>(
      `/itineraries/${id}`,
      data
    );
    
    console.log(' Updated itinerary');
    
    return response.data.data;
    
  } catch (error: any) {
    console.error(' Error updating itinerary:', error.message);
    throw new Error(error.message || 'Failed to update itinerary');
  }
};


export const deleteItinerary = async (id: string): Promise<void> => {
  try {
    console.log(' Deleting itinerary:', id);
    
    await api.delete(`/itineraries/${id}`);
    
    console.log(' Deleted itinerary');
    
  } catch (error: any) {
    console.error(' Error deleting itinerary:', error.message);
    throw new Error(error.message || 'Failed to delete itinerary');
  }
};


export const shareItinerary = async (
  id: string,
  isPublic: boolean
): Promise<void> => {
  try {
    console.log(`🔗 ${isPublic ? 'Making public' : 'Making private'}:`, id);
    
    await api.post(`/itineraries/${id}/share`, { isPublic });
    
    console.log(`✅ Itinerary is now ${isPublic ? 'public' : 'private'}`);
    
  } catch (error: any) {
    console.error('❌ Error sharing itinerary:', error.message);
    throw new Error(error.message || 'Failed to update sharing settings');
  }
};
