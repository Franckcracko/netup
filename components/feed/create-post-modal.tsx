'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useState, useRef } from 'react';
import { X, ImageIcon, Smile } from 'lucide-react';
import { Button } from '../ui/button';
// import { validatePostContent } from '../../utils/validation';

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal = ({ isOpen, onOpenChange }: CreatePostModalProps) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const contentError = validatePostContent(content);
    // if (contentError) {
    //   setError(contentError);
    //   return;
    // }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      // createPost(content, selectedImage || undefined);

      // Reset form
      setContent('');
      setSelectedImage(null);
      setError('');
      onOpenChange(false);
    } catch {
      setError('Error al crear el post. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedImage(null);
    setError('');
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Crear nuevo post
          </DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <img
              src={'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
              alt={''}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-white font-medium">{'fullname'}</p>
              <p className="text-gray-400 text-sm">@{'user?.username'}</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            placeholder="¿Qué está pasando?"
            className="w-full bg-transparent text-white text-lg placeholder-gray-400 resize-none border-none outline-none"
            rows={4}
            maxLength={280}
          />

          <div className="text-right text-sm text-gray-400 mb-4">
            {content.length}/280
          </div>

          {selectedImage && (
            <div className="relative mb-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full rounded-lg max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-400 hover:bg-gray-700 transition-colors"
              >
                Agregar imagen
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                className="text-purple-400 hover:bg-gray-700 transition-colors"
                title="Agregar emoji"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!content.trim() || content.length > 280}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </form>
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;