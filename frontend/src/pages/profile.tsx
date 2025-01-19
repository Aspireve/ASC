import * as React from "react";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, FileText, MapPin } from 'lucide-react';
import axios from "axios";

interface ContactDetails {
    email: string;
    phone: string;
    website: string;
}

interface RegistrationDetails {
    registrationNumber: string;
    dateOfIncorporation: string;
    registeredCountry: string;
}

interface CompanyData {
    name: string;
    logoUrl: string;
    industry: string;
    description: string;
    address: string;
    country: string;
    contactDetails: ContactDetails;
    registrationDetails: RegistrationDetails;
    type: string;
}

type Status = 'idle' | 'success' | 'error';

const CompanyProfile: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>('idle');
    const [company, setCompany] = useState<CompanyData>({
        name: "",
        logoUrl: "",
        industry: "",
        description: "",
        address: "",
        country: "",
        contactDetails: {
            email: "",
            phone: "",
            website: "",
        },
        registrationDetails: {
            registrationNumber: "",
            dateOfIncorporation: "",
            registeredCountry: "",
        },
        type: "",
    });

    const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
    const accessToken = userToken ? userToken.accessToken : null;

    React.useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://asc-cuhd.onrender.com/v1/company/create", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response) {
                    throw new Error("Failed to fetch company data");
                }
                console.log(response.data.data[0]);
                setCompany({
                    ...response.data.data[0], registrationDetails: {
                        ...response.data.data[0].registrationDetails,
                        dateOfIncorporation: response.data.data[0].registrationDetails.dateOfIncorporation.split('T')[0]
                    }
                });
            } catch (error) {
                console.error("Error fetching company data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setCompany((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof Pick<CompanyData, 'contactDetails' | 'registrationDetails'>],
                    [field]: value,
                },
            }));
        } else {
            setCompany((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        console.log(company);

        try {
            const response = await axios.patch("https://asc-cuhd.onrender.com/v1//company/create", company, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response) {
                throw new Error('Failed to update company');
            }
            console.log('Company updated successfully');

            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error('Error updating company:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Company Profile</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {status === 'success' && (
                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>Company profile updated successfully!</AlertDescription>
                            </Alert>
                        )}

                        {status === 'error' && (
                            <Alert className="bg-red-50 text-red-800 border-red-200">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>Failed to update company profile. Please try again.</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company Name</label>
                                    <Input
                                        name="name"
                                        value={company.name}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Logo URL</label>
                                    <Input
                                        name="logoUrl"
                                        value={company.logoUrl}
                                        onChange={handleChange}
                                        placeholder="Enter logo URL"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Industry</label>
                                    <Input
                                        name="industry"
                                        value={company.industry}
                                        onChange={handleChange}
                                        placeholder="Enter industry"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company Type</label>
                                    <Input
                                        name="type"
                                        value={company.type}
                                        onChange={handleChange}
                                        placeholder="Enter company type"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    name="description"
                                    value={company.description}
                                    onChange={handleChange}
                                    placeholder="Enter company description"
                                    className="h-24"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Location
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <Input
                                        name="address"
                                        value={company.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <Input
                                        name="country"
                                        value={company.country}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Contact Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        name="contactDetails.email"
                                        value={company.contactDetails.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        type="tel"
                                        name="contactDetails.phone"
                                        value={company.contactDetails.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Website</label>
                                    <Input
                                        name="contactDetails.website"
                                        value={company.contactDetails.website}
                                        onChange={handleChange}
                                        placeholder="Enter website URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Registration Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Registration Number</label>
                                    <Input
                                        name="registrationDetails.registrationNumber"
                                        value={company.registrationDetails.registrationNumber}
                                        onChange={handleChange}
                                        placeholder="Enter registration number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date of Incorporation</label>
                                    <Input
                                        type="date"
                                        name="registrationDetails.dateOfIncorporation"
                                        value={company.registrationDetails.dateOfIncorporation}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Registered Country</label>
                                    <Input
                                        name="registrationDetails.registeredCountry"
                                        value={company.registrationDetails.registeredCountry}
                                        onChange={handleChange}
                                        placeholder="Enter registered country"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Company Profile'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default CompanyProfile;