import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Project } from '../../projects/Project';
import ProjectDetail from '../../projects/ProjectDetail';



describe('ProjectDetail', () => {
    let mockProject : Project;

    //renderöidään testattava komponentti
    const setup = () => {
        render(
          <MemoryRouter>
            <ProjectDetail project={mockProject} />
          </MemoryRouter>
        )
    };

    //asetetaan mock-projektille tiedot
    beforeEach(() => {
        mockProject = new Project({
                                    id: 1,
                                    name: 'Project detail test',
                                    imageUrl: '/assets/placeimg_500_300_arch1.jpg',
                                    description: 'This text should rendered to project detail component. Exercitationem nulla ut ipsam vero quasi enim quos doloribus voluptatibus.',
                                    budget: 1234,
                                    isActive: false,
                                  });
    });

    it('should render', () => {
        setup();
    });

    //varmistetaan kuva sen attribuuttien perusteella (alla kaksi tapaa)
    test('images alt attribute contains correct value', () => {
        setup();
        const testImage = screen.getByRole('img');
        expect(testImage).toHaveAttribute('alt', mockProject.name);
    });
    
    test('images src attribute contains correct value', () => {
        setup();
        const testImage = screen.getByRole('img');
        expect(testImage).toHaveAttribute('src', mockProject.imageUrl);
    });

    //tarkistetaan otsikko
    test('should contain header', () => {
        setup();
        const header = screen.getByRole('heading');
        expect(header).toHaveTextContent(mockProject.name);
    });
    
    //tarkistetaan kuvaus
    test('should contain description', () => {
        setup();
        expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    });
    
    //tarkistetaan budjetti
    test('budget should be rendered', () => {
        setup();
        expect(screen.getByText(/budget/i)).toHaveTextContent(`${mockProject.budget}`);
    });
    
    //tarkistetaan päiväys
    test('signing day of contract should be rendered properly', () => {
        setup();
        expect(screen.getByText(/signed/i)).toHaveTextContent(`${mockProject.contractSignedOn.toLocaleDateString()}`);
    });
    
    //tarkistetaan aktiivisuusmerkin toiminto. (teksti määriytyy komponentissa ternaryn avulla isActive-ominaisuuden perusteella)
    test('is active info should be inactive', () => {
        setup();
        expect(screen.getByText(/active/i)).toHaveTextContent('inactive');
    });

    test('is active info should be active', () => {
        // need to change isActive value to true for this test
        mockProject = {
            ...mockProject,
            isActive: true,
            isNew: false
        }
        setup();
        expect(screen.getByText(/active/i)).toHaveTextContent('active');
    });

});