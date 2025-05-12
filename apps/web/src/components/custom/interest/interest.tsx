"use client";

import { InterestDataSchema } from "@workspace/schema/api-response/interest";;
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from "@/components/ui/skeleton";


export function InterestList({ interest, fetchInterests }: { interest: z.infer<typeof InterestDataSchema>; fetchInterests: () => Promise<void> }) {
    return (
        <div className="flex flex-wrap gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={interest.interests.length} // This is important field to render the next data
                next={fetchInterests}
                hasMore={interest.currentPage <= interest.totalPage}
                loader={
                    <div className="flex flex-wrap  w-full h-full gap-2">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                className="flex flex-wrap w-full h-full gap-2"
            >
                {interest.interests.map((interest) => (
                    <Badge
                        key={interest.interest.id}
                        className="w-full h-full p-4 text-center bg-white border border-gray-300 rounded-lg shadow-md"
                    >
                        {interest.interest.name}
                    </Badge>

                ))}
            </InfiniteScroll>
        </div>
    )
}