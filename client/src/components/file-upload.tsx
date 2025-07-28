import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File as FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  category: string;
  section: string;
  onUpload?: () => void;
}

export default function FileUpload({ category, section, onUpload }: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [metadata, setMetadata] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Auto-detect file type based on extension and mimetype
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      const mimetype = selectedFile.type;
      
      if (mimetype.startsWith('image/')) {
        setFileType('image');
      } else if (extension === 'json' || mimetype === 'application/json') {
        setFileType('json');
      } else if (extension === 'txt' || mimetype === 'text/plain') {
        setFileType('text');
      } else if (extension === 'owl' || extension === 'fol') {
        setFileType('ontology');
      } else if (extension === 'tptp') {
        setFileType('tptp');
      } else {
        setFileType('other');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !fileType) {
      toast({
        title: "Error",
        description: "Please select a file and file type",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('section', section);
      formData.append('fileType', fileType);
      if (metadata) {
        formData.append('metadata', metadata);
      }

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      setFile(null);
      setFileType("");
      setMetadata("");
      setIsOpen(false);
      onUpload?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.gif,.json,.txt,.owl,.fol,.tptp,.csv,.pdf"
            />
            {file && (
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <FileIcon className="h-4 w-4 mr-2" />
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="fileType">File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="json">JSON (Scene Graph)</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="ontology">Ontology (OWL/FOL)</SelectItem>
                <SelectItem value="tptp">TPTP</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="metadata">Metadata (optional)</Label>
            <Textarea
              id="metadata"
              placeholder="Enter metadata as JSON or description..."
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || !fileType || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
