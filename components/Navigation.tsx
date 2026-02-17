'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Browse', icon: '🔍' },
  { href: '/camera', label: 'Camera', icon: '📷' },
  { href: '/saved', label: 'Saved', icon: '💾' },
  { href: '/gallery', label: 'Gallery', icon: '🖼️' },
] as const;

export default function Navigation() {
  const pathname = usePathname();

  // Hide nav on login page and camera page (fullscreen experience)
  if (pathname === '/login' || pathname === '/camera') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
