import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Trash2, Plus } from 'lucide-react';

function CalltimeCardMobile({ calltime, onUpdateCalltime, onRemoveCalltime }) {
  const handleAddRow = (type = 'item') => {
    const newRow = {
      id: Date.now().toString(),
      type,
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
    <Card className="mb-4">
      <CardHeader className="bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{calltime.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveCalltime}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {calltime.rows.map((row) => (
          row.type === 'text' ? (
            <div key={row.id} className="bg-slate-50 p-3 rounded font-semibold">
              <Input
                value={row.name}
                onChange={(e) => handleUpdateRow(row.id, { ...row, name: e.target.value })}
                placeholder="Section headline..."
                className="font-semibold"
              />
            </div>
          ) : (
            <div key={row.id} className="border border-slate-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Row {calltime.rows.indexOf(row) + 1}</span>
                {calltime.rows.length > 1 && (
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
                <label className="text-xs text-slate-600 font-medium">
                  {calltime.headers?.time || 'Time'}
                </label>
                <Input
                  value={row.time}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, time: e.target.value })}
                  placeholder="08:00"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">
                  {calltime.headers?.name || 'Name'}
                </label>
                <Input
                  value={row.name}
                  onChange={(e) => handleUpdateRow(row.id, { ...row, name: e.target.value })}
                  placeholder="Name"
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

export default CalltimeCardMobile;
