import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { useFetchUser } from '@/hook/useFetchUser'
import { toast } from 'react-hot-toast'

// Define the schema for the lawyer form
const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().regex(/^\d{10}$/, {
        message: "Please enter a valid 10-digit phone number.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    licenseNumber: z.string().min(2, {
        message: "licenseNumber must be at least 2 characters.",
    }),
})


// Define the Lawyer type
type Lawyer = z.infer<typeof formSchema> & { organization_id: string };

const Lawyers: React.FC = () => {
    const [lawyers, setLawyers] = useState<Lawyer[]>([])
    const { user } = useFetchUser()
    console.log(user)

    // Initialize the form
    const form = useForm<Lawyer>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            licenseNumber: "",
        },
    })

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    // Handle form submission
    async function onSubmit(values: Lawyer) {
        console.log(values)
        try {
            await axios.post("https://asc-cuhd.onrender.com/v1/lawyer/addLawyer", values, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("Lawyer added successfully")
            toast.success("Lawyer added successfully")
        } catch (error) {
            console.error("Error adding lawyer:", error)

        }
        fetchLawyers()

        // form.reset()
    }
    async function fetchLawyers() {
        try {
            const response = await axios.get(`https://asc-cuhd.onrender.com/v1/lawyer/addLawyer?companyId=${user?.company[0]}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setLawyers(response.data)
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching lawyers:", error)
        }
    }
    useEffect(() => {
        fetchLawyers()
    }
        , [user?.company[0]])



    return (
        <div className="container mx-auto p-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe" {...field} />
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
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter a 10-digit phone number.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Add licenseNumber firles */}
                            <FormField
                                control={form.control}
                                name="licenseNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>licenseNumber</FormLabel>
                                        <FormControl>
                                            <Input placeholder="licenseNumber" {...field} />
                                        </FormControl>
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
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Add Lawyer</Button>
                        </form>
                    </Form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Lawyer List</h2>
                    <Table>
                        <TableCaption>List of added lawyers</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lawyers.map((lawyer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{lawyer.name}</TableCell>
                                    <TableCell>{lawyer.email}</TableCell>
                                    <TableCell>{lawyer.phone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Lawyers

