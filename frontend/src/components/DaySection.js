import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import ScheduleRow from './ScheduleRow';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GripVertical, Plus, Trash2, Calendar } from 'lucide-react';

function DaySection({ day, columnWidths, onUpdateDay, onRemoveDay, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: day.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRowDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = day.rows.findIndex((row) => row.id === active.id);
      const newIndex = day.rows.findIndex((row) => row.id === over.id);

      const newRows = arrayMove(day.rows, oldIndex, newIndex);
      onUpdateDay({ ...day, rows: newRows });
    }
  };

  const handleAddRow = (type = 'item') => {
    const newRow = {
      id: Date.now().toString(),
      type,
      time_from: '',
      time_to: '',
      scene: '',
      location: '',
      cast: '',
      notes: ''
    };

    onUpdateDay({ ...day, rows: [...day.rows, newRow] });
  };

  const handleRemoveRow = (rowId) => {
    onUpdateDay({
      ...day,
      rows: day.rows.filter(row => row.id !== rowId)
    });
  };

  const handleUpdateRow = (rowId, updatedRow) => {
    onUpdateDay({
      ...day,
      rows: day.rows.map(row => row.id === rowId ? updatedRow : row)
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="schedule-day mb-8 bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Day Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 no-print"
            data-testid="day-drag-handle"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <Calendar className="h-5 w-5 text-slate-600" />
          <Input
            type="text"
            value={day.date}
            onChange={(e) => onUpdateDay({ ...day, date: e.target.value })}
            className="font-semibold text-slate-900 w-40 border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-600"
            placeholder="DD-MM-YYYY"
            data-testid="day-date-input"
          />
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveDay}
            className="no-print text-slate-600 hover:text-red-600"
            data-testid="remove-day-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="schedule-table w-full">
          <thead>
            <tr>
              <th className="no-print" style={{ width: '40px' }}></th>
              <th style={{ width: `${columnWidths?.time_from || 8}%` }}>Time From</th>
              <th style={{ width: `${columnWidths?.time_to || 8}%` }}>Time To</th>
              <th style={{ width: `${columnWidths?.scene || 15}%` }}>Scene</th>
              <th style={{ width: `${columnWidths?.location || 20}%` }}>Location</th>
              <th style={{ width: `${columnWidths?.cast || 25}%` }}>Cast</th>
              <th style={{ width: `${columnWidths?.notes || 24}%` }}>Notes</th>
              <th className="no-print" style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleRowDragEnd}
            >
              <SortableContext
                items={day.rows.map(row => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {day.rows.map((row) => (
                  <ScheduleRow
                    key={row.id}
                    row={row}
                    onUpdateRow={(updatedRow) => handleUpdateRow(row.id, updatedRow)}
                    onRemoveRow={() => handleRemoveRow(row.id)}
                    canRemove={day.rows.length > 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>

      {/* Add Row Buttons */}
      <div className="flex gap-2 p-4 no-print">
        <Button
          onClick={() => handleAddRow('item')}
          variant="outline"
          size="sm"
          data-testid="add-row-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
        <Button
          onClick={() => handleAddRow('text')}
          variant="outline"
          size="sm"
          data-testid="add-text-row-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Text Row
        </Button>
      </div>
    </div>
  );
}

export default DaySection;
