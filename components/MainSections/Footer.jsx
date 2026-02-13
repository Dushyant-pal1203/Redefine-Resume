import React from 'react'

const Footer = () => {
    return (
        <div className="bg-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <div className="transition-colors text-gray-500">
                © 2026 Resume Builder. All rights reserved.
            </div>
            <div className="transition-colors text-gray-500">
                {" "}
                Designed & Built with Passion By Dushyant Pal
            </div>
        </div>
    )
}

export default Footer
