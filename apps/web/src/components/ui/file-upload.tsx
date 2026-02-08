'use client';

import * as React from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  value: File | null;
  required?: boolean;
  className?: string;
}

export function FileUpload({ accept, onChange, value, required, className }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        required={required}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center w-full h-32 px-4 transition-colors border-2 border-dashed rounded-lg cursor-pointer",
          value
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 bg-background hover:bg-accent"
        )}
      >
        {value ? (
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center gap-3 flex-1">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{value.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(value.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {accept?.split(',').join(', ').toUpperCase() || 'Any file'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
