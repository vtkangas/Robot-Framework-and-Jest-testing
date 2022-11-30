import { projectReducer, initialProjectState } from '../../projects/state/projectReducer';
import { DELETE_PROJECT_SUCCESS } from '../../projects/state/projectTypes';
import { Project } from '../../projects/Project';
import { MOCK_PROJECTS } from '../../projects/MockProjects';

describe('project reducer', () => {
  test('should delete single project', () => {
    let state = initialProjectState;
    let projects = MOCK_PROJECTS;
    //poistettava projekti
    const projectToBeDeleted : Project = projects[0];
    //tila ennen poistoa
    const currentState = { ...state, projects: projects };
    //haluttu lopputulos
    const deleteSuccesState = {
      ...state,
      projects: projects.filter((project: Project) => project.id !== projectToBeDeleted.id),
    };
    //onnistuneen poiston jälkeen palautus vastaa haluttua lopputulosta
    expect(
      projectReducer(currentState, {
        type: DELETE_PROJECT_SUCCESS,
        payload: projectToBeDeleted,
      })
    ).toEqual(deleteSuccesState);
  });
});