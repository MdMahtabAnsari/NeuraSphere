"use client";
import { getUserInterests } from "@/lib/api/interest";
import { InterestList } from "@/components/custom/interest/interest";
import { InterestDataSchema } from "@workspace/schema/api-response/interest";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Page() {
    const [mounted, setMounted] = useState(false);
    const [response, setResponse] = useState<z.infer<typeof InterestDataSchema>>({
        interests: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        setMounted(true);
        fetchInterests();
    }, []);

    const fetchInterests = async () => {
        const data = await getUserInterests({ page: response.currentPage, limit: 10 });
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                interests: [...prev.interests, ...data.data.interests],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        }
    };

    if (!mounted) return null; // 👈 Prevent mismatch during hydration

    return (
        <div className="w-full h-full flex justify-center items-center">
            <InterestList
                interest={response}
                fetchInterests={fetchInterests}
            />
        </div>
    );
}

