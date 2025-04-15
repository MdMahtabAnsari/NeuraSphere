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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { signup as signupSchema } from "@workspace/schema/auth";
import { signup } from "@/lib/api/auth";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@uidotdev/usehooks";
import { LoaderCircle, Image } from "lucide-react";
import { useEffect, useState } from "react";
import {
    isUsernameAvailable,
    isEmailAvailable,
    isMobileAvailable,
} from "@/lib/api/user";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function Page() {
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: undefined,
            username: undefined,
            email: undefined,
            mobile: undefined,
            dob: undefined,
            bio: undefined,
            password: undefined,
            image: undefined,
        },
    });
    const debouncedUsername = useDebounce(form.watch("username"), 500);
    const debouncedEmail = useDebounce(form.watch("email"), 500);
    const debouncedMobile = useDebounce(form.watch("mobile"), 500);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isCheckingMobile, setIsCheckingMobile] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [mobileMessage, setMobileMessage] = useState("");

    const [isError, setIsError] = useState(false);

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        if (isError) {
            toast.error("Please fix the errors before submitting the form.");
            return;
        }
        try {
            const res = await signup(data);
            if (res?.status === "success") {
                toast.success("User created successfully");
                router.push("/otp/email");
            } else {
                toast.error("Error creating user");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error creating user");
        }
    };
    useEffect(() => {
        if (debouncedUsername) {
            setIsCheckingUsername(true);
            isUsernameAvailable(debouncedUsername)
                .then((res) => {
                    if (res.data === true) {
                        setUsernameMessage("Username is available");
                        setIsError(false);
                    } else {
                        setUsernameMessage("Username is not available");
                        setIsError(true);
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data);
                    setIsError(true);
                })
                .finally(() => {
                    setIsCheckingUsername(false);
                });
        }
    }, [debouncedUsername]);

    useEffect(() => {
        if (debouncedEmail) {
            setIsCheckingEmail(true);
            isEmailAvailable(debouncedEmail)
                .then((res) => {
                    if (res.data === true) {
                        setEmailMessage("Email is available");
                        setIsError(false);
                    } else {
                        setEmailMessage("Email is not available");
                        setIsError(true);
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data);
                    setIsError(true);
                })
                .finally(() => {
                    setIsCheckingEmail(false);
                });
        }
    }, [debouncedEmail]);

    useEffect(() => {
        if (debouncedMobile) {
            setIsCheckingMobile(true);
            isMobileAvailable(debouncedMobile)
                .then((res) => {
                    if (res.data === true) {
                        setMobileMessage("Mobile is available");
                        setIsError(false);
                    } else {
                        setMobileMessage("Mobile is not available");
                        setIsError(true);
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data);
                    setIsError(true);
                })
                .finally(() => {
                    setIsCheckingMobile(false);
                });
        }
    }, [debouncedMobile]);
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="sm:w-96 w-full">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        {isCheckingUsername && (
                                            <LoaderCircle className="animate-spin h-4 w-4" />
                                        )}
                                        {!isCheckingUsername && usernameMessage && (
                                            <span
                                                className={cn(
                                                    `${usernameMessage === "Username is available"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    } text-sm`
                                                )}
                                            >
                                                {usernameMessage}
                                            </span>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {isCheckingEmail && (
                                            <LoaderCircle className="animate-spin h-4 w-4" />
                                        )}
                                        {!isCheckingEmail && emailMessage && (
                                            <span
                                                className={cn(
                                                    `${emailMessage === "Email is available"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    } text-sm`
                                                )}
                                            >
                                                {emailMessage}
                                            </span>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your mobile number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {isCheckingMobile && (
                                            <LoaderCircle className="animate-spin h-4 w-4" />
                                        )}
                                        {!isCheckingMobile && mobileMessage && (
                                            <span
                                                className={cn(
                                                    `${mobileMessage === "Mobile is available"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    } text-sm`
                                                )}
                                            >
                                                {mobileMessage}
                                            </span>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your bio" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full cursor-pointer",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Select a date"}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Picture</FormLabel>
                                        <CldUploadWidget
                                            uploadPreset="profile_pic"

                                            onSuccess={(result) => {
                                                field.onChange(result?.info?.secure_url);
                                            }}
                                            options={{
                                                maxFiles: 1,
                                                maxImageWidth: 1000,
                                                maxImageHeight: 1000,
                                            }}
                                        >
                                            {({ open }) => (
                                                <Button type="button" onClick={() => open?.()} className="cursor-pointer" >
                                                    <Image className="mr-2" /> Upload Image
                                                </Button>
                                            )}
                                        </CldUploadWidget>
                                        <Avatar className="w-24 h-24 mx-auto mt-4">
                                            <AvatarImage src={field.value} alt="Profile Picture" />
                                            <AvatarFallback>PP</AvatarFallback>
                                        </Avatar>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="mt-4 w-full cursor-pointer"
                                disabled={
                                    isCheckingUsername ||
                                    isCheckingEmail ||
                                    isCheckingMobile ||
                                    isError || form.formState.isSubmitting
                                }
                            >
                                {form.formState.isSubmitting ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <LoaderCircle className="animate-spin h-4 w-4" />
                                        Creating account...
                                    </span>

                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col items-center justify-center w-full">
                        <Button variant="link" className="cursor-pointer" onClick={() => { router.push("/signin") }} >
                            Already have an account? Sign In
                        </Button>
                    </div>

                </CardFooter>
            </Card>
        </div>
    );
}
