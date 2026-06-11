'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlowUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  loading?: boolean;
}

export const GlowUpload: React.FC<GlowUploadProps> = ({
  onFileSelect,
  selectedFile,
  loading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer select-none",
        isDragging
          ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 hover:border-emerald-400 dark:hover:border-emerald-600/50"
      )}
    >
      <UploadCloud className={cn("size-8 transition-transform duration-300", isDragging ? "text-emerald-500 scale-105" : "text-zinc-400")} />
      
      <p className="text-xs text-zinc-500">
        Arraste seu arquivo .ofx aqui ou 
        <span className="text-emerald-500 font-semibold underline ml-1">procure nos seus arquivos</span>
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".ofx"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />

      {selectedFile && (
        <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-1 rounded text-emerald-600 dark:text-emerald-400 mt-1">
          {selectedFile.name}
        </span>
      )}
    </div>
  );
};
