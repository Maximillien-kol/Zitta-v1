import { Search, Bell, Heart, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZSideNav({ activeView, onViewChange }: { activeView?: string, onViewChange?: (v: string) => void }) {
  const { t } = useTranslation();
  
  const items = [
    { icon: Search, label: 'Search', textKey: 'Search' },
    { icon: Bell, label: 'Updates', textKey: 'Updates' },
    { icon: Heart, label: 'Saved', textKey: 'Saved' },
    { icon: Inbox, label: 'Inbox', textKey: 'Inbox' }
  ];

  return (
    <aside className="w-[80px] h-full bg-[#FFFFFF] border-r border-[#F5EFEB] fixed left-0 top-[80px] bottom-0 z-40 hidden md:flex flex-col items-center py-6">
      <div className="flex flex-col gap-6 mt-4 w-full">
        {items.map((item, i) => {
          const isActive = activeView === item.label;
          return (
          <button key={i} onClick={() => onViewChange?.(item.label)} className={`flex flex-col items-center gap-1.5 w-full py-2 transition-colors group ${isActive ? 'bg-[#F5EFEB]' : 'hover:bg-[#F5EFEB]'}`}>
            <item.icon size={24} strokeWidth={isActive ? 2 : 1.5} className={`transition-colors ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#567C8D]'}`} />
            <span className={`text-[10px] sm:text-[11px] font-medium w-full text-center tracking-tight ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#2F4156]'}`}>{t(item.textKey)}</span>
          </button>
        )})}
      </div>
    </aside>
  );
}
