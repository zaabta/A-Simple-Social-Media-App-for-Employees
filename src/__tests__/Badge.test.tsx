import { render, screen } from '@testing-library/react';
import Badge, { BadgeColor } from '@/components/Badge';

describe('Badge', () => {
    it('renders text correctly', () => {
        render(<Badge text="male" />);
        expect(screen.getByText('male')).toBeInTheDocument();
    });

    it('applies blue styles when color is BLUE', () => {
        render(<Badge text="city" color={BadgeColor.BLUE} />);
        const badge = screen.getByText('city');
        expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('applies pink styles when color is PINK', () => {
        render(<Badge text="female" color={BadgeColor.PINK} />);
        const badge = screen.getByText('female');
        expect(badge).toHaveClass('bg-pink-100', 'text-pink-700');
    });

    it('applies gray styles by default', () => {
        render(<Badge text="default" />);
        const badge = screen.getByText('default');
        expect(badge).toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('applies custom className', () => {
        render(<Badge text="custom" className="font-bold" />);
        expect(screen.getByText('custom')).toHaveClass('font-bold');
    });
});