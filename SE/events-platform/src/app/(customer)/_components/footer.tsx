import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-primary pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex w-full max-2xl:mx-8">
            <div className="w-1/2 text-left text-white max-sm:hidden">
              <ul className="list-none font-light text-md flex gap-2">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/events">Events</Link>
                </li>
                <li>
                  <Link href="/orders">Orders</Link>
                </li>
              </ul>
            </div>
            <div className="max-sm:w-full max-sm:justify-center w-1/2 text-white flex items-center justify-end">
              <p className="text-3xl">
                Splend<span className="font-extrabold">Event</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full text-center mt-4 text-white">
          <a target="_blank" href="https://www.duckpixel.com">
            © {currentYear} Andrew Ward-Jones
          </a>
        </div>
      </div>
    </div>
  );
}
