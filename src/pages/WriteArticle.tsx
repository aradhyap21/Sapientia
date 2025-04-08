import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Hash, Tags, X } from "lucide-react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  CalendarIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
  Link,
  Code,
  Undo,
  Redo,
  Eye,
  Edit,
} from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from 'react-markdown';

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().optional(),
  coverImage: z.any().optional(),
  publishDate: z.date().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
  "Technology", "Science", "Politics", "Health", 
  "Business", "Arts", "Education", "Sports"
];

export default function WriteArticle() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editorState, setEditorState] = useState("");
  const [editorView, setEditorView] = useState<"write" | "preview">("write");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      form.setValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveHistory = (newState: string) => {
    setHistoryStack(prev => [...prev, editorState]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (historyStack.length > 0) {
      const prevState = historyStack[historyStack.length - 1];
      setRedoStack(prev => [...prev, editorState]);
      setEditorState(prevState);
      setHistoryStack(prev => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setHistoryStack(prev => [...prev, editorState]);
      setEditorState(nextState);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  const applyFormatting = (format: string) => {
    const textArea = document.getElementById("editor") as HTMLTextAreaElement;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = editorState.substring(start, end);
    let formattedText = "";
    let cursorOffset = 0;

    // Save current state for undo
    saveHistory(editorState);

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case "h1":
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case "h2":
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case "ul":
        formattedText = `\n- ${selectedText}`;
        cursorOffset = 3;
        break;
      case "ol":
        formattedText = `\n1. ${selectedText}`;
        cursorOffset = 4;
        break;
      case "quote":
        formattedText = `\n> ${selectedText}`;
        cursorOffset = 3;
        break;
      case "link":
        formattedText = `[${selectedText || "Link text"}](https://example.com)`;
        cursorOffset = 3;
        break;
      case "code":
        formattedText = `\`\`\`\n${selectedText || "code here"}\n\`\`\``;
        cursorOffset = 4;
        break;
      case "left":
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        cursorOffset = 30;
        break;
      case "center":
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        cursorOffset = 32;
        break;
      case "right":
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        cursorOffset = 31;
        break;
      case "color-red":
        formattedText = `<span style="color: red">${selectedText}</span>`;
        cursorOffset = 24;
        break;
      case "color-blue":
        formattedText = `<span style="color: blue">${selectedText}</span>`;
        cursorOffset = 25;
        break;
      case "color-green":
        formattedText = `<span style="color: green">${selectedText}</span>`;
        cursorOffset = 26;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      editorState.substring(0, start) + formattedText + editorState.substring(end);
    setEditorState(newContent);

    // Set cursor position after formatting
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = start + (selectedText ? formattedText.length : cursorOffset);
      textArea.selectionEnd = start + (selectedText ? formattedText.length : cursorOffset);
    }, 0);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (values: FormValues) => {
    // Here you would normally send the data to your backend
    console.log({
      ...values,
      content: editorState,
      publishDate: selectedDate,
      tags: tags,
    });
    
    toast({
      title: "Blog post created!",
      description: selectedDate 
        ? `Your post will be published on ${format(selectedDate, "PPP")}`
        : "Your post has been published",
    });
    
    // Navigate back to home after submit
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="flex flex-1 w-full">
          <main className="flex-1 p-4 md:p-6 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg shadow-md p-4 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">Write New Article</h1>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={form.handleSubmit(handleSubmit)}
                    >
                      {selectedDate ? "Schedule" : "Publish"}
                    </Button>
                  </div>
                </div>
                
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter a compelling title" 
                                  className="text-xl py-3" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">Category</FormLabel>
                              <FormControl>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                      {field.value || "Select a category"}
                                      <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-[200px]">
                                    {CATEGORIES.map((category) => (
                                      <DropdownMenuItem
                                        key={category}
                                        onClick={() => form.setValue("category", category)}
                                        className="flex items-center justify-between"
                                      >
                                        {category}
                                        {field.value === category && <Check className="h-4 w-4 ml-2" />}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tags input */}
                        <div className="space-y-2">
                          <label className="text-lg font-semibold block">Tags</label>
                          <div className="flex items-center border rounded-md pl-3 focus-within:ring-1 focus-within:ring-ring">
                            <Tags className="h-4 w-4 text-muted-foreground mr-2" />
                            <Input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                              placeholder={tags.length >= 5 ? "Max 5 tags" : "Add tag..."}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
                              disabled={tags.length >= 5}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex gap-1 items-center">
                                <Hash className="h-3 w-3" />
                                {tag}
                                <button onClick={() => removeTag(tag)} className="ml-1">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                          <label className="text-lg font-semibold block">Cover Image</label>
                          <div className="flex flex-col space-y-3">
                            {imagePreview ? (
                              <div className="relative rounded-md overflow-hidden aspect-video">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                  onClick={() => {
                                    setImagePreview(null);
                                    form.setValue("coverImage", undefined);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="flex items-center gap-2 h-20"
                              >
                                <ImageIcon className="h-4 w-4" />
                                <span>Upload Cover Image</span>
                              </Button>
                            )}
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>
                        
                        {/* Scheduling */}
                        <div className="space-y-2">
                          <label className="text-lg font-semibold block">Schedule Publication</label>
                          <div className="flex">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "justify-start text-left font-normal w-full",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          {selectedDate && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedDate(undefined)}
                            >
                              Publish immediately instead
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Editor Column */}
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Content</h2>
                            <div className="inline-flex items-center rounded-md border border-input p-1 bg-background">
                              <Button
                                variant={editorView === "write" ? "secondary" : "ghost"} 
                                size="sm"
                                onClick={() => setEditorView("write")}
                                className="flex items-center gap-1.5"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant={editorView === "preview" ? "secondary" : "ghost"} 
                                size="sm"
                                onClick={() => setEditorView("preview")}
                                className="flex items-center gap-1.5"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Preview</span>
                              </Button>
                            </div>
                          </div>
                          
                          {editorView === "write" ? (
                            <div className="border rounded-md overflow-hidden">
                              {/* Formatting Toolbar */}
                              <div className="border-b bg-muted/30 p-1">
                                <div className="flex flex-wrap gap-0.5">
                                  <div className="flex items-center mr-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={handleUndo}
                                      disabled={historyStack.length === 0}
                                      title="Undo"
                                    >
                                      <Undo className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={handleRedo}
                                      disabled={redoStack.length === 0}
                                      title="Redo"
                                    >
                                      <Redo className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="w-px h-8 bg-border mx-1" />
                                  
                                  <div className="flex items-center">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("bold")}
                                      title="Bold"
                                    >
                                      <Bold className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("italic")}
                                      title="Italic"
                                    >
                                      <Italic className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("underline")}
                                      title="Underline"
                                    >
                                      <Underline className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="w-px h-8 bg-border mx-1" />
                                  
                                  <div className="flex items-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 px-2 flex items-center gap-1 rounded-md"
                                          title="Headings"
                                        >
                                          <Heading1 className="h-4 w-4" />
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => applyFormatting("h1")}>
                                          <Heading1 className="h-4 w-4 mr-2" />
                                          <span>Heading 1</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => applyFormatting("h2")}>
                                          <Heading2 className="h-4 w-4 mr-2" />
                                          <span>Heading 2</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  
                                  <div className="w-px h-8 bg-border mx-1" />
                                  
                                  <div className="flex items-center">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("ul")}
                                      title="Bullet List"
                                    >
                                      <List className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("ol")}
                                      title="Numbered List"
                                    >
                                      <ListOrdered className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("quote")}
                                      title="Quote"
                                    >
                                      <Quote className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="w-px h-8 bg-border mx-1" />
                                  
                                  <div className="flex items-center">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("link")}
                                      title="Insert Link"
                                    >
                                      <Link className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-md"
                                      onClick={() => applyFormatting("code")}
                                      title="Insert Code"
                                    >
                                      <Code className="h-4 w-4" />
                                    </Button>
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0 rounded-md"
                                          title="Text Alignment"
                                        >
                                          <AlignLeft className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => applyFormatting("left")}>
                                          <AlignLeft className="h-4 w-4 mr-2" />
                                          <span>Left Align</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => applyFormatting("center")}>
                                          <AlignCenter className="h-4 w-4 mr-2" />
                                          <span>Center Align</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => applyFormatting("right")}>
                                          <AlignRight className="h-4 w-4 mr-2" />
                                          <span>Right Align</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0 rounded-md"
                                          title="Text Color"
                                        >
                                          <PaintBucket className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => applyFormatting("color-red")}>
                                          <div className="h-4 w-4 mr-2 rounded-full bg-red-500" />
                                          <span>Red</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => applyFormatting("color-blue")}>
                                          <div className="h-4 w-4 mr-2 rounded-full bg-blue-500" />
                                          <span>Blue</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => applyFormatting("color-green")}>
                                          <div className="h-4 w-4 mr-2 rounded-full bg-green-500" />
                                          <span>Green</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>

                              {/* Editor */}
                              <Textarea
                                id="editor"
                                placeholder="Write your article content here using Markdown..."
                                className="min-h-[400px] font-mono border-0 resize-y w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={editorState}
                                onChange={(e) => {
                                  if (e.target.value !== editorState) {
                                    saveHistory(editorState);
                                    setEditorState(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="border rounded-md p-6 min-h-[465px] bg-background overflow-y-auto prose dark:prose-invert max-w-none">
                              {editorState ? (
                                <ReactMarkdown>
                                  {editorState}
                                </ReactMarkdown>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                  <Eye className="h-12 w-12 mb-2 opacity-20" />
                                  <p>Your preview will appear here once you start writing</p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setEditorView("write")}
                                  >
                                    Start writing
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center text-xs text-muted-foreground p-2">
                            <div>
                              {editorState.length} characters
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs px-2"
                                onClick={() => navigator.clipboard.writeText(editorState)}
                              >
                                Copy content
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs px-2"
                                onClick={() => setEditorState("")}
                                disabled={!editorState.length}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? "Submitting..." : selectedDate ? "Schedule Post" : "Publish Now"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

