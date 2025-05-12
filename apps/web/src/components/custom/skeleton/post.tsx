import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    {/* Avatar Skeleton */}
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col space-y-2">
                        {/* Name Skeleton */}
                        <Skeleton className="h-4 w-32" />
                        {/* Date Skeleton */}
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Content Skeleton */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                {/* Media Skeleton */}
                <Skeleton className="h-40 w-full" />
            </CardContent>
            <Separator className="my-2" />
            <CardFooter className="flex justify-between">
                {/* Reaction Buttons Skeleton */}
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </CardFooter>
        </Card>
    );
}
