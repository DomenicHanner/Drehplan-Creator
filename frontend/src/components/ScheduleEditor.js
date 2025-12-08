import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DaySection from './DaySection';
import CalltimeSection from './CalltimeSection';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

function ScheduleEditor({ project, onProjectChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Combine days and calltimes into a single sortable list, sorted by position
  const allItems = [
    ...project.days.map(day => ({ ...day, itemType: 'day' })),
    ...(project.calltimes || []).map(ct => ({ ...ct, itemType: 'calltime' }))
  ].sort((a, b) => (a.position || 0) - (b.position || 0));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = allItems.findIndex((item) => item.id === active.id);
      const newIndex = allItems.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(allItems, oldIndex, newIndex);
      
      // Update positions
      const itemsWithPositions = reorderedItems.map((item, index) => ({
        ...item,
        position: index
      }));
      
      // Separate back into days and calltimes
      const newDays = itemsWithPositions.filter(item => item.itemType === 'day').map(({ itemType, ...rest }) => rest);
      const newCalltimes = itemsWithPositions.filter(item => item.itemType === 'calltime').map(({ itemType, ...rest }) => rest);
      
      onProjectChange({ ...project, days: newDays, calltimes: newCalltimes });
    }
  };

  const handleAddDay = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const newDay = {
      id: Date.now().toString(),
      date: formattedDate,
      position: allItems.length,
      rows: [
        {
          id: Date.now().toString() + '-1',
          type: 'item',
          time: '',
          scene: '',
          location: '',
          cast: '',
          notes: ''
        }
      ]
    };

    onProjectChange({ ...project, days: [...project.days, newDay] });
  };

  const handleAddCalltime = () => {
    const newCalltime = {
      id: Date.now().toString(),
      title: 'Calltime',
      headers: {
        time: 'Time',
        name: 'Name'
      },
      position: allItems.length,
      rows: [
        {
          id: Date.now().toString() + '-1',
          type: 'item',
          time: '',
          name: ''
        }
      ]
    };

    onProjectChange({ ...project, calltimes: [...(project.calltimes || []), newCalltime] });
  };

  const handleUpdateDay = (dayId, updatedDay) => {
    // Update using the current order from allItems
    const days = allItems
      .filter(item => item.itemType === 'day')
      .map(item => item.id === dayId ? { ...updatedDay, itemType: 'day' } : item)
      .map(({ itemType, ...rest }) => rest);
    
    const calltimes = allItems
      .filter(item => item.itemType === 'calltime')
      .map(({ itemType, ...rest }) => rest);
    
    onProjectChange({
      ...project,
      days,
      calltimes
    });
  };

  const handleUpdateCalltime = (calltimeId, updatedCalltime) => {
    // Update using the current order from allItems
    const days = allItems
      .filter(item => item.itemType === 'day')
      .map(({ itemType, ...rest }) => rest);
    
    const calltimes = allItems
      .filter(item => item.itemType === 'calltime')
      .map(item => item.id === calltimeId ? { ...updatedCalltime, itemType: 'calltime' } : item)
      .map(({ itemType, ...rest }) => rest);
    
    onProjectChange({
      ...project,
      days,
      calltimes
    });
  };

  const handleRemoveDay = (dayId) => {
    // Separate the items
    const days = allItems.filter(item => item.itemType === 'day' && item.id !== dayId).map(({ itemType, ...rest }) => rest);
    const calltimes = allItems.filter(item => item.itemType === 'calltime').map(({ itemType, ...rest }) => rest);
    onProjectChange({
      ...project,
      days,
      calltimes
    });
  };

  const handleRemoveCalltime = (calltimeId) => {
    // Separate the items
    const days = allItems.filter(item => item.itemType === 'day').map(({ itemType, ...rest }) => rest);
    const calltimes = allItems.filter(item => item.itemType === 'calltime' && item.id !== calltimeId).map(({ itemType, ...rest }) => rest);
    onProjectChange({
      ...project,
      days,
      calltimes
    });
  };

  return (
    <div className="schedule-editor">
      {/* Combined Days and Calltimes - all sortable together */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {allItems.map((item) => (
            item.itemType === 'day' ? (
              <DaySection
                key={item.id}
                day={item}
                columnWidths={project.column_widths}
                columnHeaders={project.column_headers}
                onUpdateDay={(updatedDay) => handleUpdateDay(item.id, updatedDay)}
                onUpdateHeaders={(updatedHeaders) => onProjectChange({ ...project, column_headers: updatedHeaders })}
                onRemoveDay={() => handleRemoveDay(item.id)}
                canRemove={project.days.length > 1}
              />
            ) : (
              <CalltimeSection
                key={item.id}
                calltime={item}
                onUpdateCalltime={(updatedCalltime) => handleUpdateCalltime(item.id, updatedCalltime)}
                onRemoveCalltime={() => handleRemoveCalltime(item.id)}
                canRemove={true}
              />
            )
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-6 flex gap-3 no-print">
        <Button
          onClick={handleAddDay}
          variant="outline"
          className="w-full md:w-auto"
          data-testid="add-day-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
        <Button
          onClick={handleAddCalltime}
          variant="outline"
          className="w-full md:w-auto"
          data-testid="add-calltime-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Calltime
        </Button>
      </div>
    </div>
  );
}

export default ScheduleEditor;
