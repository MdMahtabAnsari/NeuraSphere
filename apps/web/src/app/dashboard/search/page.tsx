"use client";

import { useState} from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostByTag,PostByUserDetail } from "@/components/custom/search/post";
import { UserSearch } from "@/components/custom/search/user";

export default function Page() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [selectedOption, setSelectedOption] = useState<"tag" | "postByUserDetails" | "user">("tag");

    const handleOptionSelect = (option: "tag" | "postByUserDetails" | "user") => {
        setSelectedOption(option);
    };

    return (
        <div className="flex flex-col items-center w-full h-full gap-4 px-4">
            <div className="flex flex-col items-center w-full max-w-2xl gap-4 my-4">
                <Input
                    type="text"
                    placeholder={`Search by ${selectedOption}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />

                <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                    <Button
                        variant={selectedOption === "tag" ? "default" : "outline"}
                        onClick={() => handleOptionSelect("tag")}
                        className={`cursor-pointer `}
                        size="lg"
                    >
                        Tag
                    </Button>

                    <Button
                        variant={selectedOption === "postByUserDetails" ? "default" : "outline"}
                        onClick={() => handleOptionSelect("postByUserDetails")}
                        className={`cursor-pointer `}
                        size="lg"
                    >
                        Post by User Details
                    </Button>
                    <Button
                        variant={selectedOption === "user" ? "default" : "outline"}
                        onClick={() => handleOptionSelect("user")}
                        className={`cursor-pointer `}
                        size="lg"
                    >
                        User
                    </Button>
                </div>
            </div>
            {/* Render result when active and selectedOption is tag */}
            {selectedOption === "tag" && debouncedSearch && (
                <PostByTag tag={debouncedSearch} />
            )}
            {/* Render result when active and selectedOption is postByUserDetails */}
            {selectedOption === "postByUserDetails" && debouncedSearch && (
                <PostByUserDetail identifier={debouncedSearch} />
            )}
            {/* Render result when active and selectedOption is user */}
            {selectedOption === "user" && debouncedSearch &&  (
                <UserSearch identifier={debouncedSearch} />
            )}
        </div>
    );
}
