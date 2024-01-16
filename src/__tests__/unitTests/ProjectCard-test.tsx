import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Project } from '../../projects/Project';
import ProjectCard from '../../projects/ProjectCard';

describe('ProjectCard', () => {
  let mockProject : Project;
  let handleEdit : jest.Mock;

  const setup = () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} onEdit={handleEdit} />
      </MemoryRouter>
    )
  };

  beforeEach(() => {
    mockProject = new Project({
                                id: 1,
                                name: 'Test Project',
                                imageUrl: '/assets/placeimg_500_300_arch1.jpg',
                                description: 'This text should be shortened. Exercitationem nulla ut ipsam vero quasi enim quos doloribus voluptatibus.',
                                budget: 1234,
                              });
    //valefunktio
    handleEdit = jest.fn();
  })

  it('should initially render', () => {
    setup();
  });
  
  it('should render project image', () => {
    setup();
    const displayedImage = screen.getByRole('img');
    expect(displayedImage).toHaveAttribute('src', mockProject.imageUrl);
  });

  it('should render projects information properly', () => {
    setup();
    const header = screen.getByRole('heading');
    const desc = screen.getByText(mockProject.description.substring(0, 60) + '...');
    const budget = screen.getByText(/budget : 1 234/i);
    expect(header).toHaveTextContent(mockProject.name);
    expect(desc).toBeInTheDocument();
    expect(budget).toBeInTheDocument();
  });
  
  it('should include link to project detail page', () => {
    setup();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/' + mockProject.id)
  });

  //tarkistetaan edit-painikkeen toimivuus valefunktion avulla
  test('handler called when edit clicked', async () => {
    setup();
    await userEvent.setup().click(screen.getByRole('button', { name: 'edit Test Project' }));
    expect(handleEdit).toBeCalledTimes(1);
    expect(handleEdit).toBeCalledWith(mockProject);
  });

});

