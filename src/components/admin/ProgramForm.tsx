
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useDoc, useMemoFirebase, useStorage } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save, Upload, Plus, Trash2, Video, X, ImagePlus, ListPlus, HelpCircle, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Feature, FAQItem } from '@/lib/db';

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export function ProgramForm({ programId }: { programId: string }) {
  const db = useFirestore();
  const storage = useStorage();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const testimonialInputRef = useRef<HTMLInputElement>(null);
  
  const programRef = useMemoFirebase(() => doc(db, 'programs', programId), [db, programId]);
  const { data: program, isLoading } = useDoc(programRef);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    titleFontSize: 80,
    subtitleFontSize: 24,
    lineHeight: 1.1,
    letterSpacing: -2,
    textAlign: 'center' as 'left' | 'center' | 'right',
    demoVideoUrl: '',
    joinButtonLink: '',
    offerEndTime: '',
    videoTestimonials: ['', '', '', ''],
    features: [] as Feature[],
    faqs: [] as FAQItem[],
  });

  const [galleryFiles, setGalleryFiles] = useState<{file: File, preview: string}[]>([]);
  const [testimonialFiles, setTestimonialFiles] = useState<{file: File, preview: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        subtitle: program.subtitle || '',
        titleFontSize: program.titleFontSize || 80,
        subtitleFontSize: program.subtitleFontSize || 24,
        lineHeight: program.lineHeight || 1.1,
        letterSpacing: program.letterSpacing || -2,
        textAlign: program.textAlign || 'center',
        demoVideoUrl: program.demoVideoId ? `https://www.youtube.com/watch?v=${program.demoVideoId}` : '',
        joinButtonLink: program.joinButtonLink || '',
        offerEndTime: program.expiryDate || '',
        videoTestimonials: program.videoTestimonials || ['', '', '', ''],
        features: program.features || [],
        faqs: program.faqs || [],
      });
    }
  }, [program]);

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

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', iconName: 'Trophy' }]
    }));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
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
        titleFontSize: formData.titleFontSize,
        subtitleFontSize: formData.subtitleFontSize,
        lineHeight: formData.lineHeight,
        letterSpacing: formData.letterSpacing,
        textAlign: formData.textAlign,
        demoVideoId: getYouTubeId(formData.demoVideoUrl),
        gallery: [...currentGallery, ...uploadedGalleryUrls],
        videoTestimonials: formData.videoTestimonials.map(v => getYouTubeId(v)),
        imageTestimonials: [...currentImageTestimonials, ...newImageTestimonials],
        features: formData.features,
        faqs: formData.faqs,
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
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Master Next.js & React"
            />
          </div>

          <div className="space-y-4 p-6 bg-muted/20 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-primary" />
              <Label className="text-sm font-bold uppercase tracking-widest">Headline Typography & Layout</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase font-black">Title Font Size</Label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{formData.titleFontSize}px</span>
                  </div>
                  <Slider 
                    value={[formData.titleFontSize]} 
                    onValueChange={val => setFormData({...formData, titleFontSize: val[0]})} 
                    min={40} 
                    max={120} 
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase font-black">Subtitle Font Size</Label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{formData.subtitleFontSize}px</span>
                  </div>
                  <Slider 
                    value={[formData.subtitleFontSize]} 
                    onValueChange={val => setFormData({...formData, subtitleFontSize: val[0]})} 
                    min={14} 
                    max={48} 
                    step={1}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase font-black">Line Height (Spacing)</Label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{formData.lineHeight}</span>
                  </div>
                  <Slider 
                    value={[formData.lineHeight]} 
                    onValueChange={val => setFormData({...formData, lineHeight: val[0]})} 
                    min={0.8} 
                    max={2.5} 
                    step={0.1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase font-black">Letter Spacing (Width)</Label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{formData.letterSpacing}px</span>
                  </div>
                  <Slider 
                    value={[formData.letterSpacing]} 
                    onValueChange={val => setFormData({...formData, letterSpacing: val[0]})} 
                    min={-10} 
                    max={30} 
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t mt-4">
              <Label className="text-xs text-muted-foreground uppercase font-black mb-3 block">Text Alignment</Label>
              <div className="flex gap-2">
                <Button 
                  variant={formData.textAlign === 'left' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFormData({...formData, textAlign: 'left'})}
                  className="flex-1 font-bold"
                >
                  <AlignLeft className="w-4 h-4 mr-2" /> Left
                </Button>
                <Button 
                  variant={formData.textAlign === 'center' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFormData({...formData, textAlign: 'center'})}
                  className="flex-1 font-bold"
                >
                  <AlignCenter className="w-4 h-4 mr-2" /> Center
                </Button>
                <Button 
                  variant={formData.textAlign === 'right' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFormData({...formData, textAlign: 'right'})}
                  className="flex-1 font-bold"
                >
                  <AlignRight className="w-4 h-4 mr-2" /> Right
                </Button>
              </div>
            </div>
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
            <CardTitle>The Freedom Framework (Features)</CardTitle>
            <CardDescription>Customize the core value propositions of your program.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex gap-2" onClick={addFeature}>
            <ListPlus className="w-4 h-4" />
            Add Feature
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.features.map((feature, idx) => (
            <div key={idx} className="p-4 border rounded-xl space-y-3 relative group bg-muted/20">
              <button 
                onClick={() => removeFeature(idx)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Feature Title</Label>
                  <Input 
                    value={feature.title} 
                    onChange={e => updateFeature(idx, 'title', e.target.value)} 
                    placeholder="e.g. Expert Led Instruction"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={feature.iconName}
                    onChange={e => updateFeature(idx, 'iconName', e.target.value)}
                  >
                    <option value="Trophy">Trophy</option>
                    <option value="BookOpen">Book</option>
                    <option value="Globe">Globe</option>
                    <option value="Users">Users</option>
                    <option value="ShieldCheck">Shield</option>
                    <option value="Zap">Zap</option>
                    <option value="Star">Star</option>
                    <option value="CheckCircle2">Checkmark</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={feature.description} 
                  onChange={e => updateFeature(idx, 'description', e.target.value)} 
                  placeholder="Short explanation of this feature..."
                />
              </div>
            </div>
          ))}
          {formData.features.length === 0 && (
            <div className="text-center py-12 bg-muted/10 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">No features defined. Add some to show on the landing page.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Common Questions (FAQ)</CardTitle>
            <CardDescription>Address student concerns directly from the dashboard.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex gap-2" onClick={addFAQ}>
            <HelpCircle className="w-4 h-4" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 border rounded-xl space-y-3 relative group bg-muted/20">
              <button 
                onClick={() => removeFAQ(idx)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input 
                  value={faq.question} 
                  onChange={e => updateFAQ(idx, 'question', e.target.value)} 
                  placeholder="e.g. Do I need prior experience?"
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea 
                  value={faq.answer} 
                  onChange={e => updateFAQ(idx, 'answer', e.target.value)} 
                  placeholder="Provide a detailed answer..."
                />
              </div>
            </div>
          ))}
          {formData.faqs.length === 0 && (
            <div className="text-center py-12 bg-muted/10 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">No FAQs defined. Add some to help your conversions.</p>
            </div>
          )}
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
