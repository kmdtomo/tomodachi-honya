"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AdminFormModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  isSubmitting?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitLabel?: string;
  maxWidth?: string;
  showSubmitButton?: boolean;
};

export function AdminFormModal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  isSubmitting = false,
  onSubmit,
  submitLabel = "保存",
  maxWidth = "900px",
  showSubmitButton = true,
}: AdminFormModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-black text-white max-h-[80vh] overflow-y-auto" 
        style={{ width: "90vw", maxWidth }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {children}

          {showSubmitButton && (
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-24 border border-gray-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    送信中...
                  </div>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}