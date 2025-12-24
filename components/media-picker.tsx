"use client";

import { useState, useEffect, useRef } from "react";
import { BunnyFile, listFiles, getFileUrl, deleteFile, createFolder } from "@/app/actions/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Trash2,
  Check,
  File as FileIcon,
  Loader2,
  UploadCloud,
  Search,
  FolderPlus,
  Folder,
  ArrowLeft,
  CornerLeftUp
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface MediaPickerProps {
  onChange: (url: string) => void;
}

export const MediaPicker = ({ onChange }: MediaPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<BunnyFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation states
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Deleting state
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const result = await listFiles(currentPath);
      if (result.success && result.data) {
        // Sort: Directories first, then files
        const sortedFiles = result.data.sort((a, b) => {
          if (a.IsDirectory === b.IsDirectory) {
            return a.ObjectName.localeCompare(b.ObjectName);
          }
          return a.IsDirectory ? -1 : 1;
        });
        setFiles(sortedFiles);
      } else {
        toast.error(result.error || "Failed to fetch files");
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, currentPath]);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file || file.size === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      const promise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percentage);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error"));
        });

        xhr.open("POST", "/api/admin/upload");
        xhr.setRequestHeader("x-file-name", file.name);
        xhr.setRequestHeader("x-file-path", currentPath); // Pass current path
        xhr.send(file);
      });

      await promise;

      toast.success("File uploaded successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchFiles(); // Refresh list
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to parent form
    if (!newFolderName.trim()) return;

    try {
      const result = await createFolder(currentPath, newFolderName);
      if (result.success) {
        toast.success("Folder created successfully");
        setNewFolderName("");
        setIsCreatingFolder(false);
        fetchFiles();
      } else {
        toast.error(result.error || "Failed to create folder");
      }
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    // Construct full path for deletion
    const fullPath = currentPath + fileName;

    setIsDeleting(fileName);
    try {
      const result = await deleteFile(fullPath);
      if (result.success) {
        toast.success("File deleted successfully");
        fetchFiles();
      } else {
        toast.error(result.error || "Failed to delete file");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSelect = async (file: BunnyFile) => {
    if (file.IsDirectory) {
      // Navigate into directory
      setCurrentPath((prev) => prev + file.ObjectName + "/");
    } else {
      // Select file
      try {
        // We need the full path to generate the URL correctly if we are in a subfolder
        // However, listFiles usually returns ObjectName as just the name. 
        // Let's assume getFileUrl needs the full path relative to the zone.
        const fullPath = currentPath + file.ObjectName;
        const url = await getFileUrl(fullPath);
        onChange(url);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get file URL");
      }
    }
  };

  const handleGoBack = () => {
    // Remove last segment
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    const newPath = parts.length > 0 ? parts.join("/") + "/" : "";
    setCurrentPath(newPath);
  };

  const filteredFiles = files.filter((file) =>
    file.ObjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalTrigger asChild>

          <Button type="button" variant="outline" className="w-full h-24 border-dashed border-2 flex flex-col gap-2 items-center justify-center text-muted-foreground hover:text-foreground">
            <UploadCloud className="w-8 h-8" />
            <span>Select Media</span>
          </Button>

        </ModalTrigger>
        <ModalContent className="max-w-7xl flex flex-col p-0 gap-0 rounded-md">
          <ModalHeader className="px-6 py-4 border-b">
            <ModalTitle>Select Media</ModalTitle>
          </ModalHeader>
          <div className="flex-1 overflow-hidden h-full p-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {/* Top Controls: Search and Navigation */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGoBack}
                      disabled={!currentPath}
                      title="Go Up"
                    >
                      <CornerLeftUp className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium px-2 py-1 bg-muted rounded">
                      /{currentPath}
                    </div>
                  </div>

                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      className="pl-8"
                    />
                  </div>

                  <div className="flex gap-2">

                    <Modal open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
                      <ModalTrigger asChild>
                        <Button type="button" variant="outline" onClick={() => setIsCreatingFolder(true)}>
                          <FolderPlus className="h-4 w-4 mr-2" />
                          New Folder
                        </Button>
                      </ModalTrigger>
                      <ModalContent className="max-w-3xl flex flex-col p-0 gap-0 rounded-md">
                        <ModalHeader className="px-6 py-4 border-b">
                          <ModalTitle>Create New Folder</ModalTitle>
                        </ModalHeader>
                        <div className="flex-1 overflow-hidden h-full p-6">
                          <form onSubmit={handleCreateFolder} className="space-y-4">
                            <Input
                              placeholder="Folder Name"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <Button type="submit">Create</Button>
                          </form>
                        </div>
                      </ModalContent>
                    </Modal>



                  </div>
                </div>

                {/* Upload Area */}
                <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input ref={fileInputRef} id="file" name="file" type="file" disabled={isUploading} />
                      </div>
                      <Button type="button" onClick={handleUpload} disabled={isUploading}>
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : files.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No files found in this folder
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFiles.map((file) => (
                        <TableRow key={file.Guid}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {file.IsDirectory ? (
                              <Folder className="h-4 w-4 text-blue-500 fill-blue-500" />
                            ) : (
                              <FileIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span
                              className={`truncate max-w-[300px] cursor-pointer hover:underline ${file.IsDirectory ? 'font-semibold' : ''}`}
                              onClick={() => handleSelect(file)}
                            >
                              {file.ObjectName}
                            </span>
                          </TableCell>
                          <TableCell>{file.IsDirectory ? "-" : formatBytes(file.Length)}</TableCell>
                          <TableCell>{file.IsDirectory ? "Directory" : "File"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleSelect(file)}
                                className={file.IsDirectory ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-sky-600 hover:bg-sky-700 text-white"}
                              >
                                {file.IsDirectory ? (
                                  "Open"
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Select
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(file.ObjectName)}
                                disabled={isDeleting === file.ObjectName}
                                title="Delete"
                              >
                                {isDeleting === file.ObjectName ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

    </>
  );
};
