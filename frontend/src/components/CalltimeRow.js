import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

function CalltimeRow({ row, onUpdateRow, onRemoveRow, canRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Text row type for calltime
  if (row.type === 'text') {
    return (
      <tr ref={setNodeRef} style={style} className="text-row" data-testid="calltime-text-row">
        <td className="no-print">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
            data-testid="calltime-row-drag-handle"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </td>
        <td colSpan="2">
          <input
            type="text"
            value={row.name}
            onChange={(e) => onUpdateRow({ ...row, name: e.target.value })}
            placeholder="Section headline or note..."
            className="font-semibold"
            data-testid="calltime-text-row-input"
          />
        </td>
        <td className="no-print">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveRow}
              className="text-slate-400 hover:text-red-600"
              data-testid="remove-calltime-row-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr ref={setNodeRef} style={style} data-testid="calltime-row">
      <td className="no-print">
        <div
          {...attributes}
          {...listeners}
          className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
          data-testid="calltime-row-drag-handle"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>
      <td>
        <input
          type="text"
          value={row.time}
          onChange={(e) => onUpdateRow({ ...row, time: e.target.value })}
          placeholder="08:00"
          data-testid="calltime-time-input"
        />
      </td>
      <td>
        <input
          type="text"
          value={row.name}
          onChange={(e) => onUpdateRow({ ...row, name: e.target.value })}
          placeholder="Name"
          data-testid="calltime-name-input"
        />
      </td>
      <td className="no-print">
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveRow}
            className="text-slate-400 hover:text-red-600"
            data-testid="remove-calltime-row-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

export default CalltimeRow;
