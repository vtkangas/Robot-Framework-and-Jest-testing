*** Settings ***
Documentation       A test suite for end to end testing

Library             SeleniumLibrary
Library             JSONLibrary

*** Variables ***
${BROWSER}          Chrome
${SERVER}           localhost:3000

${HOME URL}         http://${SERVER}/
${PROJECTS URL}     http://${SERVER}/projects/




*** Test Cases ***
Test 1: User wants to edit project from second page
    Open App
    ${PROJECT NAME}        Set Variable        Dillesik LLCs
    ${NEW NAME}            Set Variable        Dillesik LLCs Updated
    Click Link      Projects
    Wait Until Page Does Not Contain    Loading...
    Click Button                        More...
    Wait Until Page Does Not Contain    Loading...

    Click Button                        xpath://button[@aria-label='edit ${PROJECT NAME}']
    Wait Until Page Contains Element    name:name
    Click Element                       name:name
    Input Text                          name:name   ${NEW NAME}
    Click Button                        Save
    Wait Until Page Contains                        ${NEW NAME}
    Page Should Contain                             ${NEW NAME}

    #clean test changes
    Click Button                        xpath://button[@aria-label='edit ${NEW NAME}']
    Wait Until Page Contains Element    name:name
    Click Element                       name:name
    Input Text                          name:name   ${PROJECT NAME}
    Click Button                        Save
    Wait Until Page Contains Element    xpath://img[@alt='${PROJECT NAME}']    
    Close Browser        

Test 2: User gives too short name to project
    ${PROJECT NAME}        Set Variable        Anderson LLC
    ${INVALID NAME}        Set Variable        An
    Open App

    Click Link      Projects
    Wait Until Page Does Not Contain    Loading...
    Click Button                        xpath://button[@aria-label='edit ${PROJECT NAME}']
    Wait Until Page Contains Element    name:name
    Click Element                       name:name
    Input Text                          name:name   ${INVALID NAME}

    Wait Until Page Contains Element    tag:p >> xpath://*[contains(text(), 'Name needs to be at least 3 characters.')]
    Click Button                        Save
    Click Element                       name:name
    Input Text                          name:name   ${PROJECT NAME}
    Wait Until Page Does Not Contain Element    tag:p >> xpath://*[contains(text(), 'Name needs to be at least 3 characters.')]
    Click Button                        Save
    Wait Until Page Contains Element    //img[@alt='${PROJECT NAME}'] 
    Page Should Contain                 ${PROJECT NAME}           
    
    Close Browser

Test 3: User checks project activity (detail page) and changes it
    ${PROJECT NAME}        Set Variable        Armstrong - Hands
    Open Browser           http://localhost:3000/projects/95

    Wait Until Page Does Not Contain    Loading...
    Page Should Contain                 inactive

    Click Link                          Projects
    Wait Until Page Does Not Contain    Loading...
    
    Click Button                        xpath://button[@aria-label='edit ${PROJECT NAME}']
    Select Checkbox                     isActive

    Click Button                        Save
    Wait Until Page Contains Element    //img[@alt='${PROJECT NAME}'] 

    Click Element                       //*[contains(text(), '${PROJECT NAME}')]
    Location Should Be                  http://localhost:3000/projects/95
    Wait Until Page Does Not Contain    Loading...
    Page Should Contain                 active

    #clean test changes
    Go To                               http://localhost:3000/projects/
    Wait Until Page Does Not Contain    Loading...
    Click Button                        xpath://button[@aria-label='edit ${PROJECT NAME}']
    Unselect Checkbox                   isActive
    Click Button                        Save
    Wait Until Page Contains Element    //img[@alt='${PROJECT NAME}']

    Close Browser

Test 4: User edits project, closes browser and checks that changes are still there
    ${PROJECT NAME}        Set Variable        Crona Inc
    ${NEW NAME}            Set Variable        Crona Inc Updated
    Open Browser    http://localhost:3000/projects/
    Wait Until Page Does Not Contain    Loading...

    Click Button                        xpath://button[@aria-label='edit ${PROJECT NAME}']
    Wait Until Page Contains Element    name:name
    Click Element                       name:name
    Input Text                          name:name   ${NEW NAME}
    Click Button                        Save
    Wait Until Page Contains                        ${NEW NAME}
    Page Should Contain                             ${NEW NAME}

    Close Browser
    Sleep                               3s
    Open Browser                        http://localhost:3000/projects/
    Wait Until Page Does Not Contain    Loading...
    Page Should Contain                 ${NEW NAME}

    #clean test changes
    Go To                               http://localhost:3000/projects/
    Click Button                        xpath://button[@aria-label='edit ${NEW NAME}']
    Click Element                       name:name
    Input Text                          name:name   ${PROJECT NAME}
    Click Button                        Save
    Wait Until Page Contains Element    //img[@alt='${PROJECT NAME}']

    Close Browser

Test 5: User wants to view all projects
    #napataan projektien lukumäärä muuttujaan length
    ${file}        Load Json From File    ${CURDIR}${/}..\\..\\..\\api\\db.json
    ${projects}    Get Value From Json    ${file}    $.projects
    ${length}  Get length  ${projects[0]}
    
    Open Browser                        http://localhost:3000/projects/
    Wait Until Page Does Not Contain    Loading...
    ${count}        Get Element Count   class:card
    ${oldCount}     Set Variable        0
    #ladataan ProjectCard-komponentteja kunnes niitä ei enää lataudu
    WHILE     ${count} != ${oldCount}
        ${oldCount}     Set Variable    ${count}
        Click Button                        More...
        Wait Until Page Does Not Contain    Loading...
        ${count}        Get Element Count   class:card            
    END

    Log To Console      projects: ${length}
    Log To Console      project cards: ${count}
    Close Browser
    #korttien lukumäärä pitäisi vastata projektien lukumäärää
    Should Be True      ${count} == ${length}
    

    

*** Keywords ***
Open App
    Open browser    ${HOME URL}    ${BROWSER}
    Maximize Browser Window

Projects Page Should Be Open
    Location Should Be                  ${PROJECTS URL}
    Wait Until Page Contains Element    tag:h1 >> xpath://*[contains(text(), 'Projects')]
    Wait Until Page Contains Element    class:card

Home Page Should Be Open
    Location Should Be                  ${HOME URL}
    Wait Until Page Contains Element    tag:h2 >> xpath://*[contains(text(), 'Home')]

Go To Projects Page
    Go To   ${PROJECTS URL}
    Wait Until Page Does Not Contain    Loading...
    Projects Page Should Be Open

Open Edit View
    Go To Projects Page
    Click Button                        Edit
    Wait Until Page Contains Element    name:name


Submit Changes
    Click Button                                 Save
    Wait Until Page Does Not Contain Element     Save

    