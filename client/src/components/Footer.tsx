export default function Footer() {
  return (
    <footer className="border-t mt-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
        <p>© {new Date().getFullYear()} BookIt</p>
        <p>Made with ❤️ in India</p>
      </div>
    </footer>
  )
}
