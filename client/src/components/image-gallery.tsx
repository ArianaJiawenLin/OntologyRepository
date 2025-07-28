import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { File } from "@shared/schema";

interface ImageGalleryProps {
  files: File[];
}

export default function ImageGallery({ files }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleDownload = (fileId: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/files/${fileId}/download`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      {files.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {files.map((file) => (
            <Dialog key={file.id}>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <img 
                    src={`/uploads/${file.filename}`} 
                    alt={file.originalName}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                  <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-60 px-2 py-1 rounded">
                    {file.originalName}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file.id, file.originalName);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="space-y-4">
                  <img 
                    src={`/uploads/${file.filename}`} 
                    alt={file.originalName}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{file.originalName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(parseInt(file.size) / 1024).toFixed(1)} KB • {file.mimetype}
                      </p>
                    </div>
                    <Button onClick={() => handleDownload(file.id, file.originalName)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm">
          No images uploaded yet
        </div>
      )}
      
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add More Images
      </Button>
    </div>
  );
}
