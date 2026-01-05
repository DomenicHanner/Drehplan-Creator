import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Trash2, Plus } from 'lucide-react';

function DayCardMobile({ day, onUpdateDay, onRemoveDay, canRemove }) {
  const handleAddRow = (type = 'item') => {
    const newRow = {
      id: Date.now().toString(),
      type,
      time: '',
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
    <Card className="mb-4">
      <CardHeader className="bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{day.date}</CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveDay}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {day.rows.map((row) => (
          row.type === 'text' ? (
            <div key={row.id} className="bg-slate-50 p-3 rounded font-semibold">
              <Input
                value={row.notes}
                onChange={(e) => handleUpdateRow(row.id, { ...row, notes: e.target.value })}
                placeholder="Section headline..."
                className="font-semibold"
              />
            </div>
          ) : (
            <div key={row.id} className="border border-slate-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Row {day.rows.indexOf(row) + 1}</span>
                {day.rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRow(row.id)}
                    className="h-6 text-slate-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Time</label>
                <Input
                  value={row.time}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, time: e.target.value })}
                  placeholder="08:00-10:00"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Scene</label>
                <Input
                  value={row.scene}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, scene: e.target.value })}
                  placeholder="Scene 1A"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Location</label>
                <Input
                  value={row.location}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, location: e.target.value })}
                  placeholder="Location"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Cast</label>
                <Input
                  value={row.cast}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, cast: e.target.value })}
                  placeholder="Cast members"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Notes</label>
                <Input
                  value={row.notes}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, notes: e.target.value })}
                  placeholder="Notes"
                  className="mt-1"
                />
              </div>
            </div>
          )
        ))}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => handleAddRow('item')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
          <Button
            onClick={() => handleAddRow('text')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Text Row
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DayCardMobile;
