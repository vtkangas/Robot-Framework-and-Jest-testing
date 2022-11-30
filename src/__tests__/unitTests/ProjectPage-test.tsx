import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from "../../state";
import ProjectPage from "../../projects/ProjectPage";
import { url as projectsUrl } from '../../projects/projectAPI';
import { Project } from '../../projects/Project';
import { MOCK_PROJECTS } from '../../projects/MockProjects';
import renderer from 'react-test-renderer';

//annetaan käytettävän mock-projektin id useParams-hookille
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useParams: () => ({
    id: 4
  }),
  useRouteMatch: () => ({ url: `http://localhost:4000/projects/:id` }),
}));

//valepalvelin poimii id-parametrin ja etsii sen perusteella MOCK_PROJECTS-listasta halutun projektin tiedot
//ilman tätä projekti haettaisiin sovelluksen tietokannasta, mitä emme tietenkään halua yksikkötestissä tapahtuvan
const server = setupServer(
  rest.get("http://localhost:4000/projects/:id", (req, res, ctx) => {
    const id = Number(req.params.id);
    const project : any = MOCK_PROJECTS.find((p: Project) => p.id === id);
    
    if (project) {
      return res(ctx.json(project));
    } else {
      return res(ctx.status(404));
    }
  })
);

//poimitaan haluttu projekti muuttujaan testiä varten
const projectToFind : Project = MOCK_PROJECTS[3];

describe('<ProjectPage />', () => {

  //renderöidään komponentti
    function setup() {
        render(
        <Provider store={store}>
            <MemoryRouter>
              <ProjectPage />
            </MemoryRouter>
        </Provider>
        );
    }

    // käynnistetään, resetoidaan ja suljetaan palvelin halutuissa vaiheissa
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    
    test('should render without crashing', () => {
      setup();
    });

    //tarkistetaan sivun otsikko
    test('should display header', () => {
      setup();
      expect(screen.getByText(/project detail/i)).toBeInTheDocument();
    });

    //tarkistetaan, että "loading"-teksti näkyy projektin latautuessa
    test('should display loading', () => {
        setup();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    //tarkistetaan, että oikea mock-projekti latautuu ruudulle
    test('should display project', async () => {
      setup();
      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
      expect(screen.getByText(projectToFind.name)).toBeInTheDocument();

    });
});