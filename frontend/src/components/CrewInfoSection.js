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
import CrewInfoRow from './CrewInfoRow';
import IconPicker from './IconPicker';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

function CrewInfoSection({ crewInfo, onUpdateCrewInfo, onRemoveCrewInfo, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: crewInfo.id });

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
      const oldIndex = crewInfo.rows.findIndex((row) => row.id === active.id);
      const newIndex = crewInfo.rows.findIndex((row) => row.id === over.id);

      const newRows = arrayMove(crewInfo.rows, oldIndex, newIndex);
      onUpdateCrewInfo({ ...crewInfo, rows: newRows });
    }
  };

  const handleAddRow = (type = 'item') => {
    const newRow = {
      id: Date.now().toString(),
      type,
      name: '',
      crew: '',
      info: ''
    };

    onUpdateCrewInfo({ ...crewInfo, rows: [...crewInfo.rows, newRow] });
  };

  const handleRemoveRow = (rowId) => {
    onUpdateCrewInfo({
      ...crewInfo,
      rows: crewInfo.rows.filter(row => row.id !== rowId)
    });
  };

  const handleUpdateRow = (rowId, updatedRow) => {
    onUpdateCrewInfo({
      ...crewInfo,
      rows: crewInfo.rows.map(row => row.id === rowId ? updatedRow : row)
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="crew-info-section mb-8 bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Crew Info Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 no-print"
            data-testid="crew-info-drag-handle"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <IconPicker
            currentIcon={crewInfo.icon || 'phone'}
            onSelectIcon={(iconName) => onUpdateCrewInfo({ ...crewInfo, icon: iconName })}
          />
          <Input
            type="text"
            value={crewInfo.title}
            onChange={(e) => onUpdateCrewInfo({ ...crewInfo, title: e.target.value })}
            className="font-semibold text-slate-900 w-60 border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-600"
            placeholder="Crew Info Title"
            data-testid="crew-info-title-input"
          />
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveCrewInfo}
            className="no-print text-slate-600 hover:text-red-600"
            data-testid="remove-crew-info-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Crew Info Table */}
      <div className="overflow-visible">
        <table className="schedule-table w-full">
          <thead>
            <tr>
              <th className="no-print" style={{ width: '40px' }}></th>
              <th style={{ width: '25%' }}>
                <input
                  type="text"
                  value={crewInfo.headers?.name || 'Name'}
                  onChange={(e) => onUpdateCrewInfo({ 
                    ...crewInfo, 
                    headers: { ...crewInfo.headers, name: e.target.value } 
                  })}
                  className="font-semibold text-xs bg-transparent border-none w-full focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 rounded"
                  placeholder="Name"
                />
              </th>
              <th style={{ width: '20%' }}>
                <input
                  type="text"
                  value={crewInfo.headers?.crew || 'Crew'}
                  onChange={(e) => onUpdateCrewInfo({ 
                    ...crewInfo, 
                    headers: { ...crewInfo.headers, crew: e.target.value } 
                  })}
                  className="font-semibold text-xs bg-transparent border-none w-full focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 rounded"
                  placeholder="Crew"
                />
              </th>
              <th style={{ width: '55%' }}>
                <input
                  type="text"
                  value={crewInfo.headers?.info || 'Info'}
                  onChange={(e) => onUpdateCrewInfo({ 
                    ...crewInfo, 
                    headers: { ...crewInfo.headers, info: e.target.value } 
                  })}
                  className="font-semibold text-xs bg-transparent border-none w-full focus:outline-none focus:ring-1 focus:ring-blue-600 px-1 rounded"
                  placeholder="Info"
                />
              </th>
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
                items={crewInfo.rows.map(row => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {crewInfo.rows.map((row) => (
                  <CrewInfoRow
                    key={row.id}
                    row={row}
                    onUpdateRow={(updatedRow) => handleUpdateRow(row.id, updatedRow)}
                    onRemoveRow={() => handleRemoveRow(row.id)}
                    canRemove={crewInfo.rows.length > 1}
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
          data-testid="add-crew-info-row-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
        <Button
          onClick={() => handleAddRow('text')}
          variant="outline"
          size="sm"
          data-testid="add-crew-info-text-row-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Text Row
        </Button>
      </div>
    </div>
  );
}

export default CrewInfoSection;
