
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitToCustomerIO } from "@/utils/churnCalculator";
import { toast } from "sonner";

interface NewsletterFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.firstName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitToCustomerIO(formData);
      
      if (success) {
        toast.success("Thank you for subscribing!");
        onSuccess();
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Newsletter submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company" className="font-medium">
          Company
        </Label>
        <Input
          id="company"
          name="company"
          type="text"
          placeholder="Your Company"
          value={formData.company}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex justify-between mt-6 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Subscribe & Download Report"}
        </Button>
      </div>
      
      <div className="text-xs text-center text-gray-500 mt-4">
        By subscribing, you'll receive your PDF report and occasional product updates.
        <br />
        We respect your privacy and will never share your data.
      </div>
    </form>
  );
};

export default NewsletterForm;
