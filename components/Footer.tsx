import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 py-6 px-8">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} Students Association of Satkhira.
          <span className="ml-1 text-xs">
            Developed by{" "}
            <strong>
              <Link href={"https://facebook.com/doomkey.apps"}>Doomkey</Link>
            </strong>
            .
          </span>
        </p>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-foreground transition-colors font-medium text-sm"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="hover:text-foreground transition-colors font-medium text-sm"
          >
            Admin Panel
          </Link>
        </nav>
      </div>
    </footer>
  );
}
