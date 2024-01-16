import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('ProjectsPage', () => {

    const setup = () =>
    render( <App /> );

    test('should render without crashing', () => {
        setup();
        expect(screen).toBeDefined();
    });
  
    test('should load more projects when More... clicked', async () => {
        setup();
        const projectsLink = screen.getByRole('link', {name: 'Projects'})
        // eslint-disable-next-line testing-library/render-result-naming-convention
        const user = userEvent.setup();
        await user.click(projectsLink);

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
        expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(20);
        const moreButton = screen.getByRole('button', { name: /more/i });
        await user.click(moreButton);
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
        expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(40);

    });
});