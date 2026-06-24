import { Property, SearchProperty } from '../types';
import { supabase } from './supabase';

const CACHE_TTL = 1000 * 60 * 10; // 10 minutes cache
const memoryCache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>();

const getCached = <T>(key: string): T | null => {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  memoryCache.set(key, { data, timestamp: Date.now() });
};

const clearCache = () => {
  memoryCache.clear();
};

export const api = {
  // --- PROPERTIES API ---

  getFeaturedProperties: async (): Promise<Property[]> => {
    const cacheKey = 'featuredProperties';
    const cached = getCached<Property[]>(cacheKey);
    if (cached) return cached;

    // Use promise caching to prevent concurrent duplicate requests
    const existing = memoryCache.get(cacheKey);
    if (existing?.promise) return existing.promise;

    const promise = supabase.from('properties').select('*').limit(10).then(({ data, error }) => {
      if (error) throw error;
      const result = (data || []).map(mapToProperty);
      setCache(cacheKey, result);
      return result;
    });

    memoryCache.set(cacheKey, { data: null, timestamp: 0, promise });
    return promise;
  },

  getOwnerProperties: async (ownerId: string): Promise<any[]> => {
    if (!ownerId) return [];
    const cacheKey = `ownerProperties_${ownerId}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const result = (data || []).map((row: any) => ({
      ...mapToProperty(row),
      title: row.title,
      description: row.description,
      property_type: row.property_type,
      sqft: row.sqft,
      beds: row.beds,
      baths: row.baths,
      images: row.images || [],
      image: row.image || row.images?.[0] || ''
    }));

    setCache(cacheKey, result);
    return result;
  },

  deleteProperty: async (propertyId: string): Promise<void> => {
    const { error } = await supabase.from('properties').delete().eq('id', propertyId);
    if (error) throw error;
    clearCache(); // Invalidate cache so lists update
  },

  searchProperties: async (filters: any): Promise<SearchProperty[]> => {
    const cacheKey = `searchProperties_${JSON.stringify(filters || {})}`;
    const cached = getCached<SearchProperty[]>(cacheKey);
    if (cached) return cached;

    const existing = memoryCache.get(cacheKey);
    if (existing?.promise) return existing.promise;

    const promise = (async () => {
      let query = supabase.from('properties').select('*');
      
      if (filters?.goal === 'rent') {
        query = query.eq('status', 'For rent');
      } else if (filters?.goal === 'buy') {
        query = query.eq('status', 'Active');
      }
      
      const { data, error } = await query;
      if (error) throw error;
      const result = (data || []).map(mapToSearchProperty);
      setCache(cacheKey, result);
      return result;
    })();

    memoryCache.set(cacheKey, { data: null, timestamp: 0, promise });
    return promise;
  },

  getPropertiesByIds: async (ids: string[]): Promise<SearchProperty[]> => {
    if (!ids || ids.length === 0) return [];
    
    // Sort IDs to ensure cache key consistency
    const cacheKey = `getPropertiesByIds_${[...ids].sort().join(',')}`;
    const cached = getCached<SearchProperty[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase.from('properties').select('*').in('id', ids);
    if (error) throw error;
    const result = (data || []).map(mapToSearchProperty);
    setCache(cacheKey, result);
    return result;
  },

  createProperty: async (propertyData: any): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Convert base64 images upload mock URLs or keep them as is (Supabase can store base64 or text)
    const { data, error } = await supabase.from('properties').insert({
      title: propertyData.title || propertyData.address,
      price: Number(propertyData.price),
      address: propertyData.address,
      beds: Number(propertyData.beds) || 0,
      baths: Number(propertyData.baths) || 0,
      sqft: Number(propertyData.sqft) || 0,
      description: propertyData.description || '',
      status: propertyData.status || 'Active',
      property_type: propertyData.propertyType || 'Apartment',
      mls_id: propertyData.mlsId || `#S${Math.floor(1000000 + Math.random() * 9000000)}`,
      year_built: propertyData.yearBuilt ? Number(propertyData.yearBuilt) : null,
      lot_size: propertyData.lotSize || '',
      amenities: propertyData.amenities || [],
      agent: propertyData.agent || 'Admin',
      badge_text: propertyData.badgeText || 'New',
      badge_type: propertyData.badgeType || 'blue',
      image: propertyData.images?.[0] || '',
      images: propertyData.images || [],
      lat: Number(propertyData.lat) || 0,
      lng: Number(propertyData.lng) || 0,
      bedrooms: Number(propertyData.beds) || 0,
      rooms: (Number(propertyData.beds) || 0) + (Number(propertyData.baths) || 0),
      owner_id: user?.id
    }).select().single();
    if (error) throw error;
    clearCache(); // Invalidate cache so new property shows up
    return data;
  },

  // --- SAVED PROPERTIES API ---

  saveProperty: async (propertyId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase.from('saved_properties').insert({
      user_id: user.id,
      property_id: propertyId
    });
    if (error) throw error;
    return true;
  },

  removeSavedProperty: async (propertyId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase.from('saved_properties')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
    if (error) throw error;
    return true;
  },

  getSavedPropertyIds: async (): Promise<string[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase.from('saved_properties').select('property_id').eq('user_id', user.id);
    if (error) throw error;
    return (data || []).map(d => d.property_id);
  },

  // --- MESSAGING SYSTEM API ---

  getConversations: async (userId: string, adminMode = false): Promise<any[]> => {
    let query = supabase.from('conversations').select('*, property:properties(title, image)');
    if (!adminMode) {
      query = query.or(`buyer_id.eq.${userId},agent_id.eq.${userId}`);
    }
    // Order by most recent
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getMessages: async (conversationId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  subscribeToMessages: (conversationId: string, callback: (message: any) => void) => {
    return supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },

  subscribeToConversations: (userId: string, callback: () => void) => {
    return supabase
      .channel(`conversations-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => callback()
      )
      .subscribe();
  },

  createConversation: async (propertyId: string, buyerId: string, agentId: string, agentName: string, buyerName?: string): Promise<any> => {
    const defaultAgentImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
    
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('property_id', propertyId)
      .eq('buyer_id', buyerId)
      .eq('agent_id', agentId)
      .maybeSingle();
    
    if (existing) return existing;

    // Fetch property title for the message
    const { data: propData } = await supabase.from('properties').select('title').eq('id', propertyId).maybeSingle();
    const propTitle = propData?.title || 'this property';

    // Fetch actual property owner image
    const { data: agentProfile } = await supabase.from('profiles').select('avatar_url').eq('id', agentId).maybeSingle();
    const realAgentImage = agentProfile?.avatar_url || defaultAgentImage;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        property_id: propertyId,
        buyer_id: buyerId,
        agent_id: agentId,
        agent_name: agentName,
        buyer_name: buyerName || 'Client',
        agent_image: realAgentImage,
        last_message: `Interested in ${propTitle}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      .select()
      .single();
    if (error) throw error;
    
    // Automatically send the first message to initiate the chat
    await supabase.from('messages').insert({
      conversation_id: data.id,
      sender_id: buyerId,
      sender_name: buyerName || 'Client',
      text: `Hi, I am interested in ${propTitle}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return data;
  },

  sendMessage: async (conversationId: string, text: string, senderId: string, senderName: string): Promise<any> => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_name: senderName,
        text,
        time: timestamp
      })
      .select()
      .single();
    if (error) throw error;
    
    // Update last message in conversation
    await supabase
      .from('conversations')
      .update({ last_message: text, timestamp })
      .eq('id', conversationId);

    return data;
  },

  authenticate: async (data: any): Promise<any> => {
    return { token: 'mock-token', user: data };
  },

  getUsers: async (): Promise<any[]> => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data || [];
  },

  getProfile: async (userId: string): Promise<any | null> => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) return null;
    return data;
  },

  updateProfile: async (userId: string, profileData: any): Promise<void> => {
    if (!userId) throw new Error('No user ID');
    const { error } = await supabase.from('profiles').update({
      full_name: profileData.full_name,
      phone: profileData.phone,
      email: profileData.email,
      avatar_url: profileData.avatar_url,
      bio: profileData.bio,
      is_public: profileData.is_public
    }).eq('id', userId);
    if (error) throw error;
  }
};

// Helper mappers to match the database schema with the frontend types
function mapToProperty(row: any): Property {
  return {
    id: row.id,
    price: Number(row.price),
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    status: row.status,
    address: row.address,
    mlsId: row.mls_id,
    agent: row.agent,
    badgeText: row.badge_text,
    badgeType: row.badge_type,
    image: row.image || (row.images && row.images.length > 0 ? row.images[0] : ''),
    owner_id: row.owner_id
  };
}

function mapToSearchProperty(row: any): SearchProperty {
  return {
    id: row.id,
    price: Number(row.price),
    address: row.address,
    bedrooms: row.bedrooms || row.beds,
    rooms: row.rooms || (row.beds + row.baths),
    sqft: row.sqft,
    images: row.images && row.images.length > 0 ? row.images : (row.image ? [row.image] : []),
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    property_type: row.property_type || '',
    status: row.status || '',
    owner_id: row.owner_id
  };
}
