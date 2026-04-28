import React from 'react'
import ThemeModeToggle from '@/components/theme-mode-toggle.tsx';

const Header = () => {
    return (
        <header>
            <img src="/logo.png" alt="Logo" />
            <div>
                <ThemeModeToggle />
            </div>
        </header>
    )
}

export default Header