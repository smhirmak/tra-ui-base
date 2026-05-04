import ThemeModeToggle from '@/components/ui/theme-mode-toggle.tsx';
import { Link } from '@tanstack/react-router';
// import LanguageSelect from '@/components/ui/language-select';
// import { setLocale, useLocale } from '@/lib/locale';

const Header = () => {
  // const locale = useLocale()
  return (
    <header className="flex items-center justify-between p-4">
      <Link to="/">
        <img
          src="/assets/logos/tra-ui-kit.png"
          alt="Logo"
          className="w-32"
        />
      </Link>
      <div className="flex items-center gap-4">
        <ThemeModeToggle />
        {/* <LanguageSelect
          locale={locale}
          setLocale={setLocale as (locale: string) => void}
          defaultValue="en"
        /> */}
      </div>
    </header>
  );
};

export default Header;
