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
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updatePost } from '@/lib/api/post';
import { CreateAndUpdatePostMediaCard } from "@/components/custom/media";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getPostById } from "@/lib/api/post";
import { Brain } from 'lucide-react';
import { getAiSuggestion } from "@/lib/api/post";
import { MediaSchema } from "@workspace/schema/api-response/post";




const updatePostSchema = z.object({
    id: z.string(),
    content: z.string().optional(),
    addMedia: z.array(
        z.object({
            type: z.enum(["image", "video"]),
            url: z.string(),
        })
    ).optional(),
    removeMedia: z.array(z.string().uuid()).optional(),
});

export default function Page() {
    const router = useRouter();
    const form = useForm<z.infer<typeof updatePostSchema>>({
        resolver: zodResolver(updatePostSchema),
        defaultValues: {
            content: "",
            addMedia: [],
            removeMedia: [],
        },
    });
    const { id } = useParams();
    const [showAi, setShowAi] = useState<boolean>(false);
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
    const [aiContent, setAiContent] = useState<string>("");

    const [media, setMedia] = useState<z.infer<typeof MediaSchema>[]>([]);
    const [visibleMedia, setVisibleMedia] = useState<{ type: "image" | "video", url: string }[]>([]);

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

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        const data = await getPostById(id as string);
        if (data.status === "success") {
            form.setValue("id", data.data.id);
            form.setValue("content", data.data.content);
            setMedia(data.data.media);
            setVisibleMedia(data.data.media.map((item) => ({
                type: item.type,
                url: item.url,
            })));
        }
    };

    // Ref to store uploaded media
   const uploadedMediaRef = useRef<{ type: "image" | "video"; url: string }[]>([]);

    const onSubmit = async (data: z.infer<typeof updatePostSchema>) => {
        const post = await updatePost(data);
        if (post.status === "success") {
            toast.success("Post updated successfully");
            router.push("/dashboard");
        } else {
            toast.error("Failed to update post");
        }
    };

    const handleDelete = ({ type, url }: { type: "image" | "video"; url: string }) => {
        const isOldMedia = media.find((item) => item.url === url);
        if (isOldMedia) {
            form.setValue("removeMedia", [
                ...(form.getValues("removeMedia") || []),
                isOldMedia.id
            ]);

            setVisibleMedia((prev) => prev.filter((item) => item.url !== url));
        } else {
            setVisibleMedia((prev) => prev.filter((item) => item.url !== url));
            form.setValue("addMedia", [
                ...(form.getValues("addMedia") || []).filter((item) => item.url !== url),
            ]);

            uploadedMediaRef.current = uploadedMediaRef.current.filter((item) => item.url !== url);
        }
    };


    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="sm:w-96 w-full h-full overflow-auto">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">Update Post</CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        Update your post and share your thoughts with the world.
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
                                name="addMedia"
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
                                                    form.setValue("addMedia", uploadedMediaRef.current);
                                                    setVisibleMedia((prev) => [...prev, newMedia]);
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
                                                        form.setValue("addMedia", []);   // Clear form state too
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
                                <Brain />
                            </Button>
                        </CardContent>
                    )}
                    <CardDescription className="text-center text-md text-gray-500 font-bold mt-4">
                        Preview
                    </CardDescription>
                    <CreateAndUpdatePostMediaCard media={visibleMedia} onDelete={handleDelete} />
                </CardContent>
            </Card>
        </div>
    );
}

