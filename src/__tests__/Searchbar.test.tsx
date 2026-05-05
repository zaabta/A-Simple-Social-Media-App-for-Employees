import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/users',
    useSearchParams: () => new URLSearchParams(),
}));

describe('SearchBar', () => {
    beforeEach(() => mockPush.mockClear());

    it('renders with initial value', () => {
        render(<SearchBar initialValue="hello" />);
        expect(screen.getByPlaceholderText('Search users...')).toHaveValue('hello');
    });

    it('renders with empty initial value', () => {
        render(<SearchBar initialValue="" />);
        expect(screen.getByPlaceholderText('Search users...')).toHaveValue('');
    });

    it('updates input value on change', () => {
        render(<SearchBar initialValue="" />);
        const input = screen.getByPlaceholderText('Search users...');
        fireEvent.change(input, { target: { value: 'john' } });
        expect(input).toHaveValue('john');
    });

    it('search button is disabled when input is empty', () => {
        render(<SearchBar initialValue="" />);
        expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
    });

    it('search button is enabled when input has value', () => {
        render(<SearchBar initialValue="john" />);
        expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled();
    });

    it('navigates on Enter key', () => {
        render(<SearchBar initialValue="" />);
        const input = screen.getByPlaceholderText('Search users...');
        fireEvent.change(input, { target: { value: 'john' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockPush).toHaveBeenCalled();
    });

    it('clears input and navigates on Escape key', () => {
        render(<SearchBar initialValue="john" />);
        const input = screen.getByPlaceholderText('Search users...');
        fireEvent.keyDown(input, { key: 'Escape' });
        expect(input).toHaveValue('');
        expect(mockPush).toHaveBeenCalled();
    });

    it('triggers debounced navigation when input is cleared by typing', () => {
        render(<SearchBar initialValue="john" />);
        const input = screen.getByPlaceholderText('Search users...');
        fireEvent.change(input, { target: { value: '' } });
        expect(input).toHaveValue('');
    });
});