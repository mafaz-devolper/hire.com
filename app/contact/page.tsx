import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="flex flex-col h-full">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4 flex-grow space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide as much detail as possible..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <Button className="w-full">Send Message</Button>
            </CardFooter>
          </Card>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="px-6 pt-6">
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Here's how you can reach us directly.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-6">
                <div className="flex space-x-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Our Office</h3>
                    <address className="text-gray-600">
                      123 Employment Avenue<br />
                      Suite 456<br />
                      San Francisco, CA 94103<br />
                      United States
                    </address>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@jobportal.com" className="hover:text-primary">
                        info@jobportal.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      We aim to respond within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-gray-600">
                      <a href="tel:+1-555-123-4567" className="hover:text-primary">
                        +1 (555) 123-4567
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      Mon-Fri, 9:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-6 pt-6">
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4">
                <div>
                  <h3 className="font-medium">How do I create an account?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Click the "Sign Up" button in the top right corner.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Is it free to post a job?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We offer both free and premium options. Check our pricing page.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How can I update my resume?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Log into your account and head to the "Profile" section.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">View All FAQs</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="w-full h-[400px] rounded-lg overflow-hidden border bg-gray-100">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019394415519!2d-122.43129718468122!3d37.77397297975885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808ab5693b01%3A0xc00d932649d5bb8d!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1655071639666!5m2!1sen!2sus"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
