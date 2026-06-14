import { Bell, ChevronDown, Menu } from 'lucide-react';

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 h-[72px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-[10px] flex items-center justify-center shadow-inner">
          <div className="w-3.5 h-3.5 bg-gray-100 rounded-full border-2 border-gray-800 ring-2 ring-gray-400"></div>
        </div>
        <span className="font-semibold text-xl tracking-tight text-gray-900">EquityFlow</span>
      </div>

      <nav className="hidden lg:flex items-center gap-8">
        <a href="#" className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Investments <ChevronDown size={14} className="stroke-[2.5]" />
        </a>
        <a href="#" className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Advisory <ChevronDown size={14} className="stroke-[2.5]" />
        </a>
        <a href="#" className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Market Insights <ChevronDown size={14} className="stroke-[2.5]" />
        </a>
        <a href="#" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Contact
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <button className="hidden sm:block px-5 py-2.5 rounded-full border border-gray-300 text-[13px] font-medium text-gray-800 hover:bg-gray-50 transition-colors">
          Start Investing
        </button>
        <button className="w-[42px] h-[42px] rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm">
          <Bell size={18} fill="currentColor" />
        </button>
        <button className="lg:hidden p-2 text-gray-600" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
