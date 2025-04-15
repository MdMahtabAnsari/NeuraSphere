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

import { login as loginSchema } from "@workspace/schema/auth";
import { login } from "@/lib/api/auth";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function Page(){
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: undefined,
            password: undefined
        },
    });
    const router = useRouter()

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try{
            const res = await login(data);
            if (res?.status === "success") {
                toast.success("Login successful!");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="sm:w-96 w-full">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">
                        SignIn
                    </CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        One step to get our services
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-md font-bold">Email or Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email or username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-md font-bold">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full cursor-pointer" type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "Login"}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col items-center justify-center w-full">
                    <Button variant="link" className="cursor-pointer" onClick={()=>{router.push("/signup")}} >
                        Don't have an account? Sign Up
                    </Button>
                    <Button variant="link" className="cursor-pointer" onClick={()=>{router.push("/otp/forgot-password")}} >
                        Forgot Password?
                    </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}