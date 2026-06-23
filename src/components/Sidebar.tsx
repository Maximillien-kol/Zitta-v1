import { Check, X } from 'lucide-react';
import React from 'react';

export function Sidebar() {
  return (
    <div className="pt-2 pr-4 lg:pr-0 pb-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-[#111827] text-[16px] tracking-tight">Custom Filter</h2>
        <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition">Clear all</button>
      </div>

      <div className="space-y-1.5">
        <FilterBlock 
          title="Location" 
          icon={<div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-current" />}
        >
          <Checkbox label="Jakarta, Indonesia" checked={true} />
          <Checkbox label="Semarang, Indonesia" checked={false} />
        </FilterBlock>

        <FilterBlock 
          title="Price Range" 
          icon={<div className="w-[15px] h-[10px] rounded-[2px] border-[1.5px] border-current relative"><div className="absolute inset-0 m-auto w-1 h-1 rounded-full border border-current" /></div>}
        >
           <Radio label="Under RF 1,000" />
           <Radio label="RF 1,000 - RF 15,000" />
           <Radio label="More Than RF 15,000" />
           <Radio label="Custom" checked={true} />
           
           <div className="px-1.5 py-4 pb-6 mt-1">
            <div className="flex justify-between text-[11px] font-medium text-gray-800 mb-2.5">
              <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-100 min-w-[38px] text-center tracking-wide">RF 10K</span>
              <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-100 min-w-[38px] text-center tracking-wide">RF 50K</span>
            </div>
            <div className="relative h-[5px] bg-[#E5E7EB] rounded-full mt-3">
              <div className="absolute left-[20%] right-[30%] h-full bg-blue-600"></div>
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 ring-[2.5px] ring-white rounded-full shadow-sm z-10 cursor-col-resize"></div>
              <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 ring-[2.5px] ring-white rounded-full shadow-sm z-10 cursor-col-resize"></div>
            </div>
          </div>
        </FilterBlock>

        <FilterBlock 
          title="Land Area" 
          icon={<div className="grid grid-cols-2 gap-[2px] w-[14px] h-[14px]"><div className="border-[1.5px] border-current rounded-[1px]"></div><div className="border-[1.5px] border-current rounded-[1px]"></div><div className="border-[1.5px] border-current rounded-[1px]"></div><div className="border-[1.5px] border-current rounded-[1px]"></div></div>}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input type="text" placeholder="Min" className="w-full h-10 px-3 bg-white border border-gray-200 rounded-[10px] text-sm outline-none focus:border-blue-500 font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal transition-colors" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">sq ft</span>
            </div>
            <div className="flex-1 relative">
              <input type="text" placeholder="Max" className="w-full h-10 px-3 bg-white border border-gray-200 rounded-[10px] text-sm outline-none focus:border-blue-500 font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal transition-colors" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">sq ft</span>
            </div>
          </div>
        </FilterBlock>

        <FilterBlock 
          title="Type Of Place" 
          icon={<div className="w-[14px] h-[13px] border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-current rounded-t-[2px] relative"><div className="absolute -bottom-0.5 w-[110%] -left-[5%] h-[1.5px] bg-current"></div></div>}
        >
          <Checkbox label="Single Familiy Home" checked={true} />
          <Checkbox label="Condo/Townhouse" checked={false} />
          <Checkbox label="Apartment" checked={true} />
          <Checkbox label="Bungalow" checked={false} />
        </FilterBlock>

        <FilterBlock 
          title="Amenities" 
          icon={<div className="flex flex-col gap-[3px] w-[14px] h-[14px] justify-center"><div className="h-[1.5px] w-full bg-current rounded-full"></div><div className="h-[1.5px] w-full bg-current rounded-full"></div><div className="h-[1.5px] w-[70%] bg-current rounded-full"></div></div>} 
        />
      </div>
    </div>
  );
}

function FilterBlock({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between bg-[#F8F9FB] hover:bg-[#F3F4F6] transition-colors rounded-2xl px-4 py-3 cursor-pointer border border-[#F0F2F5]">
        <div className="flex items-center gap-3.5 text-[#6B7280]">
          <div className="flex items-center justify-center w-[16px]">
            {icon}
          </div>
          <span className="text-[13px] font-medium text-[#374151] tracking-tight">{title}</span>
        </div>
        <X size={15} className="text-[#9CA3AF]" strokeWidth={2.5} />
      </div>
      {children && (
        <div className="py-4 pl-[50px] pr-2">
          {children}
        </div>
      )}
    </div>
  )
}

function Checkbox({ label, checked = false }: { label: string, checked?: boolean }) {
  return (
    <label className="flex items-center gap-3.5 mb-[14px] cursor-pointer group">
      <div className={`w-[17px] h-[17px] rounded-[5px] border flex items-center justify-center transition-colors shadow-sm ${checked ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB] bg-white group-hover:border-blue-400'}`}>
        {checked && <Check size={12} strokeWidth={3.5} className="text-white" />}
      </div>
      <span className="text-[13px] text-[#4B5563]">{label}</span>
    </label>
  )
}

function Radio({ label, checked = false }: { label: string, checked?: boolean }) {
  return (
    <label className="flex items-center gap-3.5 mb-[14px] cursor-pointer group">
      <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-colors shadow-sm ${checked ? 'border-[#2563EB] bg-white' : 'border-[#D1D5DB] bg-white group-hover:border-blue-400'}`}>
        {checked && <div className="w-[10px] h-[10px] rounded-full bg-[#2563EB]"></div>}
      </div>
      <span className="text-[13px] text-[#4B5563]">{label}</span>
    </label>
  )
}
