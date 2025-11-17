import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  image_path?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const AdminPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const [rejection] = fileRejections;
      if (rejection.errors[0].code === "file-too-large") {
        toast.error("File is too large. Maximum size is 2MB.");
      } else if (rejection.errors[0].code === "file-invalid-type") {
        toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
  });

  // Fetch portfolio items
  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get signed URLs for images
      const itemsWithUrls = await Promise.all(
        data.map(async (item: PortfolioItem) => {
          if (item.image_path) {
            const { data: urlData } = await supabaseAdmin.storage
              .from("portfolio")
              .createSignedUrl(item.image_path, 3600); // 1 hour URL
            return { ...item, image_url: urlData?.signedUrl };
          }
          return item;
        })
      );

      setPortfolioItems(itemsWithUrls);
      setPortfolioItems(data);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      toast.error("Failed to load portfolio items");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File) => {
    console.log("🟢 [uploadImage] Starting upload...");
    debugger;

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(
      "📦 Uploading to bucket 'portfolio-images' with path:",
      filePath
    );

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("portfolio-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [uploadImage] Upload failed:", uploadError);
      throw uploadError;
    }

    console.log("✅ [uploadImage] Upload successful. Getting public URL...");
    debugger;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("portfolio-images").getPublicUrl(filePath);

    console.log("🌐 [uploadImage] Public URL generated:", publicUrl);
    return { path: filePath, url: publicUrl };
  };

  // Delete image from storage
  const deleteImage = async (path: string) => {
    const { error } = await supabaseAdmin.storage
      .from("portfolio-images")
      .remove([path]);

    if (error) throw error;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debugger;
    console.log("🟢 [handleSubmit] Form submitted:", {
      formData,
      uploadedFile,
      editingItem,
    });

    if (!formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!uploadedFile && !editingItem) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      editingItem ? "Updating item..." : "Adding item..."
    );

    try {
      let imagePath = editingItem?.image_path || "";
      let imageUrl = "";

      // Upload new image if provided
      if (uploadedFile) {
        console.log("📸 [handleSubmit] Uploading new image file...");
        debugger;

        // Delete old image if editing
        if (editingItem?.image_path) {
          console.log(
            "🗑 [handleSubmit] Deleting old image:",
            editingItem.image_path
          );
          try {
            await deleteImage(editingItem.image_path);
            console.log("✅ Old image deleted");
          } catch (error) {
            console.warn("⚠️ Failed to delete old image:", error);
          }
        }

        const { path, url } = await uploadImage(uploadedFile);
        imagePath = path;
        imageUrl = url;

        console.log("✅ [handleSubmit] Image uploaded and URL obtained:", {
          imagePath,
          imageUrl,
        });
        debugger;
      }

      // Now save to database
      if (editingItem) {
        console.log("📝 [handleSubmit] Updating existing item in DB...");
        debugger;

        const { data, error } = await supabaseAdmin
          .from("portfolio_items")
          .update({
            ...formData,
            image_path: imagePath,
            image_url: imageUrl,
          })
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) {
          console.error("❌ [handleSubmit] Update failed:", error);
          throw error;
        }

        console.log("✅ [handleSubmit] Updated successfully:", data);
        setPortfolioItems(
          portfolioItems.map((item) =>
            item.id === editingItem.id ? data : item
          )
        );
        toast.success("Portfolio item updated successfully");
      } else {
        console.log("🆕 [handleSubmit] Creating new portfolio item in DB...");
        debugger;

        const { data, error } = await supabaseAdmin
          .from("portfolio_items")
          .insert([{ ...formData, image_path: imagePath, image_url: imageUrl }])
          .select()
          .single();

        if (error) {
          console.error("❌ [handleSubmit] Insert failed:", error);
          throw error;
        }

        console.log("✅ [handleSubmit] Insert successful:", data);
        setPortfolioItems([data, ...portfolioItems]);
        toast.success("Portfolio item added successfully");
      }

      // Close dialog and reset form
      console.log("🧹 [handleSubmit] Resetting form and closing dialog...");
      debugger;
      resetForm();
      (
        document.querySelector(
          'button[aria-label="Close"]'
        ) as HTMLButtonElement
      )?.click();
    } catch (error: any) {
      console.error("❌ [handleSubmit] Error saving portfolio item:", error);
      toast.error(`Failed to ${editingItem ? "update" : "add"} portfolio item`);
    } finally {
      console.log("🏁 [handleSubmit] Operation complete");
      debugger;
      setIsSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (id: string, imagePath: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      // Delete image from storage
      if (imagePath) {
        await deleteImage(imagePath);
      }

      // Delete item from database
      const { error } = await supabaseAdmin
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      toast.success("Portfolio item deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast.error("Failed to delete portfolio item");
    }
  };

  // Handle edit item
  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
    });
    setImagePreview(item.image_url);
    setUploadedFile(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
    });
    setUploadedFile(null);
    setImagePreview(null);
    setEditingItem(null);
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle delete item
  const handleDelete = async (id: string, imagePath?: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      // Delete the image from storage if it exists
      if (imagePath) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("portfolio")
          .remove([imagePath]);

        if (storageError) throw storageError;
      }

      // Delete the item from the database
      const { error } = await supabaseAdmin
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update the UI
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      toast.success("Portfolio item deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast.error("Failed to delete portfolio item");
    }
  };

  // Handle edit item
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || "",
    });
    if (item.image_url) {
      setImagePreview(item.image_url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Portfolio</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingItem ? "Edit" : "Add"} Portfolio Item
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the portfolio item details"
                  : "Add a new item to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-black">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="text-black"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-black">
                    Category *
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="text-black"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-black">Image *</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors text-black ${
                      isDragActive
                        ? "border-primary bg-secondary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-40 mx-auto mb-2 rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setUploadedFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 text-black"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {uploadedFile && (
                          <p className="text-sm text-foreground">
                            {uploadedFile.name} (
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {isDragActive
                            ? "Drop the image here"
                            : "Click to change or drag and drop"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop an image here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (Max 2MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-black">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="text-black"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="text-black"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? "Update" : "Add"} Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id, item.image_path)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
