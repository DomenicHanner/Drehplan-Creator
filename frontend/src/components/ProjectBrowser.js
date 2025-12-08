import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { FolderOpen, Trash2, Calendar, Archive, ArchiveRestore } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import axios from 'axios';
import { toast } from 'sonner';

function ProjectBrowser({ projects, onClose, onLoad, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);
  const [archivingId, setArchivingId] = useState(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleArchiveToggle = async (projectId, isArchived) => {
    setArchivingId(projectId);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      await axios.post(`${BACKEND_URL}/api/projects/${projectId}/archive`);
      toast.success(isArchived ? 'Project unarchived' : 'Project archived');
      // Reload projects
      window.location.reload();
    } catch (error) {
      console.error('Archive toggle failed:', error);
      toast.error('Failed to archive/unarchive project');
    } finally {
      setArchivingId(null);
    }
  };

  const ProjectList = ({ items, isArchived }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-slate-500">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No projects found</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            data-testid="project-item"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project.day_count} {project.day_count === 1 ? 'day' : 'days'}
                </span>
                <span>Updated: {project.updated_at}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => onLoad(project.id)}
                size="sm"
                data-testid="load-project-button"
              >
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleArchiveToggle(project.id, isArchived)}
                disabled={archivingId === project.id}
                className="text-slate-600 hover:text-slate-900"
                data-testid="archive-project-button"
              >
                {isArchived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-1" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteId(project.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="delete-project-button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Browse Projects</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="active" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="active" data-testid="active-tab">
                Active ({projects.active.length})
              </TabsTrigger>
              <TabsTrigger value="archived" data-testid="archived-tab">
                Archived ({projects.archived.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <ProjectList items={projects.active} />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <ProjectList items={projects.archived} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProjectBrowser;
