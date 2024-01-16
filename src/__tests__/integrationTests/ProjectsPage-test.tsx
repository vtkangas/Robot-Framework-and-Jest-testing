import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from '../../projects/ProjectsPage';
import { MOCK_PROJECTS } from '../../projects/MockProjects';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../state';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Project } from '../../projects/Project';

let projectsDb : Project[] = MOCK_PROJECTS
let editButton : HTMLElement;
let form : HTMLElement;
let descTextbox : HTMLElement;
let saveButton : HTMLElement;
let editedDesc : HTMLElement


const handlers = [
	rest.get("http://localhost:4000/projects", (req, res, ctx) => {
        let projects = projectsDb
		return res(ctx.json(projects));
	}),
    rest.get("http://localhost:4000/projects/:id", (req, res, ctx) => {
        const id : number = Number(req.params.id);
        const project : Project | undefined = projectsDb.find((p: Project) => p.id === id);
        console.log(project)
          return res(ctx.json(project));
	}),
    rest.put("http://localhost:4000/projects/*", (req, res, ctx) => {
        return res(ctx.json(req.body));
    })
];

const server = setupServer(...handlers);

describe('ProjectsPage', () => {

    const setup = () =>
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProjectsPage />
            </MemoryRouter>
        </Provider>
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('should render without crashing', () => {
        setup();
        expect(screen).toBeDefined();
    });

    test('should display projectList', async () => {
        setup();
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
        expect(screen.getAllByRole('link')).toHaveLength(projectsDb.length);
    });
    

    test('should display changes when save clicked', async () => {
        setup();
        // eslint-disable-next-line testing-library/render-result-naming-convention
        const user = userEvent.setup();
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

        editButton = screen.getByRole('button', { name: /edit Editable/i });
        await user.click(editButton);

        form = screen.getByRole('form', {name: /edit a project/i,});        
        expect(form).toBeInTheDocument();

        descTextbox = screen.getByRole('textbox', { name: /project description/i});
        saveButton = screen.getByRole('button', { name: /save/i})
        await user.clear(descTextbox);
        await user.type(descTextbox, 'This thing has been edited');
        await user.click(saveButton);

        editedDesc= await screen.findByText('This thing has been edited...');
        expect(editedDesc).toBeInTheDocument();
    });
});