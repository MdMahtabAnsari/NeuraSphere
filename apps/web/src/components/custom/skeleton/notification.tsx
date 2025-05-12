import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationCardSkeleton() {
    return (
        <Card className="w-96 h-34">
            <CardContent className="space-y-2">
                {/* Content Skeleton */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter className="flex justify-between">
                {/* Date Skeleton */}
                <Skeleton className="h-3 w-24" />
            </CardFooter>
        </Card>
    );
}