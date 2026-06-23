import { Search, Bell, Heart, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function ZSideNav({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const items = [
    { icon: Search, label: 'Search', path: '/search', textKey: 'Search', requiresAuth: false },
    { icon: Bell, label: 'Updates', path: '/updates', textKey: 'Updates', requiresAuth: false },
    { icon: Heart, label: 'Saved', path: '/saved', textKey: 'Saved', requiresAuth: false },
    { icon: Inbox, label: 'Inbox', path: '/inbox', textKey: 'Inbox', requiresAuth: true }
  ];

  return (
    <aside className="w-[80px] h-full bg-[#FFFFFF] border-r border-[#F5EFEB] fixed left-0 top-[80px] bottom-0 z-40 hidden md:flex flex-col items-center py-6">
      <div className="flex flex-col gap-6 mt-4 w-full">
        {items.map((item, i) => {
          const isActive = path.startsWith(item.path);
          const isLocked = item.requiresAuth && !isAuthenticated;

          if (isLocked) {
            return null;
          }

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex flex-col items-center gap-1.5 w-full py-2 transition-colors group ${isActive ? 'bg-[#F5EFEB]' : 'hover:bg-[#F5EFEB]'}`}
            >
              <item.icon
                size={24}
                strokeWidth={isActive ? 2 : 1.5}
                className={`transition-colors ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#567C8D]'}`}
              />
              <span className={`text-[10px] sm:text-[11px] font-medium w-full text-center tracking-tight ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#2F4156]'}`}>
                {t(item.textKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
