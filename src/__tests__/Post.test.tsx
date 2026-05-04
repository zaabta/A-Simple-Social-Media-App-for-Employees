import { render, screen } from '@testing-library/react';
import Post from '@/components/Post';

const mockPost = {
    title: 'Test Post Title',
    body: 'This is the body of the test post.',
    tags: ['tech', 'nextjs'],
    reactions: { likes: 10, dislikes: 2 },
};

describe('Post', () => {
    it('renders title and body', () => {
        render(<Post {...mockPost} />);
        expect(screen.getByText('Test Post Title')).toBeInTheDocument();
        expect(screen.getByText('This is the body of the test post.')).toBeInTheDocument();
    });

    it('renders all tags', () => {
        render(<Post {...mockPost} />);
        expect(screen.getByText('tech')).toBeInTheDocument();
        expect(screen.getByText('nextjs')).toBeInTheDocument();
    });

    it('renders likes and dislikes', () => {
        render(<Post {...mockPost} />);
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders without tags gracefully', () => {
        render(<Post title="No Tags" body="Body" />);
        expect(screen.getByText('No Tags')).toBeInTheDocument();
    });

    it('renders without reactions gracefully', () => {
        render(<Post title="No Reactions" body="Body" tags={[]} />);
        expect(screen.getByText('No Reactions')).toBeInTheDocument();
        expect(screen.queryByAltText('Like')).not.toBeInTheDocument();
    });
});