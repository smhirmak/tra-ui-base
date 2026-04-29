// import LanguageSelect from '@/components/language-select';
import ThemeModeToggle from '@/components/theme-mode-toggle.tsx';
// import { setLocale, useLocale } from '@/lib/locale';
import { Link } from '@tanstack/react-router';

const Header = () => {
    // const locale = useLocale()
    return (
        <header className='flex items-center justify-between p-4'>
            <Link to="/">
                <img src="/assets/logos/tra-ui-kit.png" alt="Logo" className='w-32' />
            </Link>
            <div>
                <ThemeModeToggle />
                {/* <LanguageSelect
                    locale={locale}
                    setLocale={setLocale as (locale: string) => void}
                    defaultValue="en"
                /> */}
            </div>
        </header>
    )
}

export default Header