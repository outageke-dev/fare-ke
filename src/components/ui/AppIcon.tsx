'use client';

import React from 'react';
import {
  ArrowLeft,
  Bell,
  Bus,
  BusFront,
  Circle,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
  MapPin,
  Motorbike,
  PlusCircle,
  Route,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

type IconVariant = 'outline' | 'solid';

interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  ArrowLeftIcon: ArrowLeft,
  BellIcon: Bell,
  BusIcon: Bus,
  BusFrontIcon: BusFront,
  ChevronLeftIcon: ChevronLeft,
  ChevronRightIcon: ChevronRight,
  CircleIcon: Circle,
  HomeIcon: Home,
  HelpCircleIcon: HelpCircle,
  MapPinIcon: MapPin,
  MotorbikeIcon: Motorbike,
  PlusCircleIcon: PlusCircle,
  RouteIcon: Route,
  SearchIcon: Search,
  SettingsIcon: Settings2,
  SparklesIcon: Sparkles,
  TrendingUpIcon: TrendingUp,
  UsersIcon: Users,
};

function Icon({
  name,
  variant = 'outline',
  size = 24,
  className = '',
  onClick,
  disabled = false,
  ...props
}: IconProps) {
  const IconComponent = iconMap[name] || Circle;

  return (
    <IconComponent
      size={size}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      {...props}
    />
  );
}

export default Icon;