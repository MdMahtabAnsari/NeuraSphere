import { api } from "./api";
import { z } from "zod";
import { InterestResponseSchema } from "@workspace/schema/api-response/interest";
import { isLoggedIn } from "./auth";

export const getUserInterests = async ({ page, limit }: { page: number; limit: number }): Promise<z.infer<typeof InterestResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get("/api/users/interests/user", { params: { page, limit } });
        return response.data as z.infer<typeof InterestResponseSchema>;
    } catch (error) {
        console.error("Error fetching user interests:", error);
        return {
            message: "Error fetching user interests",
            status: "error",
            data: {
                interests: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};