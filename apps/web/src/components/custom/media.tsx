"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import ReactPlayer from "react-player"
import { MediaSchema } from "@workspace/schema/api-response/post";
import { z } from "zod"
import {
    Card,
    CardContent
} from "@/components/ui/card"

import { useState } from "react";
import { Fullscreen,Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export  function MediaCard({ media, postId, handleView }: { media: z.infer<typeof MediaSchema>[], postId: string, handleView: (id: string) => void }) {
    const [isViewed, setIsViewed] = useState(false);
    const [duration, setDuration] = useState(0);

    return (
        <Card className="w-full max-w-lg">
            <CardContent className="flex items-center justify-center w-full h-full">
                <Carousel opts={{
                    loop: false,
                }} orientation="horizontal" className="w-full h-full">
                    <CarouselContent className="w-full h-full">
                        {media.map(({ id, type, url }) => (
                            <CarouselItem key={id} className="w-full h-full flex items-center justify-center">
                                {type === "video" ? (
                                    <ReactPlayer
                                        url={url}
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        onProgress={(progress) => {
                                            if (progress.playedSeconds >= duration / 2 && !isViewed) {
                                                handleView(postId);
                                                setIsViewed(true);
                                            }
                                        }}
                                        onDuration={(duration) => setDuration(duration)}
                                    />
                                ) : (

                                    <div className="relative">
                                        <img
                                            src={url}
                                            alt="media"
                                            className="w-full h-full object-cover"
                                        />
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className="absolute bottom-2 right-2 cursor-pointer" onClick={() => {
                                                    handleView(postId);
                                                    setIsViewed(true);
                                                }}>
                                                    <Fullscreen />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-3/6 h-3/6 flex items-center justify-center">
                                                <DialogHeader>
                                                    <DialogTitle>Media</DialogTitle>
                                                    <DialogDescription>
                                                        <img
                                                            src={url}
                                                            alt="media"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </CardContent>
        </Card>
    )
}


export const CreateAndUpdatePostMediaCard = ({
    media,
    onDelete,
}: {
    media: { type: "image" | "video"; url: string }[];
    onDelete: (media: { type: "image" | "video"; url: string }) => void;
}) => {
    return (
        <Card className="w-full h-96">
            <CardContent className="flex flex-col gap-4 overflow-auto p-4 overflow-y-auto">
                {media.map(({ type, url }) => (
                    <div
                        key={url}
                        className="relative w-full h-full aspect-video flex items-center justify-center border rounded overflow-auto"
                    >
                        {type === "video" ? (
                            <ReactPlayer url={url} controls width="100%" height="100%" />
                        ) : (
                            <img
                                src={url}
                                alt="media"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white cursor-pointer"
                            onClick={() => onDelete({ type, url })}
                        >
                            <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
