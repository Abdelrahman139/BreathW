import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileImage, X, Loader2, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (file: File) => Promise<void>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('Please upload a valid JPG or PNG image.');
      return;
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      await onAnalyze(file);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
              <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-200">
                Drag & drop a Chest X-Ray
              </p>
              <p className="text-sm text-slate-400 mt-1">or click to browse from your computer</p>
            </div>
            <p className="text-xs text-slate-500">Supports JPG and PNG up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          <div className="flex items-start space-x-6">
            <div className="relative group w-32 h-32 rounded-lg overflow-hidden border border-slate-600 shrink-0 bg-black">
              {preview && <img src={preview} alt="X-Ray Preview" className="w-full h-full object-cover opacity-80" />}
              {!isLoading && (
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-500/80 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-center py-2">
              <div className="flex items-center space-x-3 mb-2">
                <FileImage className="w-5 h-5 text-blue-400" />
                <h4 className="text-slate-200 font-medium truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </h4>
              </div>
              <p className="text-slate-400 text-sm mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is analyzing...
                  </>
                ) : (
                  'Analyze X-Ray'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
