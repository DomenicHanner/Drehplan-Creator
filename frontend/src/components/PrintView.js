import React from 'react';
import { 
  Calendar, 
  Clock, 
  Home, 
  User, 
  Car, 
  AlertTriangle, 
  Camera,
  Phone,
  Mail,
  AlertCircle,
  Coffee,
  Sandwich,
  Sun,
  Moon
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const getIconComponent = (iconName) => {
  const icons = {
    calendar: Calendar,
    clock: Clock,
    home: Home,
    user: User,
    car: Car,
    alert: AlertTriangle,
    camera: Camera,
    phone: Phone,
    mail: Mail,
    alertcircle: AlertCircle,
    coffee: Coffee,
    burger: Sandwich,
    sun: Sun,
    moon: Moon,
  };
  return icons[iconName] || Calendar;
};

function PrintView({ project }) {
  // Combine and sort by position (same as ScheduleEditor)
  const allItems = [
    ...project.days.map(day => ({ ...day, itemType: 'day' })),
    ...(project.calltimes || []).map(ct => ({ ...ct, itemType: 'calltime' })),
    ...(project.crewInfos || []).map(ci => ({ ...ci, itemType: 'crewInfo' }))
  ].sort((a, b) => (a.position || 0) - (b.position || 0));

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

      {/* Schedule, Calltimes and Crew Infos in correct order */}
      {allItems.map((item) => (
        item.itemType === 'day' ? (
          <div key={item.id} className="schedule-day mb-8">
            <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-900 mb-2 flex items-center gap-2">
              {(() => {
                const IconComponent = getIconComponent(item.icon);
                return <IconComponent className="h-4 w-4" />;
              })()}
              {item.date}
            </div>
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: `${project.column_widths?.time || 15}%` }}
                  >
                    {project.column_headers?.time || 'Time'}
                  </th>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: `${project.column_widths?.scene || 15}%` }}
                  >
                    {project.column_headers?.scene || 'Scene'}
                  </th>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: `${project.column_widths?.location || 23}%` }}
                  >
                    {project.column_headers?.location || 'Location'}
                  </th>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: `${project.column_widths?.cast || 23}%` }}
                  >
                    {project.column_headers?.cast || 'Cast'}
                  </th>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: `${project.column_widths?.notes || 24}%` }}
                  >
                    {project.column_headers?.notes || 'Notes'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row) => (
                  row.type === 'text' ? (
                    <tr key={row.id}>
                      <td
                        colSpan="5"
                        className="border border-slate-300 bg-slate-50 px-2 py-1 text-left font-semibold text-sm"
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
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {row.time}
                      </td>
                      <td
                        className="border border-slate-300 px-2 py-1 text-xs"
                        style={{
                          overflowWrap: 'anywhere',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {row.scene}
                      </td>
                      <td
                        className="border border-slate-300 px-2 py-1 text-xs"
                        style={{
                          overflowWrap: 'anywhere',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {row.location}
                      </td>
                      <td
                        className="border border-slate-300 px-2 py-1 text-xs"
                        style={{
                          overflowWrap: 'anywhere',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {row.cast}
                      </td>
                      <td
                        className="border border-slate-300 px-2 py-1 text-xs"
                        style={{
                          overflowWrap: 'anywhere',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap'
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
        ) : item.itemType === 'calltime' ? (
          <div key={item.id} className="calltime-section mb-8">
            <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-900 mb-2 flex items-center gap-2">
              {(() => {
                const IconComponent = getIconComponent(item.icon);
                return <IconComponent className="h-4 w-4" />;
              })()}
              {item.title}
            </div>
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: '15%' }}
                  >
                    {item.headers?.time || 'Time'}
                  </th>
                  <th
                    className="border border-slate-300 bg-slate-50 px-2 py-1 text-left text-xs font-semibold"
                    style={{ width: '85%' }}
                  >
                    {item.headers?.name || 'Name'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row) => (
                  row.type === 'text' ? (
                    <tr key={row.id}>
                      <td
                        colSpan="2"
                        className="border border-slate-300 bg-slate-50 px-2 py-1 text-left font-semibold text-sm"
                        style={{
                          overflowWrap: 'anywhere',
                          wordWrap: 'break-word',
                          whiteSpace: 'normal'
                        }}
                      >
                        {row.name}
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
                        {row.name}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  );
}

export default PrintView;
