import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Project } from '../../projects/Project';
import ProjectCard from '../../projects/ProjectCard';

describe('<ProjectCard />', () => {
  let project : Project;
  let editMock : jest.Mock;

  const setup = () => 
    render(
      <MemoryRouter>
        <ProjectCard project={project} onEdit={editMock} />
      </MemoryRouter>
    );

    beforeEach(() => {
      project = new Project({
        id: 1,
        name: 'Test project',
        descriptin: 'This should be rendered',
        budget: 1234
      });
      editMock = jest.fn();
    })

    // tests here

});

