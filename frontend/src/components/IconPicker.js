import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  Calendar, 
  Clock, 
  Home, 
  User, 
  Car, 
  AlertTriangle, 
  Camera,
  Phone,
  Mail,
  AlertCircle,
  Coffee,
  Sandwich,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';

const ICONS = [
  { name: 'calendar', Icon: Calendar, label: 'Calendar' },
  { name: 'clock', Icon: Clock, label: 'Clock' },
  { name: 'home', Icon: Home, label: 'Home' },
  { name: 'user', Icon: User, label: 'Person' },
  { name: 'car', Icon: Car, label: 'Car' },
  { name: 'alert', Icon: AlertTriangle, label: 'Warning' },
  { name: 'camera', Icon: Camera, label: 'Camera' },
  { name: 'phone', Icon: Phone, label: 'Phone' },
  { name: 'mail', Icon: Mail, label: 'Mail' },
  { name: 'alertcircle', Icon: AlertCircle, label: 'Alert' },
  { name: 'coffee', Icon: Coffee, label: 'Coffee' },
  { name: 'burger', Icon: Sandwich, label: 'Food' },
  { name: 'sun', Icon: Sun, label: 'Sun' },
  { name: 'moon', Icon: Moon, label: 'Moon' },
];

function IconPicker({ currentIcon, onSelectIcon }) {
  const CurrentIconComponent = ICONS.find(i => i.name === currentIcon)?.Icon || Calendar;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-5 w-5 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
          data-testid="icon-picker-trigger"
        >
          <CurrentIconComponent className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-white">
        <div className="grid grid-cols-5 gap-2">
          {ICONS.map(({ name, Icon, label }) => (
            <Button
              key={name}
              variant={currentIcon === name ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectIcon(name)}
              className="h-10 w-10 p-0"
              title={label}
              data-testid={`icon-option-${name}`}
            >
              <Icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
