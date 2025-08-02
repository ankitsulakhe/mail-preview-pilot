import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Eye, Code } from "lucide-react";

const EmailTester = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #333; text-align: center;">Welcome to Our Newsletter!</h1>
        <p style="color: #666; line-height: 1.6;">
            This is a sample email template that you can customize for your testing needs.
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Call to Action
            </a>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">
            © 2024 Your Company. All rights reserved.
        </p>
    </div>
</body>
</html>`
  });

  const { toast } = useToast();

  const handleSendTest = () => {
    if (!emailData.to || !emailData.subject || !emailData.htmlContent) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields before sending.",
        variant: "destructive",
      });
      return;
    }

    // For now, we'll show a success message
    // In a real implementation, this would connect to an email service
    toast({
      title: "Test Email Prepared!",
      description: `Ready to send test email to ${emailData.to}`,
    });
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
            <CardTitle className="text-2xl text-primary">Create a New Test Email</CardTitle>
            <CardDescription>
              Enter your email details below and test how they render
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Configuration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">Send To *</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="test@example.com"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  className="transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line *</Label>
                <Input
                  id="subject"
                  placeholder="Test Email Subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="transition-smooth"
                />
              </div>
            </div>

            {/* Email Content Tabs */}
            <Tabs defaultValue="editor" className="w-full">
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
                <div className="space-y-2">
                  <Label htmlFor="htmlContent">HTML Content *</Label>
                  <Textarea
                    id="htmlContent"
                    placeholder="Enter your HTML email content here..."
                    value={emailData.htmlContent}
                    onChange={(e) => setEmailData(prev => ({ ...prev, htmlContent: e.target.value }))}
                    className="min-h-[400px] font-mono text-sm transition-smooth"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Preview</Label>
                  <div className="border border-border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                    <div 
                      dangerouslySetInnerHTML={{ __html: emailData.htmlContent }}
                      className="max-w-full overflow-auto"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleSendTest}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-smooth"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 transition-smooth"
                size="lg"
                onClick={() => {
                  setEmailData({
                    to: "",
                    subject: "",
                    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #333; text-align: center;">Welcome to Our Newsletter!</h1>
        <p style="color: #666; line-height: 1.6;">
            This is a sample email template that you can customize for your testing needs.
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Call to Action
            </a>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">
            © 2024 Your Company. All rights reserved.
        </p>
    </div>
</body>
</html>`
                  });
                }}
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-white/70">
          <p>Built for testing HTML email templates with ease</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTester;