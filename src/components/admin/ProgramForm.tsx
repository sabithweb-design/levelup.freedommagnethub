
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save, Plus, Trash2, Video, X, Type, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, MessageSquareQuote, LayoutList, Tag, Info, ShieldCheck, Globe, Trophy, Layout, Zap, Star, Users, BookOpen, Heading } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    testimonialsTitle: '',
    testimonialsSubtitle: '',
    faqTitle: '',
    faqSubtitle: '',
    videoTestimonials: ['', '', '', ''],
    features: [] as Feature[],
    trustItems: [] as TrustItem[],
    faqs: [] as FAQItem[],
    imageTestimonials: [] as Testimonial[],
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
        footerDescription: program.footerDescription || 'We engineer pathways to professional autonomy through strategic education and world-class mentorship.',
        footerCopyright: program.footerCopyright || `Freedom Magnet Hub Global. All Rights Reserved.`,
        featuresTitle: program.featuresTitle || 'The Mastery Framework',
        featuresSubtitle: program.featuresSubtitle || "We don't just teach code. We provide the tools, mindset, and network required for long-term professional autonomy.",
        galleryTitle: program.galleryTitle || 'Curriculum Previews',
        gallerySubtitle: program.gallerySubtitle || 'Explore the assets, modules, and strategic frameworks waiting inside.',
        testimonialsTitle: program.testimonialsTitle || 'Student Success Stories',
        testimonialsSubtitle: program.testimonialsSubtitle || 'Impact analysis and market feedback from the network.',
        faqTitle: program.faqTitle || 'Essential Inquiries',
        faqSubtitle: program.faqSubtitle || 'Clarifications on the engineered methodology.',
        videoTestimonials: program.videoTestimonials || ['', '', '', ''],
        features: program.features || [],
        trustItems: program.trustItems || [
          { text: 'Global Network', iconName: 'Globe' },
          { text: 'Industry Certified', iconName: 'Trophy' },
          { text: 'Mastery Curriculum', iconName: 'Layout' }
        ],
        faqs: program.faqs || [],
        imageTestimonials: program.imageTestimonials || [],
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
      videoTestimonials: formData.videoTestimonials.map(v => v ? getYouTubeId(v) : '').filter(v => !!v),
      imageTestimonials: formData.imageTestimonials,
      featuresTitle: formData.featuresTitle,
      featuresSubtitle: formData.featuresSubtitle,
      galleryTitle: formData.galleryTitle,
      gallerySubtitle: formData.gallerySubtitle,
      testimonialsTitle: formData.testimonialsTitle,
      testimonialsSubtitle: formData.testimonialsSubtitle,
      faqTitle: formData.faqTitle,
      faqSubtitle: formData.faqSubtitle,
      features: formData.features,
      trustItems: formData.trustItems,
      faqs: formData.faqs,
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

  const updateTrustItem = (index: number, field: keyof TrustItem, value: string) => {
    const newItems = [...formData.trustItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, trustItems: newItems }));
  };

  const removeTrustItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trustItems: prev.trustItems.filter((_, i) => i !== index)
    }));
  };

  const addTrustItem = () => {
    setFormData(prev => ({
      ...prev,
      trustItems: [...prev.trustItems, { text: '', iconName: 'ShieldCheck' }]
    }));
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

          <div className="space-y-4 p-6 bg-accent/5 rounded-xl border border-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-accent" />
              <Label className="text-sm font-bold uppercase tracking-widest text-accent">Sticky Offer Bar Pricing</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPriceLabel">Old Price Label (Strikethrough)</Label>
                <Input 
                  id="oldPriceLabel" 
                  value={formData.oldPriceLabel} 
                  onChange={e => setFormData({...formData, oldPriceLabel: e.target.value})} 
                  placeholder="e.g. Join ₹1000 / month"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPriceLabel">Current Price Label</Label>
                <Input 
                  id="currentPriceLabel" 
                  value={formData.currentPriceLabel} 
                  onChange={e => setFormData({...formData, currentPriceLabel: e.target.value})} 
                  placeholder="e.g. Now Pay ₹589 today"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceSubtext">Price Subtext</Label>
                <Input 
                  id="priceSubtext" 
                  value={formData.priceSubtext} 
                  onChange={e => setFormData({...formData, priceSubtext: e.target.value})} 
                  placeholder="e.g. (₹499 + GST) Lifetime Access"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demo">Hero Demo Video (Optional YouTube URL)</Label>
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
        <CardHeader>
          <CardTitle>Section Headings</CardTitle>
          <CardDescription>Manage the main titles and descriptions for each section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2"><LayoutList className="w-4 h-4 text-primary" /><Label className="font-bold">Features Section</Label></div>
              <Input value={formData.featuresTitle} onChange={e => setFormData({...formData, featuresTitle: e.target.value})} placeholder="Features Title" />
              <Textarea value={formData.featuresSubtitle} onChange={e => setFormData({...formData, featuresSubtitle: e.target.value})} placeholder="Features Subtitle" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><Layout className="w-4 h-4 text-primary" /><Label className="font-bold">Gallery Section</Label></div>
              <Input value={formData.galleryTitle} onChange={e => setFormData({...formData, galleryTitle: e.target.value})} placeholder="Gallery Title" />
              <Textarea value={formData.gallerySubtitle} onChange={e => setFormData({...formData, gallerySubtitle: e.target.value})} placeholder="Gallery Subtitle" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2"><MessageSquareQuote className="w-4 h-4 text-primary" /><Label className="font-bold">Testimonials Section</Label></div>
              <Input value={formData.testimonialsTitle} onChange={e => setFormData({...formData, testimonialsTitle: e.target.value})} placeholder="Testimonials Title" />
              <Textarea value={formData.testimonialsSubtitle} onChange={e => setFormData({...formData, testimonialsSubtitle: e.target.value})} placeholder="Testimonials Subtitle" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><Info className="w-4 h-4 text-primary" /><Label className="font-bold">FAQ Section</Label></div>
              <Input value={formData.faqTitle} onChange={e => setFormData({...formData, faqTitle: e.target.value})} placeholder="FAQ Title" />
              <Textarea value={formData.faqSubtitle} onChange={e => setFormData({...formData, faqSubtitle: e.target.value})} placeholder="FAQ Subtitle" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Trust Indicators (Trust Bar)</CardTitle>
            <CardDescription>Customize labels like 'Global Network'. Leave empty to hide the bar.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex gap-2" onClick={addTrustItem}>
            <ShieldCheck className="w-4 h-4" />
            Add Indicator
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.trustItems.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl space-y-3 relative group bg-muted/20">
              <button 
                onClick={() => removeTrustItem(idx)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Label Text</Label>
                  <Input 
                    value={item.text} 
                    onChange={e => updateTrustItem(idx, 'text', e.target.value)} 
                    placeholder="e.g. Global Network"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={item.iconName}
                    onChange={e => updateTrustItem(idx, 'iconName', e.target.value)}
                  >
                    <option value="Globe">Globe</option>
                    <option value="Trophy">Trophy</option>
                    <option value="Layout">Layout</option>
                    <option value="ShieldCheck">Shield</option>
                    <option value="Zap">Zap</option>
                    <option value="Users">Users</option>
                    <option value="BookOpen">Book</option>
                    <option value="Star">Star</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
          <CardDescription>Manage your brand identity and legal notices in the footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="footerDescription">Brand Description / Mission</Label>
            <Textarea 
              id="footerDescription" 
              value={formData.footerDescription} 
              onChange={e => setFormData({...formData, footerDescription: e.target.value})} 
              placeholder="e.g. We engineer pathways to professional autonomy..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerCopyright">Copyright Notice</Label>
            <Input 
              id="footerCopyright" 
              value={formData.footerCopyright} 
              onChange={e => setFormData({...formData, footerCopyright: e.target.value})} 
              placeholder="e.g. Freedom Magnet Hub Global. All Rights Reserved."
            />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" /> Note: The system automatically prefixes the year and copyright symbol.
            </p>
          </div>
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
              SAVING CHANGES...
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
