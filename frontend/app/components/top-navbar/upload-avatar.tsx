"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

import { useState, ChangeEvent, useTransition, memo } from "react";

import Image from "next/image";

import { Loader2Icon, Upload, UploadIcon } from "lucide-react";
import { cx } from "class-variance-authority";
import { uploadAvatar } from "./_actions/account";
import { Button } from "../ui/button";

function ImageIsEmtpy({ width, height }: { width: number; height: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <UploadIcon
        strokeWidth={1}
        size={32}
        className="mb-3 text-muted-foreground"
      />
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Upload Avatar</span>
      </p>
      <p className="text-xs text-gray-500">
        png, jpeg หรือ jpg (size {width}x{height}px)
      </p>
    </div>
  );
}

const ImageLoading = memo(function ImageLoading() {
  return (
    <div className="absolute top-0 left-0 z-10 w-full h-full bg-white/30 backdrop-blur-sm">
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="animate-spin text-primary" size={42} />
      </div>
    </div>
  );
});

export function ImageUpload(props: any) {
  const { width, height, type, logo, setOpen, setUrl } = props;

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File>();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !isValidImage(file)) {
      return;
    }
    setFile(file);
    const imagesUrl = URL.createObjectURL(file);
    setUrl(imagesUrl);
  };

  const handleSubmit = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file as File);

    const res = await uploadAvatar(formData);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Avatar uploaded.");
  };

  const isValidImage = (file: File): boolean => {
    setError(null);
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedImageTypes.includes(file.type)) {
      setError("file type must be jpg, jpeg or png");
      return false;
    }

    if (file.size > 1024 * 1024 * 2) {
      setError("file must be under 2MB");
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center w-full group">
        <label
          htmlFor={`dropzone-file-${type}-${width}-${height}`}
          className={cx({
            "relative flex flex-col items-center justify-center w-full border-2  border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-primary-foreground":
              true,
            "border-red-500": error,
            "border-gray-200": !error,
          })}
        >
          {isPending && <ImageLoading />}
          {<ImageIsEmtpy width={width} height={height} />}
          <input
            id={`dropzone-file-${type}-${width}-${height}`}
            type="file"
            className="hidden"
            onChange={(e) => handleUpload(e)}
            accept="image/png, image/jpeg, image/jpg"
            disabled={isPending}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 text-xs font-medium text-red-500">{error}</div>
      )}
      <Button onClick={handleSubmit} className="mt-2">
        <Upload />
      </Button>
    </div>
  );
}

export function UploadAvatar(props: any) {
  const { open, setOpen } = props;
  const [url, setUrl] = React.useState<string>("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>
        <ImageUpload
          type="original"
          width={120}
          height={120}
          setOpen={setOpen}
          logo={url}
          setUrl={setUrl}
        />
      </DialogContent>
    </Dialog>
  );
}
