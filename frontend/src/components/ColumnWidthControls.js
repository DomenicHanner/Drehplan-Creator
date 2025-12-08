import React, { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Settings2, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

function ColumnWidthControls({ columnWidths, onChange }) {
  const [open, setOpen] = useState(false);

  const handleWidthChange = (field, value) => {
    onChange({
      ...columnWidths,
      [field]: value[0]
    });
  };

  const resetWidths = () => {
    onChange({
      time_from: 8,
      time_to: 8,
      scene: 15,
      location: 20,
      cast: 25,
      notes: 24
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="no-print"
          data-testid="column-width-button"
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Column Widths
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Adjust Column Widths</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Time From ({columnWidths.time_from}%)
              </label>
              <Slider
                value={[columnWidths.time_from]}
                onValueChange={(value) => handleWidthChange('time_from', value)}
                min={5}
                max={30}
                step={1}
                data-testid="time-from-slider"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Time To ({columnWidths.time_to}%)
              </label>
              <Slider
                value={[columnWidths.time_to]}
                onValueChange={(value) => handleWidthChange('time_to', value)}
                min={5}
                max={30}
                step={1}
                data-testid="time-to-slider"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Scene ({columnWidths.scene}%)
              </label>
              <Slider
                value={[columnWidths.scene]}
                onValueChange={(value) => handleWidthChange('scene', value)}
                min={10}
                max={30}
                step={1}
                data-testid="scene-slider"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Location ({columnWidths.location}%)
              </label>
              <Slider
                value={[columnWidths.location]}
                onValueChange={(value) => handleWidthChange('location', value)}
                min={10}
                max={40}
                step={1}
                data-testid="location-slider"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Cast ({columnWidths.cast}%)
              </label>
              <Slider
                value={[columnWidths.cast]}
                onValueChange={(value) => handleWidthChange('cast', value)}
                min={15}
                max={40}
                step={1}
                data-testid="cast-slider"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">
                Notes ({columnWidths.notes}%)
              </label>
              <Slider
                value={[columnWidths.notes]}
                onValueChange={(value) => handleWidthChange('notes', value)}
                min={15}
                max={40}
                step={1}
                data-testid="notes-slider"
              />
            </div>
          </div>

          <div className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={resetWidths}
              className="w-full"
              data-testid="reset-widths-button"
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ColumnWidthControls;
