import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Project } from '../../projects/Project';
import ProjectForm from '../../projects/ProjectForm';
import { store } from '../../state';

describe('ProjectForm', () => {
    let projectInfo : Project;
    let updateInputs : Project;
    let onCancelMock : jest.Mock;
    let nameTextBox : HTMLElement;
    let descTextBox : HTMLElement;
    let budgetTextBox : HTMLElement;
    let checkbox : HTMLElement;


    const setup = () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectForm project={projectInfo} onCancel={onCancelMock}/>
                </MemoryRouter>
            </Provider>
        )
        
        //input-kentät
        nameTextBox = screen.getByRole('textbox', { name: /project name/i,});
        descTextBox = screen.getByRole('textbox', { name: /project description/i,});
        budgetTextBox = screen.getByRole('spinbutton', { name: /project budget/i,});
        checkbox = screen.getByRole('checkbox', { name: /project isActive/i, });

    };

    beforeEach( () => {
        //määritetään 2 mock-projektia, joita hyödynnetään lomakkeen testauksessa
        projectInfo = new Project({
            id: 1,
            name: 'Test Project',
            description: 'Test text for description input. Exercitationem nulla ut ipsam vero quasi enim quos doloribus voluptatibus.',
            budget: 1234,
            isActive: false
        });
        updateInputs = new Project({
            name: 'Update Inputs',
            description: 'Update text for description input. YOLO SWAG SWAG et cetera',
            budget: 4321
        });
        onCancelMock = jest.fn();
    });

    //tarkistetaan lomakkeen kenttien tiedot
    it('should load projectInfo into input fields', () => {
        setup();
        expect(
            screen.getByRole('form'))
        .toHaveFormValues({
            name: projectInfo.name,
            description: projectInfo.description,
            budget: projectInfo.budget,
            isActive: projectInfo.isActive,
        });
    });

    //tarkistetaan lomakkeen napit
    it('should render "save" & "cancel" buttons', async () => {
        setup();
        const saveButton = screen.getByRole('button', { name: /save/i,});
        const cancelButton = screen.getByRole('button', { name: /cancel/i,});
        expect(saveButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    })

    //testataan, että lomakkeen kentät hyväksyvät uudet syötteet
    it('should accept input changes', async () => {
        setup();
        //luodaan userEvent
        const user = userEvent.setup();
        //tyhjennetään tekstikenttä
        await user.clear(nameTextBox);
        //syötetään uusi tieto
        await user.type(nameTextBox, updateInputs.name);
        //varmistetaan kentän uusi arvo
        expect(nameTextBox).toHaveValue(updateInputs.name);

        await user.clear(descTextBox);
        await user.type(descTextBox, updateInputs.description);
        expect(descTextBox).toHaveValue(updateInputs.description);
    
        await user.clear(budgetTextBox);
        await user.type(budgetTextBox, updateInputs.budget.toString());
        expect(budgetTextBox).toHaveValue(updateInputs.budget);

        //testataan checkboxin toimivuus
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    //testataan virheilmoitukset
    test('name should display no name validation', async () => {
        setup();
        let errorMessage : string = 'Name is required';
        const user = userEvent.setup();
        await user.clear(nameTextBox);
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });

    test('name should display minlength validation', async () => {
        setup();
        let errorMessage : string = 'Name needs to be at least 3 characters.';
        const user = userEvent.setup();
        await user.clear(nameTextBox);
        await user.type(nameTextBox, 'ab');
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });

    test('description should display no description validation', async () => {
        setup();
        let errorMessage : string = 'Description is required.';
        const user = userEvent.setup();
        await user.clear(descTextBox);
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });

    test('budget should display more then 0 validation', async () => {
        setup();
        let errorMessage : string = 'Budget must be more than $0.';
        const user = userEvent.setup();
        await user.clear(budgetTextBox);
        await user.type(budgetTextBox, '0');
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
    
});
