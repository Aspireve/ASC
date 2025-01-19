import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

const AddCustomer = ({ refreshTable }: { refreshTable: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    const [open, setOpen] = useState(false); // To control the dialog state
    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            await axios.post(`https://asc-cuhd.onrender.com/v1/agree/customer`, values, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            console.log("Customer added successfully")
            toast.success("Customer added successfully")
            setOpen(false); // Close the dialog upon success
            setTimeout(() => {
                window.location.reload(); // Reload the page after 1 second
            }, 1000); // Reload the page to reflect the changes
            refreshTable(); // Call the refreshTable function to refresh the table
        } catch (error) {
            console.log("Error adding customer", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className='bg-white '>
                    <div className='group relative cursor-pointer p-2 w-36 border bg-white rounded-full overflow-hidden text-black text-center font-semibold'>
                        <span className='translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300 inline-block'>
                            Add Customer
                        </span>
                        <div className='flex gap-2 text-white bg-green-800 z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none '>
                            <span>Add Customer</span>
                        </div>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className='font-dm-sans'>
                <DialogHeader>
                    <DialogTitle className='font-dm-sans'>Add New Customer</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
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

                        <button className='group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r dark:from-green-500 dark:to-green-700 from-green-300 to-green-500 dark:border-[rgb(76_100_255)] border-2 border-[#263381] bg-transparent px-6 font-medium dark:text-white text-black transition-all duration-100 [box-shadow:5px_5px_rgb(38_51_129)] dark:[box-shadow:5px_5px_rgb(76_100_255)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(38_51_129)] dark:hover:[box-shadow:0px_0px_rgb(76_100_255)]'>
                            Add Customer
                        </button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCustomer
