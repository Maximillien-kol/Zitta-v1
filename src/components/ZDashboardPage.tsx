import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, MessageSquare, User, Settings, LogOut, Plus, ChevronLeft,
  Send, MapPin, Check, Wifi, Car, Shield, Coffee, Zap, Heart as HeartIcon,
  Trash, Eye, EyeOff, ChevronDown, X, Search, Phone, Video,
  Bed, Bath, Layout, Wind, Utensils, Waves, Camera
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';

function MapPickerEvents({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

type Section = 'properties' | 'messages' | 'profile' | 'settings';

const AMENITY_LIST = [
  { label: 'WiFi', icon: Wifi },
  { label: 'Parking', icon: Car },
  { label: 'Security', icon: Shield },
  { label: 'Coffee Bar', icon: Coffee },
  { label: 'Power Backup', icon: Zap },
  { label: 'Garden', icon: HeartIcon },
  { label: 'Kitchen', icon: Utensils },
  { label: 'Balcony', icon: Waves },
];

export function ZDashboardPage({ onLogout }: { onLogout?: () => void }) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<Section>('properties');

  // Auth
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Properties
  const [properties, setProperties] = useState<any[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [lat, setLat] = useState(-1.9536);
  const [lng, setLng] = useState(30.0964);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '', address: '', price: '', beds: '', baths: '',
    rooms: '', sqft: '', description: '', status: 'For Sale',
    propertyType: 'Apartment', mlsId: '', yearBuilt: '', lotSize: ''
  });

  // Messages
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [msgSearch, setMsgSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Profile
  const [profileForm, setProfileForm] = useState({
    full_name: '', bio: '', phone: '', email: '', avatar_url: ''
  });
  const [isPublic, setIsPublic] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const uid = user?.id || '';
        setUserId(uid);
        setUserEmail(user?.email || '');

        if (uid) {
          const [props, convs, profile] = await Promise.all([
            api.getOwnerProperties(uid),
            api.getConversations(uid),
            api.getProfile(uid)
          ]);
          setProperties(props);
          setConversations(convs);
          if (profile) {
            setProfileForm({
              full_name: profile.full_name || '',
              bio: profile.bio || '',
              phone: profile.phone || '',
              email: profile.email || user?.email || '',
              avatar_url: profile.avatar_url || ''
            });
            setIsPublic(profile.is_public !== false);
          }
        }
      } catch (err) { console.error(err); }
    };
    init();
  }, [showAddProperty]);

  // Fetch messages and subscribe to real-time updates on conversation change
  useEffect(() => {
    if (!selectedConversation) return;
    
    api.getMessages(selectedConversation).then(setMessages);

    // Subscribe to real-time messages for this conversation
    const messageChannel = api.subscribeToMessages(selectedConversation, (newMsg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    // Subscribe to real-time conversation updates
    const convChannel = api.subscribeToConversations(userId, async () => {
      try {
        const convs = await api.getConversations(userId);
        setConversations(convs);
      } catch (err) {
        console.error('Failed to update conversations:', err);
      }
    });

    return () => {
      messageChannel.then((chan: any) => chan?.unsubscribe());
      convChannel.then((chan: any) => chan?.unsubscribe());
    };
  }, [selectedConversation, userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleAmenity = (a: string) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingMedia(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `listings/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('properties').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('properties').getPublicUrl(fileName);
        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (error: any) {
      console.error(error);
      alert('Upload failed: ' + error.message + '\n\nIMPORTANT: Please ensure you created a public storage bucket named "properties" in your Supabase dashboard.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('properties').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('properties').getPublicUrl(fileName);
      setProfileForm(f => ({ ...f, avatar_url: data.publicUrl }));
    } catch (error: any) {
      console.error(error);
      alert('Avatar upload failed: ' + error.message + '\n\nPlease ensure your "properties" bucket exists in Supabase.');
    }
  };

  const handlePublishProperty = async () => {
    try {
      await api.createProperty({
        ...formData,
        images: uploadedImages,
        lat, lng, amenities,
        agent: profileForm.full_name || userEmail
      });
      setAddStep(1); setUploadedImages([]); setAmenities([]);
      setFormData({ title: '', address: '', price: '', beds: '', baths: '', rooms: '', sqft: '', description: '', status: 'For Sale', propertyType: 'Apartment', mlsId: '', yearBuilt: '', lotSize: '' });
      setShowAddProperty(false);
      alert('Property published successfully!');
    } catch (err: any) {
      alert('Failed to publish: ' + (err?.message || err));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const sent = await api.sendMessage(
        selectedConversation, newMessage, userId,
        profileForm.full_name || 'Owner'
      );
      setMessages(prev => [...prev, sent]);
      setNewMessage('');
      const convs = await api.getConversations(userId);
      setConversations(convs);
    } catch (err) { console.error(err); }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err: any) { alert('Failed to delete: ' + err.message); }
  };

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      await api.updateProfile(userId, { ...profileForm, is_public: isPublic });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) { alert('Failed to save: ' + err.message); }
    finally { setProfileLoading(false); }
  };

  // ── Sidebar items ─────────────────────────────────────────────────────────
  const sideItems: { id: Section; icon: any; label: string }[] = [
    { id: 'properties', icon: Building2, label: 'Properties' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // ── Add Property Stepper ───────────────────────────────────────────────────
  const renderStepper = () => {
    const steps = ['Basics', 'Location', 'Details', 'Amenities', 'Photos', 'Review'];
    return (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
        <div className="w-full max-w-[600px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-[80px] border-b border-[#F5EFEB] flex items-center justify-between px-6 flex-shrink-0">
            <button onClick={() => { setShowAddProperty(false); setAddStep(1); }} className="flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156] font-medium text-[14px]">
              <ChevronLeft size={20} /> Cancel
            </button>
            <h2 className="font-bold text-[#1A1A1A] text-[16px]">Add Property</h2>
            <div className="text-[13px] text-[#567C8D] font-medium">Step {addStep}/6</div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#F5EFEB]">
            <div className="h-full bg-[#567C8D] transition-all duration-300" style={{ width: `${(addStep / 6) * 100}%` }} />
          </div>

          {/* Steps pill nav */}
          <div className="flex gap-1.5 px-6 py-3 border-b border-[#F5EFEB] overflow-x-auto">
            {steps.map((s, i) => (
              <span key={s} className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${addStep === i + 1 ? 'bg-[#567C8D] text-white' : addStep > i + 1 ? 'bg-[#F5EFEB] text-[#2F4156]' : 'text-[#A0B3C6]'}`}>{s}</span>
            ))}
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* STEP 1: Basics */}
            {addStep === 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Property Basics</h3>
                {[
                  { label: 'Title', key: 'title', placeholder: 'e.g. Modern 3BR Apartment in Kigali' },
                  { label: 'Address', key: 'address', placeholder: 'Full address' },
                  { label: 'Price (RWF)', key: 'price', placeholder: '0', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">{f.label}</label>
                    <input type={f.type || 'text'} value={(formData as any)[f.key]} placeholder={f.placeholder}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white transition-all"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Status</label>
                    <select value={formData.status} onChange={e => setFormData(d => ({ ...d, status: e.target.value }))}
                      className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white">
                      {['For Sale', 'For Rent', 'Active', 'Sold'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Type</label>
                    <select value={formData.propertyType} onChange={e => setFormData(d => ({ ...d, propertyType: e.target.value }))}
                      className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white">
                      {['Apartment', 'House', 'Villa', 'Office', 'Land', 'Commercial'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {addStep === 2 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Pick Location on Map</h3>
                <p className="text-[13px] text-[#567C8D]">Click on the map to set the property pin</p>
                <div className="rounded-2xl overflow-hidden border border-[#E0E6ED]" style={{ height: 380 }}>
                  <MapContainer center={[lat, lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} />
                    <MapPickerEvents onPick={(la, ln) => { setLat(la); setLng(ln); }} />
                  </MapContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F5EFEB] rounded-xl px-4 py-2.5 text-[13px]">
                    <span className="text-[#567C8D] font-medium">Lat: </span>
                    <span className="text-[#1A1A1A] font-bold">{lat.toFixed(5)}</span>
                  </div>
                  <div className="bg-[#F5EFEB] rounded-xl px-4 py-2.5 text-[13px]">
                    <span className="text-[#567C8D] font-medium">Lng: </span>
                    <span className="text-[#1A1A1A] font-bold">{lng.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Details */}
            {addStep === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Bedrooms', key: 'beds' },
                    { label: 'Bathrooms', key: 'baths' },
                    { label: 'Sq Ft', key: 'sqft' },
                    { label: 'Year Built', key: 'yearBuilt' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">{f.label}</label>
                      <input type="number" value={(formData as any)[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Description</label>
                  <textarea rows={4} value={formData.description} onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                    placeholder="Describe the property..."
                    className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white resize-none" />
                </div>
              </div>
            )}

            {/* STEP 4: Amenities */}
            {addStep === 4 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Amenities</h3>
                <p className="text-[13px] text-[#567C8D]">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITY_LIST.map(({ label, icon: Icon }) => {
                    const active = amenities.includes(label);
                    return (
                      <button key={label} onClick={() => toggleAmenity(label)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${active ? 'border-[#567C8D] bg-[#F5EFEB]' : 'border-[#E0E6ED] bg-white hover:border-[#C8D9E6]'}`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-[#567C8D] text-white' : 'bg-[#F5EFEB] text-[#2F4156]'}`}>
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className={`text-[13px] font-semibold ${active ? 'text-[#567C8D]' : 'text-[#1A1A1A]'}`}>{label}</span>
                        {active && <Check size={14} className="ml-auto text-[#567C8D]" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Photos */}
            {addStep === 5 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Property Photos & Videos</h3>
                <p className="text-[13px] text-[#567C8D]">Upload at least 6 photos/videos. First item is the cover.</p>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${isUploadingMedia ? 'border-[#567C8D] bg-[#F5EFEB] cursor-wait' : 'border-[#E0E6ED] hover:border-[#567C8D] hover:bg-[#F9FAFB] cursor-pointer'}`}>
                  {isUploadingMedia ? (
                    <>
                      <div className="w-8 h-8 border-4 border-[#567C8D] border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="text-[14px] font-semibold text-[#2F4156]">Uploading High-Res Media...</span>
                      <span className="text-[12px] text-[#567C8D] mt-1">This may take a moment for 8K video</span>
                    </>
                  ) : (
                    <>
                      <Camera size={32} className="text-[#A0B3C6] mb-3" strokeWidth={1.5} />
                      <span className="text-[14px] font-semibold text-[#2F4156]">Click to upload photos or videos</span>
                      <span className="text-[12px] text-[#A0B3C6] mt-1">Images & Videos up to 8K resolution</span>
                      <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploadingMedia} />
                    </>
                  )}
                </label>
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((url, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square group bg-black">
                        {url.match(/\.(mp4|webm|mov|mkv)$/i) ? (
                          <video src={url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                        ) : (
                          <img src={url} className="w-full h-full object-cover" alt="" />
                        )}
                        {i === 0 && <div className="absolute top-1 left-1 bg-[#567C8D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</div>}
                        <button onClick={() => setUploadedImages(p => p.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 hidden group-hover:flex items-center justify-center">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`text-[13px] font-medium ${uploadedImages.length >= 6 ? 'text-green-600' : 'text-[#E57373]'}`}>
                  {uploadedImages.length}/6 minimum items uploaded
                </div>
              </div>
            )}

            {/* STEP 6: Review */}
            {addStep === 6 && (
              <div className="flex flex-col gap-5">
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">Review & Publish</h3>
                {uploadedImages[0] && <img src={uploadedImages[0]} className="w-full h-48 object-cover rounded-2xl" alt="cover" />}
                <div className="bg-[#F5EFEB] rounded-2xl p-5 space-y-3">
                  {[
                    ['Title', formData.title], ['Address', formData.address],
                    ['Price', `RWF ${Number(formData.price).toLocaleString()}`],
                    ['Type', formData.propertyType], ['Status', formData.status],
                    ['Beds', formData.beds], ['Baths', formData.baths],
                    ['Sq Ft', formData.sqft], ['Year Built', formData.yearBuilt],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label as string} className="flex justify-between text-[13px]">
                      <span className="text-[#567C8D] font-medium">{label}</span>
                      <span className="text-[#1A1A1A] font-semibold">{value}</span>
                    </div>
                  ))}
                  {amenities.length > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#567C8D] font-medium">Amenities</span>
                      <span className="text-[#1A1A1A] font-semibold text-right max-w-[200px]">{amenities.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stepper buttons */}
          <div className="border-t border-[#F5EFEB] px-6 py-4 flex justify-between items-center gap-3 flex-shrink-0">
            {addStep > 1 ? (
              <button onClick={() => setAddStep(s => s - 1)}
                className="px-6 py-3 border border-[#E0E6ED] text-[#2F4156] hover:bg-[#F5EFEB] rounded-xl font-semibold text-[14px] transition-colors">
                Back
              </button>
            ) : <div />}
            {addStep < 6 ? (
              <button
                onClick={() => setAddStep(s => s + 1)}
                disabled={(addStep === 1 && (!formData.title || !formData.address || !formData.price)) || (addStep === 5 && (uploadedImages.length < 6 || isUploadingMedia))}
                className={`px-8 py-3 rounded-xl font-bold text-[14px] transition-all ${(addStep === 1 && (!formData.title || !formData.address || !formData.price)) || (addStep === 5 && (uploadedImages.length < 6 || isUploadingMedia))
                  ? 'bg-[#E0E6ED] text-[#A0B3C6] cursor-not-allowed'
                  : 'bg-[#567C8D] hover:bg-[#2F4156] text-white shadow-sm'
                  }`}>
                Continue
              </button>
            ) : (
              <button onClick={handlePublishProperty}
                className="px-8 py-3 bg-[#2F4156] hover:bg-[#1A1A1A] text-white rounded-xl font-bold text-[14px] transition-colors shadow-sm">
                Publish Property
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Section: Properties ────────────────────────────────────────────────────
  const renderProperties = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-[#1A1A1A]">My Properties</h2>
          <p className="text-[13px] text-[#567C8D] mt-0.5">{properties.length} listed</p>
        </div>
        <button onClick={() => setShowAddProperty(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#567C8D] hover:bg-[#2F4156] text-white rounded-xl font-semibold text-[14px] transition-colors shadow-sm">
          <Plus size={18} strokeWidth={2.5} /> Add Property
        </button>
      </div>
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5EFEB] flex items-center justify-center mb-4">
            <Building2 size={28} className="text-[#567C8D]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-2">No properties yet</h3>
          <p className="text-[#567C8D] text-[14px] mb-6 max-w-[280px]">Add your first property to start receiving inquiries from potential buyers.</p>
          <button onClick={() => setShowAddProperty(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#567C8D] hover:bg-[#2F4156] text-white rounded-xl font-semibold text-[14px] transition-colors">
            <Plus size={18} /> List First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map(p => (
            <div key={p.id} className="bg-white border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-[#F5EFEB] relative overflow-hidden">
                {(p.image || p.images?.[0]) ? (
                  <img src={p.image || p.images?.[0]} className="w-full h-full object-cover" alt={p.title || p.address} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={36} className="text-[#A0B3C6]" strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 text-[#567C8D] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {p.status || 'Active'}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-[#1A1A1A] text-[15px] mb-1 truncate">{p.title || p.address?.split(',')[0]}</h4>
                <div className="flex items-center gap-1 text-[#567C8D] text-[12px] mb-3">
                  <MapPin size={12} />
                  <span className="truncate">{p.address}</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#567C8D] mb-3">
                  {p.beds > 0 && <span className="flex items-center gap-1"><Bed size={12} />{p.beds}</span>}
                  {p.baths > 0 && <span className="flex items-center gap-1"><Bath size={12} />{p.baths}</span>}
                  {p.sqft > 0 && <span className="flex items-center gap-1"><Layout size={12} />{p.sqft?.toLocaleString()} sqft</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A1A1A] text-[15px]">RWF {Number(p.price).toLocaleString()}</span>
                  <button onClick={() => handleDeleteProperty(p.id)}
                    className="p-1.5 text-[#E57373] hover:bg-red-50 rounded-lg transition-colors">
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Section: Messages ─────────────────────────────────────────────────────
  const filteredConvs = conversations.filter(c =>
    c.agent_id === userId &&
    (!msgSearch || (c.buyer_name || c.property?.title || '').toLowerCase().includes(msgSearch.toLowerCase()))
  );

  const renderMessages = () => (
    <div className="flex-1 overflow-hidden flex">
      {/* Conv list */}
      <div className="w-[280px] flex-shrink-0 border-r border-[#F5EFEB] flex flex-col">
        <div className="p-4 border-b border-[#F5EFEB]">
          <h2 className="font-bold text-[#1A1A1A] text-[16px] mb-3">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0B3C6]" />
            <input value={msgSearch} onChange={e => setMsgSearch(e.target.value)} placeholder="Search..."
              className="w-full bg-[#F5EFEB] border-0 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-[#567C8D]/30" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="p-6 text-center text-[#A0B3C6] text-[13px]">No conversations yet</div>
          ) : filteredConvs.map(conv => (
            <button key={conv.id} onClick={() => setSelectedConversation(conv.id)}
              className={`w-full text-left p-4 border-b border-[#F5EFEB] transition-colors ${selectedConversation === conv.id ? 'bg-[#F5EFEB]' : 'hover:bg-[#FAFAFA]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#567C8D] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-bold">
                    {(conv.buyer_name || conv.agent_name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#1A1A1A] text-[13px] truncate">
                    {conv.buyer_name || 'Client'}
                  </div>
                  <div className="text-[11px] text-[#567C8D] font-medium truncate mb-0.5">
                    {conv.property?.title || 'Property Inquiry'}
                  </div>
                  <div className="text-[12px] text-[#A0B3C6] truncate">{conv.last_message || 'No messages yet'}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="h-[65px] border-b border-[#F5EFEB] flex items-center px-5 gap-3 flex-shrink-0">
            {(() => {
              const conv = conversations.find(c => c.id === selectedConversation);
              return (
                <>
                  <div className="w-9 h-9 rounded-full bg-[#567C8D] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-bold">
                      {(conv?.buyer_name || conv?.agent_name || 'C')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1A1A] text-[14px]">{conv?.buyer_name || 'Client'}</div>
                    <div className="text-[11px] text-[#567C8D]">{conv?.property?.title || 'Property inquiry'}</div>
                  </div>
                </>
              );
            })()}
          </div>
          {/* Property Card */}
          {(() => {
            const conv = conversations.find(c => c.id === selectedConversation);
            if (!conv?.property) return null;
            return (
              <div className="px-6 py-4 border-b border-[#F5EFEB] bg-[#FAFAFA] flex-shrink-0">
                <Link to={`/property/${conv.property_id}`} target="_blank" className="flex items-center gap-4 p-3 bg-white border border-[#E0E6ED] rounded-xl hover:shadow-md transition-all">
                  <img src={conv.property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'} className="w-14 h-14 rounded-lg object-cover" alt="Property" />
                  <div>
                    <h3 className="font-bold text-[14px] text-[#1A1A1A]">{conv.property.title}</h3>
                    <p className="text-[12px] text-[#567C8D]">Click to view property details</p>
                  </div>
                </Link>
              </div>
            );
          })()}
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center text-[#A0B3C6] text-[13px] py-8">No messages yet. Start the conversation!</div>
            )}
            {messages.map((msg, i) => {
              const isOwn = msg.sender_id === userId;
              return (
                <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${isOwn ? 'bg-[#2F4156] text-white rounded-br-sm' : 'bg-[#F1F3F5] text-[#1A1A1A] rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                    <span className={`text-[11px] text-[#A0B3C6] mt-1 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                      {msg.time || msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-[#F5EFEB] p-4 flex gap-3">
            <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[#F5EFEB] border-0 rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-1 focus:ring-[#567C8D]/30"
            />
            <button type="submit" disabled={!newMessage.trim()}
              className="w-11 h-11 bg-[#567C8D] hover:bg-[#2F4156] text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5EFEB] flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-[#567C8D]" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#1A1A1A] text-[16px] mb-1">Select a conversation</h3>
            <p className="text-[#567C8D] text-[13px]">Choose a client to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );

  // ── Section: Profile ──────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">My Profile</h2>
        <p className="text-[13px] text-[#567C8D] mb-6">This information may be visible to potential clients on your property listings.</p>

        {/* Visibility toggle */}
        <div className="bg-white border border-[#E0E6ED] rounded-2xl p-5 mb-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-[15px]">Contact Visibility</h3>
            <p className="text-[12px] text-[#567C8D] mt-0.5">
              {isPublic ? 'Your phone & email are visible on listings' : 'Your contact details are hidden from listings'}
            </p>
          </div>
          <button
            onClick={() => setIsPublic(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${isPublic ? 'bg-[#567C8D]' : 'bg-[#E0E6ED]'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${isPublic ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Profile form */}
        <div className="bg-white border border-[#E0E6ED] rounded-2xl p-6 shadow-sm space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#F5EFEB]">
            <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center overflow-hidden flex-shrink-0">
              {profileForm.avatar_url ? (
                <img src={profileForm.avatar_url} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <User size={28} className="text-[#567C8D]" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Profile Photo</label>
              <label className="flex items-center justify-center w-full border border-[#E0E6ED] border-dashed rounded-xl px-4 py-2.5 text-[14px] text-[#567C8D] bg-[#F9FAFB] hover:bg-white hover:border-[#567C8D] cursor-pointer transition-all">
                <Camera size={16} className="mr-2" />
                Click to upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Full Name</label>
              <input type="text" value={profileForm.full_name}
                onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Email Address</label>
              <input type="email" value={profileForm.email}
                onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Phone</label>
            <input type="tel" value={profileForm.phone}
              onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+250 ..."
              className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white transition-all" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#567C8D] mb-1.5">Bio</label>
            <textarea rows={3} value={profileForm.bio}
              onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell potential clients about yourself..."
              className="w-full border border-[#E0E6ED] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#567C8D] bg-[#F9FAFB] focus:bg-white resize-none transition-all" />
          </div>

          <button onClick={handleSaveProfile} disabled={profileLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${profileSaved ? 'bg-green-500 text-white' : 'bg-[#567C8D] hover:bg-[#2F4156] text-white'} disabled:opacity-60`}>
            {profileSaved ? <><Check size={16} strokeWidth={3} /> Saved!</> : profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Section: Settings ─────────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6">Settings</h2>
        <div className="bg-white border border-[#E0E6ED] rounded-2xl divide-y divide-[#F5EFEB] shadow-sm">
          <div className="p-5">
            <h3 className="font-bold text-[#1A1A1A] text-[15px] mb-0.5">Account Email</h3>
            <p className="text-[13px] text-[#567C8D]">{userEmail}</p>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-[#1A1A1A] text-[15px] mb-1">Email Notifications</h3>
            <p className="text-[13px] text-[#567C8D] mb-3">Get notified when clients message you</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-5 bg-[#567C8D] rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
              <span className="text-[13px] text-[#1A1A1A] font-medium">Enabled</span>
            </div>
          </div>
          <div className="p-5">
            <button onClick={onLogout}
              className="flex items-center gap-3 text-[#E57373] hover:text-red-600 font-semibold text-[14px] transition-colors">
              <LogOut size={18} /> Sign out of Owner Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-screen flex flex-col bg-[#FFFFFF] overflow-hidden">

      {/* Top Nav — same design as ZTopNav */}
      <header className="h-[80px] bg-[#FFFFFF] border-b border-[#F5EFEB] flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="text-[#567C8D] flex items-center">
            <span className="font-semibold tracking-tighter -skew-x-[12deg] text-[24px] mr-[1px]">z</span>
            <span className="font-medium text-[22px]">itta</span>
          </div>
          <span className="text-[10px] font-bold text-[#567C8D] bg-[#F5EFEB] border border-[#E0E6ED] px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline">
            Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-[13px] text-[#567C8D] hover:text-[#2F4156] font-medium hidden md:block transition-colors">
            Return Home
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-[13px] text-[#567C8D]">
            <div className="w-8 h-8 rounded-full bg-[#F5EFEB] flex items-center justify-center">
              <User size={16} className="text-[#567C8D]" />
            </div>
            <span className="max-w-[160px] truncate">{profileForm.full_name || userEmail}</span>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#567C8D] hover:bg-[#F5EFEB] hover:text-[#2F4156] transition-colors text-[13px] font-medium">
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — same 80px design as ZSideNav */}
        <aside className="w-[80px] flex-shrink-0 bg-[#FFFFFF] border-r border-[#F5EFEB] flex flex-col items-center py-6 overflow-y-auto">
          <div className="flex flex-col gap-1 w-full">
            {sideItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center gap-1.5 w-full py-3 transition-colors group ${isActive ? 'bg-[#F5EFEB]' : 'hover:bg-[#F5EFEB]'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2 : 1.5}
                    className={`transition-colors ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#567C8D]'}`} />
                  <span className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156]'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-auto w-full">
            <button onClick={onLogout}
              className="flex flex-col items-center gap-1.5 w-full py-3 text-[#E57373] hover:bg-red-50 transition-colors group">
              <LogOut size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#FAFAFA]">
          {activeSection === 'properties' && renderProperties()}
          {activeSection === 'messages' && renderMessages()}
          {activeSection === 'profile' && renderProfile()}
          {activeSection === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Add Property Panel */}
      {showAddProperty && renderStepper()}
    </div>
  );
}
