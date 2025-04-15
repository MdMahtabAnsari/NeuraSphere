"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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

import { updateUserOtpBasedPassword } from "@workspace/schema/user";
import { resetPassword } from "@/lib/api/auth";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
    const form = useForm<z.infer<typeof updateUserOtpBasedPassword>>({
        resolver: zodResolver(updateUserOtpBasedPassword),
        defaultValues: {
            newPassword: undefined,
        },
    });
    const router = useRouter();

    const onSubmit = async(data: z.infer<typeof updateUserOtpBasedPassword>) => {
        try{
            const res = await resetPassword(data);
            if(res?.status==="success"){
                toast.success("Password reset successfully!");
                router.push("/signin");
            }
            else {
                toast.error("Password reset failed. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred while resetting the password.");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="sm:w-96 w-full">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-md font-bold">New Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full cursor-pointer" type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "Reset Password"}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col items-center justify-center w-full">
                    <Button variant="link" className="cursor-pointer" onClick={()=>{router.push("/signup")}} >
                        Don't have an account? Sign Up
                    </Button>
                    <Button variant="link" className="cursor-pointer" onClick={()=>{router.push("/signin")}} >
                        Already have an account? Sign In
                    </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
