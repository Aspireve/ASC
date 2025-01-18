import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBigRight, ArrowRight } from 'lucide-react';
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRoundPlus } from 'lucide-react'
import axios from 'axios'

const formSchema = z.object({
    fullname: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    // phone: z.string().regex(/^\d{10}$/, {
    //     message: "Please enter a valid 10-digit phone number.",
    // }),
})

const AddCustomer = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            // phone: "",
        },
    })

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            await axios.post(`http://localhost:5000/v1/agree/customer`, values, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            console.log("Customer added successfully")
        } catch (error) {
            console.log("Error adding customer", error)
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <div className='group relative cursor-pointer p-2 w-32 border bg-white rounded-full overflow-hidden text-black text-center font-semibold'>
                        <span className='translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300 inline-block'>
                            Our Work
                        </span>
                        <div className='flex gap-2 text-white bg-green-400 z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none '>
                            <span>Our Work</span>
                        </div>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                        <Input type="email" placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <Button type="submit">Add Customer</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCustomer