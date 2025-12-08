import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Save, FolderOpen, FileDown, Printer, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import ColumnWidthControls from './ColumnWidthControls';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function Toolbar({ project, onProjectChange, onSave, onBrowse, onExportCSV, onPrint, unsavedChanges, saving }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error('Only JPG and PNG files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BACKEND_URL}/api/uploads/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onProjectChange({ ...project, logo_url: response.data.url });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="no-print bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Project Info */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Input
                type="text"
                value={project.name}
                onChange={(e) => onProjectChange({ ...project, name: e.target.value })}
                className="text-xl font-semibold text-slate-900 border-none shadow-none px-0 focus-visible:ring-2 focus-visible:ring-blue-600"
                placeholder="Project Name"
                data-testid="project-name-input"
              />
              {unsavedChanges && (
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  Unsaved
                </span>
              )}
              {!unsavedChanges && project.id && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
            <Textarea
              value={project.notes}
              onChange={(e) => onProjectChange({ ...project, notes: e.target.value })}
              className="text-sm text-slate-600 border-none shadow-none px-0 resize-none focus-visible:ring-2 focus-visible:ring-blue-600"
              placeholder="Add project notes..."
              rows={2}
              data-testid="project-notes-input"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
                data-testid="logo-upload-input"
              />
              <Label htmlFor="logo-upload">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  asChild
                  data-testid="upload-logo-button"
                >
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingLogo ? 'Uploading...' : 'Logo'}
                  </span>
                </Button>
              </Label>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onBrowse}
              data-testid="browse-projects-button"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Browse
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              disabled={!project.id}
              data-testid="export-csv-button"
            >
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              data-testid="print-button"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>

            <Button
              size="sm"
              onClick={onSave}
              disabled={saving}
              data-testid="save-project-button"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Logo Preview */}
        {project.logo_url && (
          <div className="mt-3 flex items-center gap-2">
            <img
              src={project.logo_url}
              alt="Project Logo"
              className="h-12 object-contain"
              data-testid="logo-preview"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onProjectChange({ ...project, logo_url: '' })}
              data-testid="remove-logo-button"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
