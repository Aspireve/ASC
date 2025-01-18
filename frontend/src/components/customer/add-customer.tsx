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
})

const AddCustomer = ({ refreshTable }: { refreshTable: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
        },
    })

    const [open, setOpen] = useState(false); // To control the dialog state
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
            setOpen(false); // Close the dialog upon success
            window.location.reload(); // Reload the page to reflect the changes
            refreshTable(); // Call the refreshTable function to refresh the table
        } catch (error) {
            console.log("Error adding customer", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='bg-[#3D8863] hover:bg-[#3D8863]'>
                    <UserRoundPlus /> Add Customer
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
                        <Button className='bg-[#3D8863]' type="submit">Add Customer</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCustomer
