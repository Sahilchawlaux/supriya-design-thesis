import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, AlertCircle, CheckCircle } from "lucide-react";
import {
  useHomeContent,
  useCreateHomeContent,
  useUpdateHomeContent,
} from "@/hooks/useHomeContent";
import type { Database } from "@/integrations/supabase/types";

type HomeContent = Database["public"]["Tables"]["home_content"]["Row"];
type HomeContentUpdate = Database["public"]["Tables"]["home_content"]["Update"];

// Character limits for each field to maintain UI consistency
const CHARACTER_LIMITS = {
  hero_heading: 80, // Current: 47 chars
  hero_subheading: 200, // Current: 130 chars
  hero_cta_text: 30, // Current: 17 chars
  process_heading: 60, // Current: 37 chars
  process_description: 250, // Current: 150 chars
  unforgettable_heading: 50, // Current: 29 chars
  unforgettable_description: 300, // Current: 175 chars
  unforgettable_button_text: 25, // Current: 16 chars
  unforgettable_image: 500, // URL length
  cta_heading: 60, // Current: 38 chars
  cta_description: 200, // Current: 130 chars
  cta_button_text: 30, // Current: 17 chars
};

// Default initial data for new home content
const defaultHomeContent = {
  hero_heading: "Exquisite digital invitation, crafted to last",
  hero_subheading:
    "Discover beautiful, customizable digital invitation designs that perfectly capture the essence of your special day.",
  hero_cta_text: "Browse Collections",
  process_heading: "How We Curate Your Invitation Story",
  process_description:
    "From concept to delivery, our thoughtful process ensures your digital wedding invitation perfectly captures the essence of your celebration.",
  unforgettable_heading: "Create Unforgettable Moments",
  unforgettable_description:
    "Your special occasion deserves an invitation that sets the perfect tone. Let our designs help you create a memorable experience from the very first moment.",
  unforgettable_button_text: "Contact Us Today",
  unforgettable_image:
    "https://images.unsplash.com/photo-1641317136698-284db1e10c1b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJlYXV0aWZ1bCUyMHdlZGRpbmclMjBpbnZpdGF0aW9uc3xlbnwwfHwwfHx8MA%3D%3D",
  cta_heading: "Ready to Create Something Beautiful?",
  cta_description:
    "Explore our collection of premium digital wedding invitation designs and find the perfect match for your special day.",
  cta_button_text: "Browse Collections",
};

const AdminHome = () => {
  const {
    data: homeContent,
    isLoading: isLoadingContent,
    error: loadError,
  } = useHomeContent();
  const createHomeContent = useCreateHomeContent();
  const updateHomeContent = useUpdateHomeContent();

  const [formData, setFormData] = useState(defaultHomeContent);
  const [originalData, setOriginalData] = useState(defaultHomeContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data when content is loaded
  useEffect(() => {
    console.log("Admin: Loading content state:", {
      hasContent: !!homeContent,
      isLoading: isLoadingContent,
      error: loadError,
      content: homeContent,
    });

    // If no content exists and we're not loading, create initial content
    if (!homeContent && !isLoadingContent && !loadError) {
      console.log("No content found, creating initial content...");
      createHomeContent
        .mutateAsync(defaultHomeContent)
        .then(() => {
          console.log("Initial content created successfully");
        })
        .catch((error) => {
          console.error("Failed to create initial content:", error);
          if (error.message?.includes("PGRST205")) {
            toast.error(
              "Database table not found. Please create the home_content table in Supabase."
            );
          }
        });
      return;
    }

    const contentData = homeContent
      ? {
          hero_heading: homeContent.hero_heading,
          hero_subheading: homeContent.hero_subheading,
          hero_cta_text: homeContent.hero_cta_text,
          process_heading: homeContent.process_heading,
          process_description: homeContent.process_description,
          unforgettable_heading: homeContent.unforgettable_heading,
          unforgettable_description: homeContent.unforgettable_description,
          unforgettable_button_text: homeContent.unforgettable_button_text,
          unforgettable_image: homeContent.unforgettable_image,
          cta_heading: homeContent.cta_heading,
          cta_description: homeContent.cta_description,
          cta_button_text: homeContent.cta_button_text,
        }
      : defaultHomeContent;

    setFormData(contentData);
    setOriginalData(contentData);
    setHasChanges(false);
    // }, [homeContent, isLoadingContent, loadError, createHomeContent]);
  }, [homeContent, isLoadingContent, loadError]);

  // Detect changes in form data
  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);

    // Show notification when changes are first detected
    if (hasFormChanges && !hasChanges) {
      toast.info("Content has been modified", {
        description: "Remember to save your changes",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 3000,
      });
    }

    setHasChanges(hasFormChanges);
  }, [formData, originalData, hasChanges]);

  const validateField = (fieldName: string, value: string): string | null => {
    const limit = CHARACTER_LIMITS[fieldName as keyof typeof CHARACTER_LIMITS];
    if (value.length > limit) {
      return `Maximum ${limit} characters allowed. Current: ${value.length}`;
    }
    return null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validate the field
    const error = validateField(name, value);

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error || "",
    }));

    // Only update form data if within character limit
    const limit = CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS];
    if (value.length <= limit) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // Show toast error for exceeding limit
      toast.error(
        `${name
          .replace("_", " ")
          .replace(/\b\w/g, (l) =>
            l.toUpperCase()
          )} cannot exceed ${limit} characters`
      );
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(formData).forEach((fieldName) => {
      const value = formData[fieldName as keyof typeof formData];
      const error = validateField(fieldName, value);
      if (error) {
        errors[fieldName] = error;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleUpdateContent = async () => {
    // Validate all fields before saving
    if (!validateAllFields()) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      if (homeContent) {
        // Update existing content
        await updateHomeContent.mutateAsync({
          id: homeContent.id,
          updates: formData,
        });

        // Update original data to reflect the new saved state
        setOriginalData(formData);
        setHasChanges(false);
      } else {
        // Create new content if none exists
        await createHomeContent.mutateAsync(formData);
        setOriginalData(formData);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error saving home content:", error);
    }
  };

  const handleDiscardChanges = () => {
    // Reset form data to original data
    setFormData(originalData);
    setValidationErrors({});
    setHasChanges(false);
    toast.success("Changes discarded");
  };

  // Helper component for character count display
  const CharacterCount = ({
    fieldName,
    value,
  }: {
    fieldName: string;
    value: string;
  }) => {
    const limit = CHARACTER_LIMITS[fieldName as keyof typeof CHARACTER_LIMITS];
    const remaining = limit - value.length;
    const isNearLimit = remaining <= 10;
    const isOverLimit = remaining < 0;

    return (
      <div
        className={`text-xs mt-1 ${
          isOverLimit
            ? "text-red-500"
            : isNearLimit
            ? "text-yellow-500"
            : "text-gray-500"
        }`}
      >
        {value.length}/{limit} characters {isOverLimit && "(Exceeds limit!)"}
      </div>
    );
  };

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif">Edit Home Page</h1>
          {hasChanges && (
            <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md">
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDiscardChanges}
            disabled={!hasChanges || updateHomeContent.isPending}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Discard Changes
          </Button>
          <Button
            className="bg-gold hover:bg-gold-dark text-white"
            onClick={handleUpdateContent}
            disabled={
              !hasChanges ||
              updateHomeContent.isPending ||
              createHomeContent.isPending
            }
          >
            {updateHomeContent.isPending || createHomeContent.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Update Content
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero_heading">Hero Heading</Label>
            <Textarea
              id="hero_heading"
              name="hero_heading"
              value={formData.hero_heading}
              onChange={handleInputChange}
              placeholder="Main heading for the hero section"
              rows={2}
              className={validationErrors.hero_heading ? "border-red-500" : ""}
            />
            <CharacterCount
              fieldName="hero_heading"
              value={formData.hero_heading}
            />
            {validationErrors.hero_heading && (
              <div className="text-red-500 text-xs">
                {validationErrors.hero_heading}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subheading">Hero Subheading</Label>
            <Textarea
              id="hero_subheading"
              name="hero_subheading"
              value={formData.hero_subheading}
              onChange={handleInputChange}
              placeholder="Subtitle for the hero section"
              rows={3}
              className={
                validationErrors.hero_subheading ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="hero_subheading"
              value={formData.hero_subheading}
            />
            {validationErrors.hero_subheading && (
              <div className="text-red-500 text-xs">
                {validationErrors.hero_subheading}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_cta_text">Call to Action Text</Label>
            <Input
              id="hero_cta_text"
              name="hero_cta_text"
              value={formData.hero_cta_text}
              onChange={handleInputChange}
              placeholder="Button text for call to action"
              className={validationErrors.hero_cta_text ? "border-red-500" : ""}
            />
            <CharacterCount
              fieldName="hero_cta_text"
              value={formData.hero_cta_text}
            />
            {validationErrors.hero_cta_text && (
              <div className="text-red-500 text-xs">
                {validationErrors.hero_cta_text}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How We Curate Your Invitation Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="process_heading">Section Heading</Label>
            <Textarea
              id="process_heading"
              name="process_heading"
              value={formData.process_heading}
              onChange={handleInputChange}
              placeholder="Heading for the process section"
              rows={2}
              className={
                validationErrors.process_heading ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="process_heading"
              value={formData.process_heading}
            />
            {validationErrors.process_heading && (
              <div className="text-red-500 text-xs">
                {validationErrors.process_heading}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="process_description">Section Description</Label>
            <Textarea
              id="process_description"
              name="process_description"
              value={formData.process_description}
              onChange={handleInputChange}
              placeholder="Description for the process section"
              rows={3}
              className={
                validationErrors.process_description ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="process_description"
              value={formData.process_description}
            />
            {validationErrors.process_description && (
              <div className="text-red-500 text-xs">
                {validationErrors.process_description}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Unforgettable Moments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="unforgettable_heading">Section Heading</Label>
            <Input
              id="unforgettable_heading"
              name="unforgettable_heading"
              value={formData.unforgettable_heading}
              onChange={handleInputChange}
              placeholder="Heading for unforgettable moments section"
              className={
                validationErrors.unforgettable_heading ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="unforgettable_heading"
              value={formData.unforgettable_heading}
            />
            {validationErrors.unforgettable_heading && (
              <div className="text-red-500 text-xs">
                {validationErrors.unforgettable_heading}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unforgettable_description">
              Section Description
            </Label>
            <Textarea
              id="unforgettable_description"
              name="unforgettable_description"
              value={formData.unforgettable_description}
              onChange={handleInputChange}
              placeholder="Description for unforgettable moments section"
              rows={3}
              className={
                validationErrors.unforgettable_description
                  ? "border-red-500"
                  : ""
              }
            />
            <CharacterCount
              fieldName="unforgettable_description"
              value={formData.unforgettable_description}
            />
            {validationErrors.unforgettable_description && (
              <div className="text-red-500 text-xs">
                {validationErrors.unforgettable_description}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="unforgettable_button_text">Button Text</Label>
              <Input
                id="unforgettable_button_text"
                name="unforgettable_button_text"
                value={formData.unforgettable_button_text}
                onChange={handleInputChange}
                placeholder="Button text for this section"
                className={
                  validationErrors.unforgettable_button_text
                    ? "border-red-500"
                    : ""
                }
              />
              <CharacterCount
                fieldName="unforgettable_button_text"
                value={formData.unforgettable_button_text}
              />
              {validationErrors.unforgettable_button_text && (
                <div className="text-red-500 text-xs">
                  {validationErrors.unforgettable_button_text}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unforgettable_image">Background Image URL</Label>
              <Input
                id="unforgettable_image"
                name="unforgettable_image"
                value={formData.unforgettable_image}
                onChange={handleInputChange}
                placeholder="URL to background image"
                className={
                  validationErrors.unforgettable_image ? "border-red-500" : ""
                }
              />
              <CharacterCount
                fieldName="unforgettable_image"
                value={formData.unforgettable_image}
              />
              {validationErrors.unforgettable_image && (
                <div className="text-red-500 text-xs">
                  {validationErrors.unforgettable_image}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready to Create Something Beautiful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cta_heading">Section Heading</Label>
            <Input
              id="cta_heading"
              name="cta_heading"
              value={formData.cta_heading}
              onChange={handleInputChange}
              placeholder="Heading for final CTA section"
              className={validationErrors.cta_heading ? "border-red-500" : ""}
            />
            <CharacterCount
              fieldName="cta_heading"
              value={formData.cta_heading}
            />
            {validationErrors.cta_heading && (
              <div className="text-red-500 text-xs">
                {validationErrors.cta_heading}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta_description">Section Description</Label>
            <Textarea
              id="cta_description"
              name="cta_description"
              value={formData.cta_description}
              onChange={handleInputChange}
              placeholder="Description for final CTA section"
              rows={3}
              className={
                validationErrors.cta_description ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="cta_description"
              value={formData.cta_description}
            />
            {validationErrors.cta_description && (
              <div className="text-red-500 text-xs">
                {validationErrors.cta_description}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta_button_text">Button Text</Label>
            <Input
              id="cta_button_text"
              name="cta_button_text"
              value={formData.cta_button_text}
              onChange={handleInputChange}
              placeholder="Button text for final CTA"
              className={
                validationErrors.cta_button_text ? "border-red-500" : ""
              }
            />
            <CharacterCount
              fieldName="cta_button_text"
              value={formData.cta_button_text}
            />
            {validationErrors.cta_button_text && (
              <div className="text-red-500 text-xs">
                {validationErrors.cta_button_text}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
