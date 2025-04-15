"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { useDebounce } from "@uidotdev/usehooks";
import { LoaderCircle, RectangleEllipsis } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    isValidEmail
} from "@/lib/api/user";
import { otpEmailVerify, otpEmailRequest } from "@/lib/api/otp"

import { otpEmailVerify as otpEmailVerifySchema } from "@workspace/schema/otp"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"


export default function Page() {
    const form = useForm<z.infer<typeof otpEmailVerifySchema>>({
        resolver: zodResolver(otpEmailVerifySchema),
        defaultValues: {
            email: undefined,
            otp: undefined,
        },
    });
    const debouncedEmail = useDebounce(form.watch("email"), 500);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof otpEmailVerifySchema>) => {
        if (!isEmailSent) {
            toast.error("Please request an OTP first.");
            return;
        }
        try {
            const response = await otpEmailVerify(data);
            if (response?.status === "success") {
                toast.success("OTP verified successfully.");
                router.push("/signin");
            } else {
                toast.error("Failed to verify OTP. Please try again.");
            }
        }
        catch (error) {
            toast.error("An error occurred while verifying the OTP.");
        }
    }

    const otpRequest = async () => {
        const email = form.getValues("email");
        if (!email) {
            toast.error("Email is required to request OTP.");
            return;
        }
        try {
            const response = await otpEmailRequest({ email });
            if (response?.status === "success") {
                setIsEmailSent(true);
                toast.success("OTP sent to your email.");
            } else if (response?.status === 409) {
                setIsEmailSent(true);
                toast.error("OTP already exists. Please check your email.");
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred while requesting the OTP.");
        }
    }

    const handleReset = () => {
        setIsEmailSent(false);
        setIsCheckingEmail(false);
        form.reset({
            email: undefined,
            otp: undefined,
        })
        setEmailMessage("");
        setIsError(false);
    }

    useEffect(() => {
        if (debouncedEmail) {
            setIsCheckingEmail(true);
            isValidEmail(debouncedEmail).then((response) => {
                if (response?.data === true) {
                    setEmailMessage("Valid email address.");
                    setIsError(false);
                } else {
                    setEmailMessage("Invalid email address.");
                    setIsError(true);

                }
            }).catch(() => {
                setIsError(true);
            }).finally(() => {
                setIsCheckingEmail(false);
            });
        }
    }, [debouncedEmail]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="sm:w-96 w-full">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-xl">
                        Verify Email Address
                    </CardTitle>
                    <CardDescription className="text-center text-md text-gray-500 font-bold">
                        Enter your email address and request an OTP to verify your email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <Input {...field} placeholder="Enter your email" />
                                        <FormMessage />
                                        {isCheckingEmail && (
                                            <LoaderCircle className="animate-spin h-4 w-4" />
                                        )}
                                        {!isCheckingEmail && emailMessage && (
                                            <span
                                                className={cn(
                                                    `${emailMessage === "Valid email address."
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
                            <Button type="button" onClick={otpRequest} disabled={isCheckingEmail || isError} className="w-full cursor-pointer">
                                {isEmailSent ? (
                                    <span className="flex items-center justify-center">
                                        <RectangleEllipsis className="animate-spin h-4 w-4 mr-2" />
                                        Resend OTP
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <RectangleEllipsis className="animate-spin h-4 w-4 mr-2" />
                                        Request OTP
                                    </span>
                                )}
                            </Button>
                            {isEmailSent && (
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                Please enter the one-time password sent to your phone.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <Button type="submit" disabled={!isEmailSent} className="w-full cursor-pointer">{
                                form.formState.isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                                        Verifying OTP
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Verify OTP
                                    </span>
                                )
                            }</Button>
                            {isEmailSent && (
                                <Button type="button" onClick={handleReset} className="w-full cursor-pointer">Reset</Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => router.push("/signup")} className=" cursor-pointer">
                        Have not an account? Sign up
                    </Button>
                    <Button variant="link" onClick={() => router.push("/signin")} className=" cursor-pointer">
                        Already have an account? Sign in
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )

}
