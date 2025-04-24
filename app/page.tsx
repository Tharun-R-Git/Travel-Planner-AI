import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Travel Planner</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Plan Your Perfect Trip</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Let AI create personalized travel itineraries based on your preferences.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Personalized Itineraries</h3>
                <p className="text-muted-foreground">
                  Get custom travel plans based on your preferences and interests.
                </p>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Local Recommendations</h3>
                <p className="text-muted-foreground">
                  Discover attractions, dining options, and experiences loved by locals.
                </p>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Smart Planning</h3>
                <p className="text-muted-foreground">
                  Save time with AI-generated itineraries that optimize your travel experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AI Travel Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

