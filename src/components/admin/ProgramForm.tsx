'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save, Upload, Plus, Trash2, Video, X, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export function ProgramForm({ programId }: { programId: string }) {
  const db = useFirestore();
  const storage = getStorage();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const testimonialInputRef = useRef<HTMLInputElement>(null);
  
  const programRef = useMemoFirebase(() => doc(db, 'programs', programId), [db, programId]);
  const { data: program, isLoading } = useDoc(programRef);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    demoVideoUrl: '',
    joinButtonLink: '',
    offerEndTime: '',
    videoTestimonials: ['', '', '', ''],
  });

  const [galleryFiles, setGalleryFiles] = useState<{file: File, preview: string}[]>([]);
  const [testimonialFiles, setTestimonialFiles] = useState<{file: File, preview: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        subtitle: program.subtitle || '',
        demoVideoUrl: program.demoVideoId ? `https://www.youtube.com/watch?v=${program.demoVideoId}` : '',
        joinButtonLink: program.joinButtonLink || '',
        offerEndTime: program.expiryDate || new Date().toISOString(),
        videoTestimonials: program.videoTestimonials || ['', '', '', ''],
      });
    } else if (!isLoading && !formData.offerEndTime) {
      // Set a default date on mount if no program exists yet, only on client
      setFormData(prev => ({ ...prev, offerEndTime: new Date().toISOString() }));
    }
  }, [program, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'testimonial') => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    if (type === 'gallery') {
      setGalleryFiles(prev => [...prev, ...newFiles]);
    } else {
      setTestimonialFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeSelectedFile = (index: number, type: 'gallery' | 'testimonial') => {
    if (type === 'gallery') {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setTestimonialFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeExistingImage = (url: string) => {
    if (!program) return;
    const newGallery = (program.gallery || []).filter((item: string) => item !== url);
    updateDoc(programRef, { gallery: newGallery })
      .catch(e => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: programRef.path,
          operation: 'update',
          requestResourceData: { gallery: newGallery }
        }));
      });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const uploadedGalleryUrls = [];
      for (const item of galleryFiles) {
        const fileRef = ref(storage, `programs/${programId}/gallery/${Date.now()}-${item.file.name}`);
        const snapshot = await uploadBytes(fileRef, item.file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedGalleryUrls.push(url);
      }

      const uploadedTestimonialUrls = [];
      for (const item of testimonialFiles) {
        const fileRef = ref(storage, `programs/${programId}/testimonials/${Date.now()}-${item.file.name}`);
        const snapshot = await uploadBytes(fileRef, item.file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedTestimonialUrls.push(url);
      }

      const currentGallery = program?.gallery || [];
      const currentImageTestimonials = program?.imageTestimonials || [];

      const newImageTestimonials = uploadedTestimonialUrls.map(url => ({
        name: "Verified Student",
        role: "Program Graduate",
        content: "This course provided the breakthrough I needed for my professional development.",
        imageUrl: url
      }));

      const updateData = {
        id: programId,
        title: formData.title,
        subtitle: formData.subtitle,
        demoVideoId: getYouTubeId(formData.demoVideoUrl),
        gallery: [...currentGallery, ...uploadedGalleryUrls],
        videoTestimonials: formData.videoTestimonials.map(v => getYouTubeId(v)),
        imageTestimonials: [...currentImageTestimonials, ...newImageTestimonials],
        joinButtonLink: formData.joinButtonLink,
        expiryDate: formData.offerEndTime || new Date().toISOString(),
      };

      setDoc(programRef, updateData, { merge: true })
        .then(() => {
          toast({ title: "Success", description: "Program content updated successfully." });
          setGalleryFiles([]);
          setTestimonialFiles([]);
        })
        .catch(error => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: programRef.path,
            operation: 'update',
            requestResourceData: updateData
          }));
        });

    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Main headlines and call-to-action details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Master Next.js & React"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea 
              id="subtitle" 
              value={formData.subtitle} 
              onChange={e => setFormData({...formData, subtitle: e.target.value})} 
              placeholder="Brief description of the program..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demo">Demo Video (YouTube URL)</Label>
              <div className="relative">
                <Video className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="demo" 
                  className="pl-9"
                  value={formData.demoVideoUrl} 
                  onChange={e => setFormData({...formData, demoVideoUrl: e.target.value})} 
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="join">Join Button Link</Label>
              <Input 
                id="join" 
                value={formData.joinButtonLink} 
                onChange={e => setFormData({...formData, joinButtonLink: e.target.value})} 
                placeholder="https://checkout.stripe.com/..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Offer End Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.offerEndTime && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.offerEndTime ? format(new Date(formData.offerEndTime), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.offerEndTime ? new Date(formData.offerEndTime) : undefined}
                  onSelect={(date) => date && setFormData({...formData, offerEndTime: date.toISOString()})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery & Visuals</CardTitle>
            <CardDescription>Upload course previews and student images.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2"
            onClick={() => galleryInputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4" />
            Add More Images
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Course Previews ({program?.gallery?.length || 0})</Label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {program?.gallery?.map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group bg-muted">
                  <img src={url} alt="Gallery" className="object-cover w-full h-full" />
                  <button 
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {galleryFiles.map((fileObj, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-primary/50 bg-muted/30">
                  <img src={fileObj.preview} alt="New Preview" className="object-cover w-full h-full opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                  <button 
                    onClick={() => removeSelectedFile(idx, 'gallery')}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <input 
                ref={galleryInputRef}
                type="file" 
                multiple 
                accept="image/*"
                className="hidden" 
                onChange={e => handleFileChange(e, 'gallery')} 
              />
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/10"
              >
                <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Select Files</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Student Profiles ({program?.imageTestimonials?.length || 0})</Label>
            </div>
            <div className="flex flex-wrap gap-4">
              {program?.imageTestimonials?.map((t: any, idx: number) => (
                <div key={idx} className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20 bg-muted">
                  <img src={t.imageUrl} alt="Testimonial" className="object-cover w-full h-full" />
                </div>
              ))}
              {testimonialFiles.map((fileObj, idx) => (
                <div key={`new-t-${idx}`} className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 group bg-muted/30">
                  <img src={fileObj.preview} alt="New Testimonial" className="object-cover w-full h-full opacity-60" />
                  <button 
                    onClick={() => removeSelectedFile(idx, 'testimonial')}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
              <input 
                ref={testimonialInputRef}
                type="file" 
                multiple 
                accept="image/*"
                className="hidden" 
                onChange={e => handleFileChange(e, 'testimonial')} 
              />
              <button 
                onClick={() => testimonialInputRef.current?.click()}
                className="w-16 h-16 border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/10"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Video Testimonials</CardTitle>
          <CardDescription>Set the 4 main YouTube video testimonial IDs.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.videoTestimonials.map((url, idx) => (
            <div key={idx} className="space-y-2">
              <Label htmlFor={`v-${idx}`}>Video {idx + 1}</Label>
              <Input 
                id={`v-${idx}`} 
                value={url} 
                onChange={e => {
                  const newVids = [...formData.videoTestimonials];
                  newVids[idx] = e.target.value;
                  setFormData({...formData, videoTestimonials: newVids});
                }} 
                placeholder="YouTube URL or ID"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-12 h-14 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              UPLOADING & SAVING...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              SAVE PROGRAM CHANGES
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
