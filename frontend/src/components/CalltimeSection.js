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
import CalltimeRow from './CalltimeRow';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GripVertical, Plus, Trash2, Clock } from 'lucide-react';

function CalltimeSection({ calltime, onUpdateCalltime, onRemoveCalltime, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: calltime.id });

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
      const oldIndex = calltime.rows.findIndex((row) => row.id === active.id);
      const newIndex = calltime.rows.findIndex((row) => row.id === over.id);

      const newRows = arrayMove(calltime.rows, oldIndex, newIndex);
      onUpdateCalltime({ ...calltime, rows: newRows });
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now().toString(),
      time: '',
      name: ''
    };

    onUpdateCalltime({ ...calltime, rows: [...calltime.rows, newRow] });
  };

  const handleRemoveRow = (rowId) => {
    onUpdateCalltime({
      ...calltime,
      rows: calltime.rows.filter(row => row.id !== rowId)
    });
  };

  const handleUpdateRow = (rowId, updatedRow) => {
    onUpdateCalltime({
      ...calltime,
      rows: calltime.rows.map(row => row.id === rowId ? updatedRow : row)
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="calltime-section mb-8 bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Calltime Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 no-print"
            data-testid="calltime-drag-handle"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <Clock className="h-5 w-5 text-slate-600" />
          <Input
            type="text"
            value={calltime.title}
            onChange={(e) => onUpdateCalltime({ ...calltime, title: e.target.value })}
            className="font-semibold text-slate-900 w-60 border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-600"
            placeholder="Calltime Title"
            data-testid="calltime-title-input"
          />
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveCalltime}
            className="no-print text-slate-600 hover:text-red-600"
            data-testid="remove-calltime-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Calltime Table */}
      <div className="overflow-visible">
        <table className="schedule-table w-full">
          <thead>
            <tr>
              <th className="no-print" style={{ width: '40px' }}></th>
              <th style={{ width: '15%' }}>Time</th>
              <th style={{ width: '85%' }}>Name</th>
              <th className="no-print" style={{ width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleRowDragEnd}
            >
              <SortableContext
                items={calltime.rows.map(row => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {calltime.rows.map((row) => (
                  <CalltimeRow
                    key={row.id}
                    row={row}
                    onUpdateRow={(updatedRow) => handleUpdateRow(row.id, updatedRow)}
                    onRemoveRow={() => handleRemoveRow(row.id)}
                    canRemove={calltime.rows.length > 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="flex gap-2 p-4 no-print">
        <Button
          onClick={handleAddRow}
          variant="outline"
          size="sm"
          data-testid="add-calltime-row-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
    </div>
  );
}

export default CalltimeSection;
