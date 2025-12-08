import React from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function PrintView({ project }) {
  return (
    <div className="print-view p-8" style={{ maxWidth: '210mm', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{project.name}</h1>
          {project.notes && (
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{project.notes}</p>
          )}
        </div>
        {project.logo_url && (
          <img
            src={`${BACKEND_URL}${project.logo_url}`}
            alt="Logo"
            className="max-w-[150px] max-h-[80px] object-contain ml-4"
          />
        )}
      </div>

      {/* Schedule */}
      {project.days.map((day) => (
        <div key={day.id} className="schedule-day mb-8">
          <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-900 mb-2">
            {day.date}
          </div>
          <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th
                  className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                  style={{ width: `${project.column_widths?.time || 15}%` }}
                >
                  Time
                </th>
                <th
                  className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                  style={{ width: `${project.column_widths?.scene || 15}%` }}
                >
                  Scene
                </th>
                <th
                  className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                  style={{ width: `${project.column_widths?.location || 23}%` }}
                >
                  Location
                </th>
                <th
                  className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                  style={{ width: `${project.column_widths?.cast || 23}%` }}
                >
                  Cast
                </th>
                <th
                  className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                  style={{ width: `${project.column_widths?.notes || 24}%` }}
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {day.rows.map((row) => (
                row.type === 'text' ? (
                  <tr key={row.id}>
                    <td
                      colSpan="5"
                      className="border border-slate-300 bg-slate-50 px-2 py-1 text-center font-semibold text-sm"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.notes}
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id}>
                    <td
                      className="border border-slate-300 px-2 py-1 text-xs"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.time}
                    </td>
                    <td
                      className="border border-slate-300 px-2 py-1 text-xs"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.scene}
                    </td>
                    <td
                      className="border border-slate-300 px-2 py-1 text-xs"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.location}
                    </td>
                    <td
                      className="border border-slate-300 px-2 py-1 text-xs"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.cast}
                    </td>
                    <td
                      className="border border-slate-300 px-2 py-1 text-xs"
                      style={{
                        overflowWrap: 'anywhere',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {row.notes}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default PrintView;
