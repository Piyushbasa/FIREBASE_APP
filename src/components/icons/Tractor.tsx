export function Tractor(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3 4h9l1 3.5-3.5 4-6.5-1.5V4z" />
            <path d="M18 11c-2.5 0-4.2-1.3-5-3" />
            <path d="M5 15h.01" />
            <path d="M10 15h.01" />
            <circle cx="18" cy="18" r="3" />
            <circle cx="7" cy="18" r="4" />
        </svg>
    )
}
