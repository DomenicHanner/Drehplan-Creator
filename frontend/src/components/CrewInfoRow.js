import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

function CrewInfoRow({ row, onUpdateRow, onRemoveRow, canRemove }) {
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

  const nameRef = useRef(null);
  const crewRef = useRef(null);
  const infoRef = useRef(null);

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize(nameRef.current);
    autoResize(crewRef.current);
    autoResize(infoRef.current);
  }, [row.name, row.crew, row.info]);

  // Text row type
  if (row.type === 'text') {
    return (
      <tr ref={setNodeRef} style={style} className="text-row" data-testid="crew-info-text-row">
        <td className="no-print">
          <div
            {...attributes}
            {...listeners}
            className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
            data-testid="crew-info-row-drag-handle"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </td>
        <td colSpan="3">
          <input
            type="text"
            value={row.name}
            onChange={(e) => onUpdateRow({ ...row, name: e.target.value })}
            placeholder="Section headline or note..."
            className="font-semibold"
            data-testid="crew-info-text-row-input"
          />
        </td>
        <td className="no-print">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveRow}
              className="text-slate-400 hover:text-red-600"
              data-testid="remove-crew-info-row-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr ref={setNodeRef} style={style} data-testid="crew-info-row">
      <td className="no-print">
        <div
          {...attributes}
          {...listeners}
          className="drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
          data-testid="crew-info-row-drag-handle"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>
      <td>
        <textarea
          ref={nameRef}
          value={row.name}
          onChange={(e) => {
            onUpdateRow({ ...row, name: e.target.value });
          }}
          placeholder="Name"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="crew-info-name-input"
        />
      </td>
      <td>
        <textarea
          ref={crewRef}
          value={row.crew}
          onChange={(e) => {
            onUpdateRow({ ...row, crew: e.target.value });
          }}
          placeholder="Crew"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="crew-info-crew-input"
        />
      </td>
      <td>
        <textarea
          ref={infoRef}
          value={row.info}
          onChange={(e) => {
            onUpdateRow({ ...row, info: e.target.value });
          }}
          placeholder="Info"
          style={{ 
            minHeight: '24px', 
            height: 'auto', 
            resize: 'none',
            overflow: 'hidden'
          }}
          data-testid="crew-info-info-input"
        />
      </td>
      <td className="no-print">
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveRow}
            className="text-slate-400 hover:text-red-600"
            data-testid="remove-crew-info-row-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

export default CrewInfoRow;
