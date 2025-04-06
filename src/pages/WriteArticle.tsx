import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

interface FormValues {
  title: string;
  content: string;
  coverImage?: File;
  publishDate?: Date;
}

export default function WriteArticle() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editorState, setEditorState] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = (values: FormValues) => {
    // Here you would normally send the data to your backend
    console.log({
      ...values,
      content: editorState,
      publishDate: selectedDate,
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6">Write New Article</h1>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter article title" 
                              className="text-xl py-3" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                      <label className="text-lg font-semibold block">Cover Image</label>
                      <div className="flex items-center space-x-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="flex items-center gap-2"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Upload Image
                        </Button>
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        {imagePreview && (
                          <div className="relative w-16 h-16 overflow-hidden rounded">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="border rounded-t-md bg-gray-50">
                      <Menubar className="border-none bg-transparent py-2 px-4">
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Bold className="h-4 w-4" onClick={() => applyFormatting("bold")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Italic className="h-4 w-4" onClick={() => applyFormatting("italic")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Underline className="h-4 w-4" onClick={() => applyFormatting("underline")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarSeparator />
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Heading1 className="h-4 w-4" onClick={() => applyFormatting("h1")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Heading2 className="h-4 w-4" onClick={() => applyFormatting("h2")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarSeparator />
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <List className="h-4 w-4" onClick={() => applyFormatting("ul")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <ListOrdered className="h-4 w-4" onClick={() => applyFormatting("ol")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <Quote className="h-4 w-4" onClick={() => applyFormatting("quote")} />
                          </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarSeparator />
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <AlignLeft className="h-4 w-4" />
                          </MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem onClick={() => applyFormatting("left")}>
                              <AlignLeft className="mr-2 h-4 w-4" />
                              <span>Left</span>
                            </MenubarItem>
                            <MenubarItem onClick={() => applyFormatting("center")}>
                              <AlignCenter className="mr-2 h-4 w-4" />
                              <span>Center</span>
                            </MenubarItem>
                            <MenubarItem onClick={() => applyFormatting("right")}>
                              <AlignRight className="mr-2 h-4 w-4" />
                              <span>Right</span>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer">
                            <PaintBucket className="h-4 w-4" />
                          </MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem onClick={() => applyFormatting("color-red")}>
                              <div className="h-4 w-4 mr-2 rounded-full bg-red-500" />
                              <span>Red</span>
                            </MenubarItem>
                            <MenubarItem onClick={() => applyFormatting("color-blue")}>
                              <div className="h-4 w-4 mr-2 rounded-full bg-blue-500" />
                              <span>Blue</span>
                            </MenubarItem>
                            <MenubarItem onClick={() => applyFormatting("color-green")}>
                              <div className="h-4 w-4 mr-2 rounded-full bg-green-500" />
                              <span>Green</span>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>

                    {/* Editor */}
                    <Textarea
                      id="editor"
                      placeholder="Write your article content here..."
                      className="min-h-[300px] font-mono rounded-t-none resize-y"
                      value={editorState}
                      onChange={(e) => setEditorState(e.target.value)}
                    />

                    {/* Scheduling */}
                    <div className="space-y-2">
                      <label className="text-lg font-semibold block">Schedule Publication</label>
                      <div className="flex">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal w-[240px]",
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
                            />
                          </PopoverContent>
                        </Popover>
                        {selectedDate && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="ml-2" 
                            onClick={() => setSelectedDate(undefined)}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => navigate("/")}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedDate ? "Schedule Post" : "Publish Now"}
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
