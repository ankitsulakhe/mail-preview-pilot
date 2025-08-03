import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Eye, Code, CheckCircle, XCircle, Loader2, Camera } from "lucide-react";

// Email validation schema
const emailFormSchema = z.object({
  to: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .refine(
      (email) => {
        // Additional email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      { message: "Please enter a valid email format" }
    ),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters"),
  htmlContent: z
    .string()
    .min(1, "HTML content is required")
    .min(50, "HTML content must be at least 50 characters")
    .refine(
      (html) => {
        // Basic HTML validation - check for HTML structure
        const hasHtmlTags = /<[^>]+>/.test(html);
        return hasHtmlTags;
      },
      { message: "Please enter valid HTML content with proper tags" }
    ),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

const defaultHtmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Test Email</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .email-header { padding: 20px; text-align: center; background-color: #3b82f6; color: white; }
        .email-body { padding: 20px; }
        .email-footer { padding: 20px; text-align: center; background-color: #f8f9fa; color: #666; font-size: 12px; }
        .cta-button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .email-body { padding: 15px !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Our Newsletter!</h1>
        </div>
        <div class="email-body">
            <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">
                This is a professional email template optimized for all email clients including Outlook, Gmail, and mobile devices.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Your email content goes here. This template includes responsive design and cross-client compatibility.
            </p>
            <div style="text-align: center;">
                <a href="#" class="cta-button">Call to Action</a>
            </div>
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Best regards,<br>
                Your Team
            </p>
        </div>
        <div class="email-footer">
            <p style="margin: 0;">© 2024 Your Company. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">
                <a href="#" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>`;

const EmailTester = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastSentStatus, setLastSentStatus] = useState<"success" | "error" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: "",
      subject: "",
      htmlContent: defaultHtmlTemplate,
    },
    mode: "onChange", // Real-time validation
  });

  const watchedValues = form.watch();

  // Simulate email sending with proper validation
  const handleSendTest = async (data: EmailFormData) => {
    setIsLoading(true);
    setLastSentStatus(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll simulate success (replace with actual email service)
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        setLastSentStatus("success");
        toast({
          title: "✅ Email Sent Successfully!",
          description: `Test email has been sent to ${data.to}`,
          duration: 5000,
        });
      } else {
        throw new Error("Failed to send email");
      }
      
    } catch (error) {
      setLastSentStatus("error");
      toast({
        title: "❌ Email Failed to Send",
        description: "There was an error sending your test email. Please check your email settings and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      to: "",
      subject: "",
      htmlContent: defaultHtmlTemplate,
    });
    setLastSentStatus(null);
    toast({
      title: "Form Reset",
      description: "All fields have been cleared",
    });
  };

  const captureSnapshot = async () => {
    if (!previewRef.current || !watchedValues.htmlContent) {
      toast({
        title: "No Preview to Capture",
        description: "Please enter HTML content first to capture a snapshot",
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `email-preview-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "📸 Snapshot Captured!",
        description: "Email preview has been saved as PNG image",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Snapshot Failed",
        description: "Could not capture the preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Test your HTML emails
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-6">
            before sending them!
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Preview and test your email templates across different clients to ensure perfect delivery every time.
          </p>
        </div>

        {/* Main Email Testing Interface */}
        <Card className="max-w-4xl mx-auto shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
              <Mail className="w-6 h-6" />
              Create a New Test Email
            </CardTitle>
            <CardDescription>
              Enter your email details below and test how they render across different email clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendTest)} className="space-y-6">
                {/* Email Configuration */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send To *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="test@example.com"
                            className="transition-smooth"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Line *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Test Email Subject"
                            className="transition-smooth"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      HTML Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
              
                  <TabsContent value="editor" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="htmlContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HTML Content *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your HTML email content here..."
                              className="min-h-[400px] font-mono text-sm transition-smooth resize-none"
                              style={{ 
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                lineHeight: '1.4'
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="text-xs text-muted-foreground">
                            Tip: Use cross-browser compatible HTML and inline CSS for best email client support
                          </div>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
              
                  <TabsContent value="preview" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Email Preview</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={captureSnapshot}
                          disabled={isCapturing || !watchedValues.htmlContent}
                          className="flex items-center gap-2"
                        >
                          {isCapturing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Capturing...
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4" />
                              Take Snapshot
                            </>
                          )}
                        </Button>
                      </div>
                      <div 
                        ref={previewRef}
                        className="border border-border rounded-lg p-4 bg-muted/50 min-h-[400px] overflow-auto"
                      >
                        {watchedValues.htmlContent ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: watchedValues.htmlContent }}
                            className="max-w-full"
                            style={{ 
                              backgroundColor: '#ffffff',
                              fontFamily: 'Arial, sans-serif'
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            Enter HTML content in the editor to see preview
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Preview shows how your email might render. Actual rendering may vary across email clients.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Status Messages */}
                {lastSentStatus && (
                  <div className={`flex items-center gap-2 p-4 rounded-lg ${
                    lastSentStatus === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {lastSentStatus === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {lastSentStatus === "success" 
                        ? `Test email sent successfully to ${watchedValues.to}!`
                        : "Failed to send test email. Please try again."
                      }
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-smooth"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1 transition-smooth"
                    size="lg"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Reset Form
                  </Button>
                </div>

                {/* Form Validation Summary */}
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {Object.entries(form.formState.errors).map(([field, error]) => (
                        <li key={field}>• {error?.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-white/70">
          <p>Professional email testing tool with cross-browser compatibility</p>
          <p className="text-sm mt-2">Built for testing HTML email templates with comprehensive validation</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTester;