"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { UploadDropzone } from "@/components/uploadthing";
import { Progress } from "../ui/progress";
import { toast } from "../ui/use-toast";

export function UploadAvatar(props: any) {
  const { open, setOpen } = props;
  const [url, setUrl] = React.useState<string>("");
  const [progress, setProgress] = React.useState<number>(0);

  const handleUpdateAvatar = async () => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Upload Avatar</DialogHeader>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            setUrl(res![0].url);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
          }}
          config={{
            mode: "auto",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
