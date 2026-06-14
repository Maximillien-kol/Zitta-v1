import { ChevronDown, MapPin, Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white rounded-3xl sm:rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-[5px] focus-within:ring-[3px] focus-within:ring-blue-50 focus-within:border-blue-100 transition-all">
      
      {/* Category Dropdown (As in Image: "Jobs v") */}
      <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-full bg-[#EBF0F6] hover:bg-[#e2eaf4] transition-colors pl-6 pr-5 py-3 text-[13px] font-medium text-[#374151] whitespace-nowrap mb-2 sm:mb-0">
        Jobs <ChevronDown size={14} className="text-[#6B7280] stroke-[3] ml-1" />
      </button>

      {/* Main Input */}
      <div className="flex-1 w-full max-w-full sm:max-w-none flex items-center px-4 py-2 sm:py-0 sm:border-r border-gray-100/80 my-1 sm:my-0">
        <input 
          type="text" 
          placeholder="Search job titles or..." 
          className="w-full text-[14px] bg-transparent outline-none placeholder:text-[#9CA3AF] placeholder:font-normal text-[#1F2937]"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 pl-5 pr-2 py-2 sm:py-0 w-full sm:w-auto">
        <MapPin size={18} className="text-[#3B82F6] mb-0.5 fill-blue-50/50" />
        <span className="text-[14px] font-medium text-[#111827] whitespace-nowrap hidden lg:inline-block pr-3 tracking-tight">Select Location</span>
        <button className="w-12 h-12 bg-[#2B3B4C] hover:bg-[#1f2b38] transition-colors rounded-full flex items-center justify-center ml-auto sm:ml-2 text-white shrink-0 shadow-lg shadow-slate-900/10">
          <Search size={20} strokeWidth={2.5} className="ml-0.5" />
        </button>
      </div>

    </div>
  );
}
