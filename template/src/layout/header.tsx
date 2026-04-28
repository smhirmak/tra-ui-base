import ThemeModeToggle from '@/components/theme-mode-toggle.tsx';
import { Link } from '@tanstack/react-router';

const Header = () => {
    return (
        <header className='flex items-center justify-between p-4'>
            <Link to="/">
                <img src="/assets/logos/tra-ui-kit.png" alt="Logo" className='w-32' />
            </Link>
            <div>
                <ThemeModeToggle />
            </div>
        </header>
    )
}

export default Header