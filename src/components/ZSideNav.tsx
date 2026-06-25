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
    <aside className="fixed z-40 bg-[#FFFFFF] border-[#F5EFEB] flex w-full h-[64px] border-t bottom-0 left-0 right-0 flex-row items-center justify-around pb-[env(safe-area-inset-bottom)] md:w-[80px] md:h-full md:border-t-0 md:border-r md:top-[80px] md:bottom-0 md:flex-col md:justify-start md:py-6 md:pb-6">
      <div className="flex flex-row w-full h-full justify-around items-center md:flex-col md:gap-6 md:mt-4 md:h-auto md:justify-start">
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
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors group md:gap-1.5 md:py-2 md:h-auto ${isActive ? 'bg-[#F5EFEB] md:bg-[#F5EFEB]' : 'hover:bg-[#F5EFEB]'}`}
            >
              <item.icon
                size={24}
                strokeWidth={isActive ? 2 : 1.5}
                className={`transition-colors md:mb-0 ${isActive ? 'text-[#567C8D]' : 'text-[#2F4156] group-hover:text-[#567C8D]'}`}
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
