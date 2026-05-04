import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from '@/components/UserCard';
import { AUTH_FIELDS, GENDER, GUEST_FIELDS } from '@/constants';
import { SingleUser } from '@/types';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockUser: SingleUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    gender: GENDER.MALE,
    image: 'https://example.com/avatar.jpg',
    email: 'john@example.com',
    username: 'johndoe',
    phone: '123-456-7890',
    address: {
        address: '123 Main St',
        city: 'New York',
        coordinates: { lat: 0, lng: 0 },
        country: 'USA',
        postalCode: '10001',
        state: 'NY',
        stateCode: 'NY',
    },
    company: {
        title: 'Engineer',
        name: 'Acme Corp',
        address: {
            address: '1 Corp Ave',
            city: 'New York',
            coordinates: { lat: 0, lng: 0 },
            country: 'USA',
            postalCode: '10001',
            state: 'NY',
            stateCode: 'NY',
        },
    },
};

describe('UserCard', () => {
    beforeEach(() => mockPush.mockClear());

    it('shows only guest fields when GUEST_FIELDS passed', () => {
        render(<UserCard user={mockUser} visibleFields={GUEST_FIELDS} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/Age: 30/)).toBeInTheDocument();
        expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
        expect(screen.queryByText('@johndoe')).not.toBeInTheDocument();
    });

    it('shows all fields when AUTH_FIELDS passed', () => {
        render(<UserCard user={mockUser} visibleFields={AUTH_FIELDS} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('always navigates to user detail on click — middleware handles auth', () => {
        render(<UserCard user={mockUser} visibleFields={GUEST_FIELDS} />);
        fireEvent.click(screen.getByText('John Doe').closest('div')!);
        expect(mockPush).toHaveBeenCalledWith('/users/1');
    });

    it('renders user image', () => {
        render(<UserCard user={mockUser} visibleFields={AUTH_FIELDS} />);
        expect(screen.getByAltText('John')).toHaveAttribute('src', mockUser.image);
    });
});