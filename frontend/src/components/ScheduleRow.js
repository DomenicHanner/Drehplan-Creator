import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

function ScheduleRow({ row, onUpdateRow, onRemoveRow, canRemove }) {
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

  const locationRef = useRef(null);
  const castRef = useRef(null);
  const notesRef = useRef(null);

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize(locationRef.current);
    autoResize(castRef.current);
    autoResize(notesRef.current);
  }, [row.location, row.cast, row.notes]);

  if (row.type === 'text') {
    return (
      <tr ref={setNodeRef} style={style} className="text-row" data-testid="text-row">
        <td className="no-print">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
            data-testid="row-drag-handle"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </td>
        <td colSpan="5">
          <input
            type="text"
            value={row.notes}
            onChange={(e) => onUpdateRow({ ...row, notes: e.target.value })}
            placeholder="Section headline or note..."
            className="font-semibold"
            data-testid="text-row-input"
          />
        </td>
        <td className="no-print">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveRow}
              className="text-slate-400 hover:text-red-600"
              data-testid="remove-row-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr ref={setNodeRef} style={style} data-testid="schedule-row">
      <td className="no-print">
        <div
          {...attributes}
          {...listeners}
          className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
          data-testid="row-drag-handle"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>
      <td>
        <input
          type="text"
          value={row.time}
          onChange={(e) => onUpdateRow({ ...row, time: e.target.value })}
          placeholder="08:00-10:00"
          data-testid="time-input"
        />
      </td>
      <td>
        <input
          type="text"
          value={row.scene}
          onChange={(e) => onUpdateRow({ ...row, scene: e.target.value })}
          placeholder="Scene 1A"
          data-testid="scene-input"
        />
      </td>
      <td>
        <textarea
          ref={locationRef}
          value={row.location}
          onChange={(e) => {
            onUpdateRow({ ...row, location: e.target.value });
          }}
          placeholder="Location"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="location-input"
        />
      </td>
      <td>
        <textarea
          ref={castRef}
          value={row.cast}
          onChange={(e) => {
            onUpdateRow({ ...row, cast: e.target.value });
          }}
          placeholder="Cast members"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="cast-input"
        />
      </td>
      <td>
        <textarea
          ref={notesRef}
          value={row.notes}
          onChange={(e) => {
            onUpdateRow({ ...row, notes: e.target.value });
          }}
          placeholder="Notes"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="notes-input"
        />
      </td>
      <td className="no-print">
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveRow}
            className="text-slate-400 hover:text-red-600"
            data-testid="remove-row-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

export default ScheduleRow;
