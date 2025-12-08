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

  // Combine days and calltimes into a single sortable list
  const allItems = [
    ...project.days.map(day => ({ ...day, itemType: 'day' })),
    ...(project.calltimes || []).map(ct => ({ ...ct, itemType: 'calltime' }))
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = allItems.findIndex((item) => item.id === active.id);
      const newIndex = allItems.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(allItems, oldIndex, newIndex);
      
      // Separate back into days and calltimes
      const newDays = reorderedItems.filter(item => item.itemType === 'day').map(({ itemType, ...rest }) => rest);
      const newCalltimes = reorderedItems.filter(item => item.itemType === 'calltime').map(({ itemType, ...rest }) => rest);
      
      onProjectChange({ ...project, days: newDays, calltimes: newCalltimes });
    }
  };

  const handleAddDay = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const newDay = {
      id: Date.now().toString(),
      date: formattedDate,
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
      rows: [
        {
          id: Date.now().toString() + '-1',
          time: '',
          name: ''
        }
      ]
    };

    onProjectChange({ ...project, calltimes: [...(project.calltimes || []), newCalltime] });
  };

  const handleRemoveDay = (dayId) => {
    onProjectChange({
      ...project,
      days: project.days.filter(day => day.id !== dayId)
    });
  };

  const handleRemoveCalltime = (calltimeId) => {
    onProjectChange({
      ...project,
      calltimes: (project.calltimes || []).filter(ct => ct.id !== calltimeId)
    });
  };

  const handleUpdateDay = (dayId, updatedDay) => {
    onProjectChange({
      ...project,
      days: project.days.map(day => day.id === dayId ? updatedDay : day)
    });
  };

  const handleUpdateCalltime = (calltimeId, updatedCalltime) => {
    onProjectChange({
      ...project,
      calltimes: (project.calltimes || []).map(ct => ct.id === calltimeId ? updatedCalltime : ct)
    });
  };

  return (
    <div className="schedule-editor">
      {/* Days Section */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDayDragEnd}
      >
        <SortableContext
          items={project.days.map(day => day.id)}
          strategy={verticalListSortingStrategy}
        >
          {project.days.map((day) => (
            <DaySection
              key={day.id}
              day={day}
              columnWidths={project.column_widths}
              onUpdateDay={(updatedDay) => handleUpdateDay(day.id, updatedDay)}
              onRemoveDay={() => handleRemoveDay(day.id)}
              canRemove={project.days.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Calltimes Section */}
      {project.calltimes && project.calltimes.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCalltimeDragEnd}
        >
          <SortableContext
            items={project.calltimes.map(ct => ct.id)}
            strategy={verticalListSortingStrategy}
          >
            {project.calltimes.map((calltime) => (
              <CalltimeSection
                key={calltime.id}
                calltime={calltime}
                onUpdateCalltime={(updatedCalltime) => handleUpdateCalltime(calltime.id, updatedCalltime)}
                onRemoveCalltime={() => handleRemoveCalltime(calltime.id)}
                canRemove={true}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

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
