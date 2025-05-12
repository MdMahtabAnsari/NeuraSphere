"use client"
import { searchUsers } from "@/lib/api/user";
import { UserList } from "@/components/custom/user";
import { UserDataSchema } from "@workspace/schema/api-response/user";
import { useEffect,useState,useRef } from "react";
import { z } from "zod";

export function UserSearch({ identifier }: { identifier: string }) {
    const [response, setResponse] = useState<z.infer<typeof UserDataSchema>>({
        users: [],
        totalPage: 1,
        currentPage: 1,
    });
    const identifierRef = useRef<string>("");

    useEffect(() => {
        if (response.currentPage <= response.totalPage ) {
            fetchUser();
        }
    }, [response.currentPage]);

    useEffect(() => {
        if (identifier !== identifierRef.current) {
            identifierRef.current = identifier;
            setResponse({
                users: [],
                totalPage: 1,
                currentPage: 1,
            });
        }
    }, [identifier]);

    const fetchUser = async () => {
        const data = await searchUsers({ identifier, page: response.currentPage, limit: 10 });

        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                users: [...prev.users, ...data.data.users],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        }
        else {
            setResponse((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                totalPage: prev.totalPage,
            }));
        }
    };

    return <UserList users={response} fetchUser={fetchUser} />;
}

