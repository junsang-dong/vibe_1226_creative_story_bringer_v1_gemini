import type { ReactNode } from 'react';
import { SettingsDropdown } from '../Settings/SettingsDropdown';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <div className="bg-gray-600 dark:bg-gray-800 text-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <div className="flex gap-2 items-center">
            {children}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}

