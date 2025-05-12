import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
  import { Skeleton } from "@/components/ui/skeleton"


  export function UserSkeleton() {
    return (
        <Card className="w-full max-w-lg">
            <CardContent className="flex items-center justify-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col">
                    <CardTitle>
                        <Skeleton className="h-4 w-32" />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-48" />
                    </CardDescription>
                </div>
            </CardContent>
        </Card>
    )
  }


export function ProfileCardSkeleton() {
    return (
        <Card className="w-full sm:w-11/12 h-fit shadow-lg border">
            <CardContent className="flex flex-col sm:flex-row justify-center items-center text-center sm:gap-8 gap-4 p-6">
                {/* Avatar Skeleton */}
                <div className="flex flex-col items-center">
                    <Skeleton className="w-28 h-28 rounded-full mb-4" />
                </div>

                {/* Profile Details Skeleton */}
                <div className="flex flex-col justify-center items-center w-full">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-6 w-1/3 mb-4" />

                    <Separator className="my-6 w-full border-gray-300" />

                    {/* Stats Skeleton */}
                    <div className="flex gap-8 mt-4">
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    {/* Bio Skeleton */}
                    <div className="flex flex-col items-start mt-6 text-left w-full">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

