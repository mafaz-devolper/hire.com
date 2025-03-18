import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-bold">JobPortal</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talented professionals with top employers worldwide.
            </p>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-sm font-bold">For Candidates</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-muted-foreground hover:text-foreground">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/resources/resume" className="text-muted-foreground hover:text-foreground">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link href="/resources/career" className="text-muted-foreground hover:text-foreground">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-sm font-bold">For Recruiters</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/post-job" className="text-muted-foreground hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/hiring" className="text-muted-foreground hover:text-foreground">
                  Hiring Tips
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-muted-foreground hover:text-foreground">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-sm font-bold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
