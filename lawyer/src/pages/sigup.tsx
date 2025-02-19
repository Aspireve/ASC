import * as React from "react";
import { useState } from "react";
import BackgroundVd from "../assets/Background Vid.mp4";
import axios from "axios";
import * as moment from "moment-timezone"; // Import moment-timezone

interface SignupFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    picture: string;
    timezone: string;
}

const SignupPage: React.FC = () => {
    const [formValues, setFormValues] = useState<SignupFormValues>({
        name: "",
        email: "",
        phone: "",
        password: "",
        picture: "",
        timezone: "",
    });

    // Get a list of all timezones
    const timezones = moment.tz.names();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log("Form submitted:", formValues);
        formValues.picture = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
        formValues.timezone = formValues.timezone || "Asia/Kolkata"; // Default to "Asia/Kolkata" if no timezone selected
        try {
            await axios.post("https://asc-cuhd.onrender.com/v1/auth/register", formValues);
            console.log("User signed up successfully");
        }
        catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gray-900 overflow-hidden font-dm-sans">
            {/* Background video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
                src={BackgroundVd}
                autoPlay
                loop
                muted
            />

            {/* Gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-gray-800 to-transparent"></div>

            {/* Signup form */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl shadow-2xl p-8 w-96 backdrop-blur-lg bg-opacity-70 border border-gray-600"
                >
                    <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
                        Create an Account
                    </h2>

                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className="mt-2 block w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-500 text-white focus:ring-4 focus:ring-blue-500 focus:outline-none"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            className="mt-2 block w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-500 text-white focus:ring-4 focus:ring-blue-500 focus:outline-none"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            className="mt-2 block w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-500 text-white focus:ring-4 focus:ring-blue-500 focus:outline-none"
                            placeholder="+1234567890"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            className="mt-2 block w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-500 text-white focus:ring-4 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Timezone dropdown */}
                    <div className="mb-5">
                        <label
                            htmlFor="timezone"
                            className="block text-sm font-semibold text-gray-300"
                        >
                            Time Zone
                        </label>
                        <select
                            id="timezone"
                            name="timezone"
                            value={formValues.timezone}
                            onChange={handleChange}
                            className="mt-2 block w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-500 text-white focus:ring-4 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="" disabled>
                                Select Time Zone
                            </option>
                            {timezones.map((timezone) => (
                                <option key={timezone} value={timezone}>
                                    {timezone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:outline-none"
                    >
                        Sign Up
                    </button>

                    <p className="mt-4 text-center text-gray-400 text-sm">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-400 hover:text-blue-500 font-semibold"
                        >
                            Log In
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
