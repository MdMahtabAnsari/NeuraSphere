"use client";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/lib/api/post";
import { CreateAndUpdatePostMediaCard } from "@/components/custom/media";
import { useState } from "react";
import { Brain } from 'lucide-react';
import { getAiSuggestion } from "@/lib/api/post";

const createPostSchema = z.object({
    content: z.string().optional(),
    media: z.array(
        z.object({
            type: z.enum(["image", "video"]),
            url: z.string(),
        })
    ).optional(),
});

export default function Page() {
    const router = useRouter();
    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            content: "",
            media: [],
        },
    });
    const [showAi, setShowAi] = useState<boolean>(false);
    const [aiContent, setAiContent] = useState<string>("");
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

    // Ref to store uploaded media
    const uploadedMediaRef = useRef<z.infer<typeof createPostSchema>["media"]>([]);

    const onSubmit = async (data: z.infer<typeof createPostSchema>) => {
        const post = await createPost(data);
        if (post.status === "success") {
            toast.success("Post created successfully");
        } else {
            toast.error("Failed to create post");
        }
    };
    const handleAiContent = async () => {
    setIsSuggesting(true);
    const data = await getAiSuggestion(aiContent);
    if (data.status === "success") {
        setAiContent("");
        form.setValue("content", data.data.content);
    } else {
        toast.error("Failed to fetch AI content");
    }
    setIsSuggesting(false);
    
};

    const handleDelete = ({ type, url }: { type: string; url: string }) => {
        const updated = (form.getValues("media") || []).filter((item) => item.url !== url);
        uploadedMediaRef.current = updated; // Keep ref in sync
        form.setValue("media", updated);
    };

    const watchedMedia = form.watch("media") || [];

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="sm:w-96 w-full h-full overflow-auto">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">Create Post</CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        Create your post and share your thoughts with the world.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="What's on your mind?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="media"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Media</FormLabel>
                                        <CldUploadWidget
                                            uploadPreset="profile_pic"
                                            onSuccess={(result) => {
                                                if (result?.event === "success") {
                                                    const newMedia = {
                                                        type: result.info.resource_type as "image" | "video",
                                                        url: result.info.secure_url,
                                                    };
                                                    uploadedMediaRef.current = [
                                                        ...(uploadedMediaRef.current || []),
                                                        newMedia,
                                                    ];
                                                    form.setValue("media", uploadedMediaRef.current);
                                                }
                                            }}
                                            options={{
                                                multiple: true,
                                                maxFiles: 10,
                                                maxImageWidth: 1000,
                                                maxImageHeight: 1000,
                                            }}
                                        >
                                            {({ open }) => (
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        uploadedMediaRef.current = []; // Reset before new upload session
                                                        form.setValue("media", []);   // Clear form state too
                                                        open?.();
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    Upload Media
                                                </Button>
                                            )}
                                        </CldUploadWidget>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={form.formState.isSubmitting || isSuggesting}>
                                Update Post
                            </Button>
                        </form>
                    </Form>
                    <Button
                        type="button"
                        className="w-full mt-4 cursor-pointer"
                        onClick={() => setShowAi(!showAi)}
                    >
                        {showAi ? "Hide AI" : "Show AI"} <Brain className="ml-2" />
                    </Button>
                    {showAi && (
                        <CardContent className="mt-4">
                            <CardDescription className="text-center text-md text-gray-500 font-bold">
                                AI Generated Content
                            </CardDescription>
                            <Textarea placeholder="AI generated content will appear here..." value={aiContent} onChange={(e) => setAiContent(e.target.value)} />
                            <Button
                                variant="ghost"
                                disabled={isSuggesting || !aiContent}
                                className="w-full mt-4 cursor-pointer"
                                onClick={handleAiContent}
                            >
                               <Brain  />
                            </Button>
                        </CardContent>
                    )}
                    <CardDescription className="text-center text-md text-gray-500 font-bold mt-4">
                        Preview
                    </CardDescription>
                    <CreateAndUpdatePostMediaCard media={watchedMedia} onDelete={handleDelete} />
                </CardContent>
            </Card>
        </div>
    );
}
