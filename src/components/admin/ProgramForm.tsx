
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Loader2, Save, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, 
  Globe, Trophy, Zap, Star, Users, BookOpen, ShieldCheck, LayoutGrid
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Feature, FAQItem, Testimonial, TrustItem } from '@/lib/db';

function getYouTubeId(url: string) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export function ProgramForm({ programId }: { programId: string }) {
  const db = useFirestore();
  const { toast } = useToast();
  
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
    oldPriceLabel: '',
    currentPriceLabel: '',
    priceSubtext: '',
    footerDescription: '',
    footerCopyright: '',
    featuresTitle: '',
    featuresSubtitle: '',
    galleryTitle: '',
    gallerySubtitle: '',
    galleryColumns: 4,
    galleryAspect: '4/3' as '1/1' | '16/9' | '4/3' | '3/4',
    testimonialsTitle: '',
    testimonialsSubtitle: '',
    faqTitle: '',
    faqSubtitle: '',
    videoTestimonials: [] as string[],
    features: [] as Feature[],
    trustItems: [] as TrustItem[],
    faqs: [] as FAQItem[],
    imageTestimonials: [] as Testimonial[],
    gallery: [] as string[],
  });

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
        oldPriceLabel: program.oldPriceLabel || 'Join ₹1000 / month',
        currentPriceLabel: program.currentPriceLabel || 'Now Pay ₹589 today',
        priceSubtext: program.priceSubtext || '(₹499 + GST) Lifetime Access',
        footerDescription: program.footerDescription || '',
        footerCopyright: program.footerCopyright || '',
        featuresTitle: program.featuresTitle || 'The Mastery Framework',
        featuresSubtitle: program.featuresSubtitle || "We don't just teach code. We provide the tools, mindset, and network required for long-term professional autonomy.",
        galleryTitle: program.galleryTitle || 'Curriculum Previews',
        gallerySubtitle: program.gallerySubtitle || 'Explore the assets, modules, and strategic frameworks waiting inside.',
        galleryColumns: program.galleryColumns || 4,
        galleryAspect: program.galleryAspect || '4/3',
        testimonialsTitle: program.testimonialsTitle || 'Student Success Stories',
        testimonialsSubtitle: program.testimonialsSubtitle || 'Impact analysis and market feedback from the network.',
        faqTitle: program.faqTitle || 'Essential Inquiries',
        faqSubtitle: program.faqSubtitle || 'Clarifications on the engineered methodology.',
        videoTestimonials: program.videoTestimonials?.map(id => id ? `https://www.youtube.com/watch?v=${id}` : '') || [],
        features: program.features || [],
        trustItems: program.trustItems || [],
        faqs: program.faqs || [],
        imageTestimonials: program.imageTestimonials || [],
        gallery: program.gallery || [],
      });
    }
  }, [program]);

  const handleSave = async () => {
    setIsSaving(true);
    const updateData = {
      id: programId,
      title: formData.title,
      subtitle: formData.subtitle,
      titleFontSize: formData.titleFontSize,
      subtitleFontSize: formData.subtitleFontSize,
      lineHeight: formData.lineHeight,
      letterSpacing: formData.letterSpacing,
      textAlign: formData.textAlign,
      demoVideoId: formData.demoVideoUrl ? getYouTubeId(formData.demoVideoUrl) : '',
      videoTestimonials: formData.videoTestimonials.map(v => getYouTubeId(v)).filter(v => !!v),
      imageTestimonials: formData.imageTestimonials,
      featuresTitle: formData.featuresTitle,
      featuresSubtitle: formData.featuresSubtitle,
      galleryTitle: formData.galleryTitle,
      gallerySubtitle: formData.gallerySubtitle,
      galleryColumns: formData.galleryColumns,
      galleryAspect: formData.galleryAspect,
      testimonialsTitle: formData.testimonialsTitle,
      testimonialsSubtitle: formData.testimonialsSubtitle,
      faqTitle: formData.faqTitle,
      faqSubtitle: formData.faqSubtitle,
      features: formData.features,
      trustItems: formData.trustItems,
      faqs: formData.faqs,
      gallery: formData.gallery,
      joinButtonLink: formData.joinButtonLink,
      expiryDate: formData.offerEndTime || new Date().toISOString(),
      oldPriceLabel: formData.oldPriceLabel,
      currentPriceLabel: formData.currentPriceLabel,
      priceSubtext: formData.priceSubtext,
      footerDescription: formData.footerDescription,
      footerCopyright: formData.footerCopyright,
    };

    setDoc(programRef, updateData, { merge: true })
      .then(() => {
        toast({ title: "Success", description: "Program content updated successfully." });
      })
      .catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: programRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const addArrayItem = (key: 'features' | 'trustItems' | 'faqs' | 'imageTestimonials' | 'gallery' | 'videoTestimonials', defaultValue: any) => {
    setFormData(prev => ({ ...prev, [key]: [...(prev[key] as any[]), defaultValue] }));
  };

  const removeArrayItem = (key: 'features' | 'trustItems' | 'faqs' | 'imageTestimonials' | 'gallery' | 'videoTestimonials', index: number) => {
    setFormData(prev => ({ ...prev, [key]: (prev[key] as any[]).filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (key: 'features' | 'trustItems' | 'faqs' | 'imageTestimonials' | 'gallery' | 'videoTestimonials', index: number, value: any) => {
    const newItems = [...(formData[key] as any[])];
    if (typeof value === 'object' && value !== null) {
      newItems[index] = { ...newItems[index], ...value };
    } else {
      newItems[index] = value;
    }
    setFormData(prev => ({ ...prev, [key]: newItems }));
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section & Pricing */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Hero Section & Pricing</CardTitle>
          <CardDescription>Configure the main entry point and the sticky offer details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Main Headline</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. MASTER NEXT.JS 15"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-muted/20 rounded-xl border">
            <div className="space-y-4">
              <Label className="text-xs uppercase font-black text-primary">Typography Controls</Label>
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Title Size</Label><span>{formData.titleFontSize}px</span></div>
                <Slider value={[formData.titleFontSize]} onValueChange={v => setFormData({...formData, titleFontSize: v[0]})} min={40} max={120} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Subtitle Size</Label><span>{formData.subtitleFontSize}px</span></div>
                <Slider value={[formData.subtitleFontSize]} onValueChange={v => setFormData({...formData, subtitleFontSize: v[0]})} min={14} max={48} />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xs uppercase font-black text-primary">Layout Controls</Label>
              <div className="flex gap-2">
                <Button variant={formData.textAlign === 'left' ? 'default' : 'outline'} size="sm" onClick={() => setFormData({...formData, textAlign: 'left'})} className="flex-1"><AlignLeft /></Button>
                <Button variant={formData.textAlign === 'center' ? 'default' : 'outline'} size="sm" onClick={() => setFormData({...formData, textAlign: 'center'})} className="flex-1"><AlignCenter /></Button>
                <Button variant={formData.textAlign === 'right' ? 'default' : 'outline'} size="sm" onClick={() => setFormData({...formData, textAlign: 'right'})} className="flex-1"><AlignRight /></Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Letter Spacing</Label><span>{formData.letterSpacing}px</span></div>
                <Slider value={[formData.letterSpacing]} onValueChange={v => setFormData({...formData, letterSpacing: v[0]})} min={-10} max={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle / Mission Statement</Label>
            <Textarea 
              id="subtitle" 
              value={formData.subtitle} 
              onChange={e => setFormData({...formData, subtitle: e.target.value})} 
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Demo Video (YouTube URL - Optional)</Label>
              <Input value={formData.demoVideoUrl} onChange={e => setFormData({...formData, demoVideoUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Join Button Link (Payment Link)</Label>
              <Input value={formData.joinButtonLink} onChange={e => setFormData({...formData, joinButtonLink: e.target.value})} placeholder="https://..." />
            </div>
          </div>

          <div className="p-6 bg-accent/5 rounded-xl border border-accent/20 space-y-4">
            <Label className="text-xs uppercase font-black text-accent">Sticky Bar Pricing Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Old Price Label</Label>
                <Input value={formData.oldPriceLabel} onChange={e => setFormData({...formData, oldPriceLabel: e.target.value})} placeholder="Join ₹1000 / month" />
              </div>
              <div className="space-y-2">
                <Label>Current Price Label</Label>
                <Input value={formData.currentPriceLabel} onChange={e => setFormData({...formData, currentPriceLabel: e.target.value})} placeholder="Now Pay ₹589 today" />
              </div>
              <div className="space-y-2">
                <Label>Price Subtext</Label>
                <Input value={formData.priceSubtext} onChange={e => setFormData({...formData, priceSubtext: e.target.value})} placeholder="(₹499 + GST) Lifetime Access" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Trust Bar Indicators (Optional)</CardTitle>
            <CardDescription>Horizontal trust elements below the hero section.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('trustItems', { text: '', iconName: 'Globe' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.trustItems.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl relative group">
              <div className="flex-1 space-y-2">
                <Label>Label</Label>
                <Input value={item.text} onChange={e => updateArrayItem('trustItems', idx, { text: e.target.value })} />
              </div>
              <div className="w-32 space-y-2">
                <Label>Icon</Label>
                <select 
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                  value={item.iconName}
                  onChange={e => updateArrayItem('trustItems', idx, { iconName: e.target.value })}
                >
                  <option value="Globe">Globe</option>
                  <option value="Trophy">Trophy</option>
                  <option value="ShieldCheck">Shield</option>
                  <option value="Zap">Zap</option>
                  <option value="Users">Users</option>
                  <option value="BookOpen">Book</option>
                  <option value="Star">Star</option>
                </select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeArrayItem('trustItems', idx)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Framework Features */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Framework Features Section</CardTitle>
            <CardDescription>Explain the core pillars of your methodology.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('features', { title: '', description: '', iconName: 'Zap' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Feature
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input value={formData.featuresTitle} onChange={e => setFormData({...formData, featuresTitle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Section Subtitle</Label>
              <Input value={formData.featuresSubtitle} onChange={e => setFormData({...formData, featuresSubtitle: e.target.value})} />
            </div>
          </div>
          {formData.features.map((feature, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-4 relative group">
              <Button variant="ghost" size="icon" onClick={() => removeArrayItem('features', idx)} className="absolute top-2 right-2 text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Feature Title</Label>
                  <Input value={feature.title} onChange={e => updateArrayItem('features', idx, { title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name</Label>
                  <Input value={feature.iconName} onChange={e => updateArrayItem('features', idx, { iconName: e.target.value })} placeholder="Zap, Trophy, etc." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Feature Description</Label>
                <Textarea value={feature.description} onChange={e => updateArrayItem('features', idx, { description: e.target.value })} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Curriculum Previews (Gallery)</CardTitle>
            <CardDescription>Add visual previews of your program content.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('gallery', '')}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Gallery Section Title</Label>
              <Input value={formData.galleryTitle} onChange={e => setFormData({...formData, galleryTitle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Gallery Section Subtitle</Label>
              <Input value={formData.gallerySubtitle} onChange={e => setFormData({...formData, gallerySubtitle: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-muted/20 rounded-xl border mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <Label className="text-xs uppercase font-black text-primary">Grid Layout</Label>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Desktop Columns</Label><span>{formData.galleryColumns}</span></div>
                <Slider 
                  value={[formData.galleryColumns]} 
                  onValueChange={v => setFormData({...formData, galleryColumns: v[0]})} 
                  min={2} max={5} step={1} 
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xs uppercase font-black text-primary">Image Aspect Ratio (Size)</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Square (1:1)', val: '1/1' },
                  { label: 'Video (16:9)', val: '16/9' },
                  { label: 'Classic (4:3)', val: '4/3' },
                  { label: 'Tall (3:4)', val: '3/4' },
                ].map((opt) => (
                  <Button 
                    key={opt.val}
                    variant={formData.galleryAspect === opt.val ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setFormData({...formData, galleryAspect: opt.val as any})}
                    className="text-[10px] font-bold"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {formData.gallery.map((url, idx) => (
            <div key={idx} className="flex gap-2">
              <Input value={url} onChange={e => updateArrayItem('gallery', idx, e.target.value)} placeholder="https://image-url.com" />
              <Button variant="ghost" size="icon" onClick={() => removeArrayItem('gallery', idx)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testimonials Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Testimonials & Social Proof (Optional)</CardTitle>
          <CardDescription>Manage both video results and written success stories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Testimonials Title</Label>
              <Input value={formData.testimonialsTitle} onChange={e => setFormData({...formData, testimonialsTitle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Testimonials Subtitle</Label>
              <Input value={formData.testimonialsSubtitle} onChange={e => setFormData({...formData, testimonialsSubtitle: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="flex justify-between items-center">
              <Label className="text-xs uppercase font-black text-primary">Video Testimonials (YouTube Links)</Label>
              <Button variant="outline" size="sm" onClick={() => addArrayItem('videoTestimonials', '')}>
                <Plus className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </div>
            <div className="space-y-2">
              {formData.videoTestimonials.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input 
                    value={url} 
                    onChange={e => updateArrayItem('videoTestimonials', idx, e.target.value)} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem('videoTestimonials', idx)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="flex justify-between items-center">
              <Label className="text-xs uppercase font-black text-primary">Written Student Success Stories</Label>
              <Button variant="outline" size="sm" onClick={() => addArrayItem('imageTestimonials', { name: '', role: '', content: '' })}>
                <Plus className="w-4 h-4 mr-2" /> Add Written Story
              </Button>
            </div>
            {formData.imageTestimonials.map((t, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-4 relative group">
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('imageTestimonials', idx)} className="absolute top-2 right-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input value={t.name} onChange={e => updateArrayItem('imageTestimonials', idx, { name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role / Outcome</Label>
                    <Input value={t.role} onChange={e => updateArrayItem('imageTestimonials', idx, { role: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Testimonial Content</Label>
                  <Textarea value={t.content} onChange={e => updateArrayItem('imageTestimonials', idx, { content: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Essential Inquiries (FAQ)</CardTitle>
            <CardDescription>Address the most common questions from prospective students.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('faqs', { question: '', answer: '' })}>
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>FAQ Section Title</Label>
              <Input value={formData.faqTitle} onChange={e => setFormData({...formData, faqTitle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>FAQ Section Subtitle</Label>
              <Input value={formData.faqSubtitle} onChange={e => setFormData({...formData, faqSubtitle: e.target.value})} />
            </div>
          </div>
          {formData.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-4 relative">
              <Button variant="ghost" size="icon" onClick={() => removeArrayItem('faqs', idx)} className="absolute top-2 right-2 text-destructive"><Trash2 className="w-4 h-4" /></Button>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input value={faq.question} onChange={e => updateArrayItem('faqs', idx, { question: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea value={faq.answer} onChange={e => updateArrayItem('faqs', idx, { answer: e.target.value })} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
          <CardDescription>Brand description and legal copyright details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Footer Brand Description</Label>
            <Textarea value={formData.footerDescription} onChange={e => setFormData({...formData, footerDescription: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Copyright Notice</Label>
            <Input value={formData.footerCopyright} onChange={e => setFormData({...formData, footerCopyright: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-12 h-14 rounded-full font-bold shadow-xl fiery-gradient text-white"
        >
          {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          SAVE PROGRAM UPDATES
        </Button>
      </div>
    </div>
  );
}
