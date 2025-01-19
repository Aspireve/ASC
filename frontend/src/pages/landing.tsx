'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <main className="relative min-h-screen bg-transparent">
        <Navbar />
        
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="p-8 w-full">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Get in touch</div>
                <h2 className="block mt-1 text-lg leading-tight font-medium text-black">Contact Us</h2>
                <p className="mt-2 text-gray-500">We'd love to hear from you. Please fill out this form.</p>
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <Textarea
                        name="message"
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      {/* <Link href="/"> */}
                        <Button type="button" variant="outline">
                          Back to Home
                        </Button>
                      {/* </Link> */}
                      <Button type="submit" className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

