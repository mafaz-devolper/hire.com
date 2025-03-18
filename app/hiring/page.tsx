import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, HeartHandshake, UserCheck, ClipboardList, Search, Briefcase, BadgeCheck, Users } from "lucide-react";

export default function HiringTipsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="space-y-16">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hiring Tips</h1>
                    <p className="text-xl text-muted-foreground mx-auto max-w-3xl">
                        Expert advice to help you navigate the hiring process, whether you're a job seeker or an employer.
                    </p>
                </div>

                {/* Tips for Job Seekers */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Tips for Job Seekers</h2>
                        <p className="text-lg text-muted-foreground mx-auto max-w-3xl">
                            Practical advice to help you stand out and land your dream job.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <Search className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Tailor Your Resume</h3>
                                <p className="text-muted-foreground text-center">
                                    Customize your resume for each job application to highlight relevant skills and experiences.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Prepare for Interviews</h3>
                                <p className="text-muted-foreground text-center">
                                    Research the company, practice common interview questions, and prepare thoughtful questions to ask.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <BadgeCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Showcase Achievements</h3>
                                <p className="text-muted-foreground text-center">
                                    Quantify your accomplishments with metrics and specific examples to demonstrate your impact.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tips for Employers */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Tips for Employers</h2>
                        <p className="text-lg text-muted-foreground mx-auto max-w-3xl">
                            Best practices to help you attract and hire top talent.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <ClipboardList className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Write Clear Job Descriptions</h3>
                                <p className="text-muted-foreground text-center">
                                    Clearly outline the role, responsibilities, and qualifications to attract the right candidates.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <UserCheck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Streamline the Hiring Process</h3>
                                <p className="text-muted-foreground text-center">
                                    Simplify application and interview processes to avoid losing top candidates to lengthy procedures.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Focus on Cultural Fit</h3>
                                <p className="text-muted-foreground text-center">
                                    Assess candidates not just for skills, but also for alignment with your company's values and culture.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* General Tips */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">General Hiring Tips</h2>
                        <p className="text-lg text-muted-foreground mx-auto max-w-3xl">
                            Useful advice for both job seekers and employers to improve the hiring process.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <Lightbulb className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Leverage Technology</h3>
                                <p className="text-muted-foreground text-center">
                                    Use AI tools and platforms to streamline resume screening, scheduling, and communication.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <ClipboardList className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Continuous Feedback</h3>
                                <p className="text-muted-foreground text-center">
                                    Provide timely feedback to candidates and employees to improve the hiring and onboarding experience.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                                    <HeartHandshake className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-center">Build Relationships</h3>
                                <p className="text-muted-foreground text-center">
                                    Foster long-term relationships with candidates, even if they aren't the right fit for the current role.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}