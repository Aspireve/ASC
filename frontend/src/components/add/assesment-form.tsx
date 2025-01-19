import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle, FileCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from 'react-hot-toast'

const formSchema = z.object({
    pdf: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Please upload a PDF file")
        .refine(
            (files) => files[0]?.type === "application/pdf",
            "The file must be a PDF"
        ),
})

export default function AssesmentForm() {
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically handle the file upload
        console.log(values.pdf[0])
        setIsSuccess(true)
        if (values) {
            toast.success("Agreement uploaded successfully")
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Upload Agreement (PDF)</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pdf"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Upload PDF</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                onChange(e.target.files)
                                                setIsSuccess(false)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Upload PDF
                        </Button>
                    </form>
                </Form>

                {form.formState.errors.pdf && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {form.formState.errors.pdf.message}
                        </AlertDescription>
                    </Alert>
                )}

                {isSuccess && (
                    <Alert className="mt-4">
                        <FileCheck className="h-4 w-4 text-[#22c55e]" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            Your PDF has been successfully uploaded.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

