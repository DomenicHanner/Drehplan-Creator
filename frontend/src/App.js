import React, { useState, useEffect } from 'react';
import './App.css';
import ScheduleEditor from './components/ScheduleEditor';
import ProjectBrowser from './components/ProjectBrowser';
import Toolbar from './components/Toolbar';
import PrintView from './components/PrintView';
import axios from 'axios';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState({ active: [], archived: [] });
  const [showBrowser, setShowBrowser] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize with new project
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const newProject = {
      name: 'Untitled Project',
      notes: '',
      logo_url: '',
      column_widths: {
        time: 15,
        scene: 15,
        location: 23,
        cast: 23,
        notes: 24
      },
      column_headers: {
        time: 'Time',
        scene: 'Scene',
        location: 'Location',
        cast: 'Cast',
        notes: 'Notes'
      },
      calltime_headers: {
        time: 'Time',
        name: 'Name'
      },
      days: [
        {
          id: Date.now().toString(),
          date: formattedDate,
          rows: [
            {
              id: Date.now().toString() + '-1',
              type: 'item',
              time: '',
              scene: '',
              location: '',
              cast: '',
              notes: ''
            }
          ]
        }
      ],
      calltimes: []
    };
    
    setCurrentProject(newProject);
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/projects?include_archived=true`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const handleProjectChange = (updatedProject) => {
    setCurrentProject(updatedProject);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!currentProject) return;
    
    setSaving(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/projects/save`, currentProject);
      setCurrentProject(response.data);
      setUnsavedChanges(false);
      toast.success('Project saved successfully');
      await loadProjects();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadProject = async (projectId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/projects/${projectId}`);
      setCurrentProject(response.data);
      setUnsavedChanges(false);
      setShowBrowser(false);
      toast.success('Project loaded');
    } catch (error) {
      console.error('Load failed:', error);
      toast.error('Failed to load project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/projects/${projectId}`);
      toast.success('Project deleted');
      await loadProjects();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleExportCSV = async () => {
    if (!currentProject || !currentProject.id) {
      toast.error('Please save the project first');
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/projects/${currentProject.id}/export.csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentProject.name}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setShowPrintView(false);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  if (!currentProject) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (showPrintView) {
    return <PrintView project={currentProject} />;
  }

  return (
    <div className="App">
      <Toolbar
        project={currentProject}
        onProjectChange={handleProjectChange}
        onSave={handleSave}
        onBrowse={() => setShowBrowser(true)}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        unsavedChanges={unsavedChanges}
        saving={saving}
      />
      
      <div className="container mx-auto px-4 py-6">
        <ScheduleEditor
          project={currentProject}
          onProjectChange={handleProjectChange}
        />
      </div>

      {showBrowser && (
        <ProjectBrowser
          projects={projects}
          onClose={() => setShowBrowser(false)}
          onLoad={handleLoadProject}
          onDelete={handleDeleteProject}
        />
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
