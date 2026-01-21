"use client"

import { useState, useEffect } from "react"
import { getSiteSettings, DEFAULT_CONTACT_INFO } from "@/lib/settings"

export function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false)
    const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_CONTACT_INFO.whatsapp_number)

    useEffect(() => {
        // Fetch WhatsApp number from settings
        getSiteSettings().then(settings => {
            if (settings?.whatsapp_number) {
                setWhatsappNumber(settings.whatsapp_number)
            }
        })

        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const handleClick = () => {
        const message = encodeURIComponent("Hello! I'd like to know more about your services.")
        const url = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(url, "_blank")
    }

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
            aria-label="Contact us on WhatsApp"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white" className="w-6 h-6">
                <path d="M16 0C7.164 0 0 7.164 0 16c0 2.82.734 5.567 2.125 7.99L0 32l8.27-2.164A15.86 15.86 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.09a13.07 13.07 0 0 1-6.656-1.82l-.477-.285-4.91 1.285 1.309-4.785-.309-.492A13.06 13.06 0 1 1 16 29.09zm7.418-9.828c-.406-.203-2.402-1.184-2.773-1.32-.37-.137-.64-.203-.91.203-.27.406-1.047 1.32-1.285 1.59-.238.27-.473.305-.879.102-.406-.203-1.715-.633-3.266-2.02-1.207-1.078-2.02-2.41-2.258-2.816-.238-.406-.025-.625.18-.828.184-.183.406-.477.61-.715.203-.238.27-.406.406-.676.137-.27.07-.508-.035-.71-.105-.203-.91-2.195-1.25-3.004-.332-.797-.668-.688-.91-.7l-.773-.015c-.27 0-.71.102-1.082.508-.37.406-1.418 1.387-1.418 3.383 0 1.996 1.453 3.926 1.656 4.195.203.27 2.86 4.367 6.926 6.125.968.418 1.723.668 2.309.855.969.309 1.852.266 2.55.16.777-.117 2.402-.98 2.742-1.93.34-.95.34-1.766.238-1.93-.102-.164-.37-.266-.777-.469z" />
            </svg>
        </button>
    )
}
