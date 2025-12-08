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
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

function ScheduleEditor({ project, onProjectChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDayDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = project.days.findIndex((day) => day.id === active.id);
      const newIndex = project.days.findIndex((day) => day.id === over.id);

      const newDays = arrayMove(project.days, oldIndex, newIndex);
      onProjectChange({ ...project, days: newDays });
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

  const handleRemoveDay = (dayId) => {
    onProjectChange({
      ...project,
      days: project.days.filter(day => day.id !== dayId)
    });
  };

  const handleUpdateDay = (dayId, updatedDay) => {
    onProjectChange({
      ...project,
      days: project.days.map(day => day.id === dayId ? updatedDay : day)
    });
  };

  return (
    <div className="schedule-editor">
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

      <div className="mt-6 no-print">
        <Button
          onClick={handleAddDay}
          variant="outline"
          className="w-full md:w-auto"
          data-testid="add-day-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>
    </div>
  );
}

export default ScheduleEditor;
