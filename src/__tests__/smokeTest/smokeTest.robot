*** Settings ***
Documentation       A test suite for very simple smoke tests

Library             SeleniumLibrary
Suite Setup         Open App
Suite Teardown      Close Browser

*** Variables ***
${BROWSER}          Firefox
${SERVER}           localhost:3000

#project that we use for checking Project Detail-page
${PROJECT NAME}     Anderson LLC
${PROJECT ID}       54

#valid inputs for edit form
${VALID NAME}           ABC
${VALID DESC}           Savutestiteksti
${VALID BUDGET}         1009

${HOME URL}         http://${SERVER}/
${PROJECTS URL}     http://${SERVER}/projects/
${DETAIL URL}       http://${SERVER}/projects/${PROJECT ID}


*** Test Cases ***
Test 1: Startup Check
    Location Should Be              ${HOME URL}
    Page Should Contain Link        Home
    Page Should Contain Link        Projects   

Test 2: Navigations
    Click Link                      Projects
    Projects Page Should Be Open

    Click Element                   //*[contains(text(), '${PROJECT NAME}')]
    Detail Page Should Be Open

    Click Link                      Home
    Home Page Should Be Open

Test 3: Edit Function
    Open Edit View
    Input Valid Name
    Input Valid Description
    Input Valid Budget
    Select Checkbox                 isActive            
    Submit Changes
    Check Changes

Test 4: Load Function
    Go To Projects Page
    ${count}        Get Element Count   class:card
    Click Button                        More...
    Wait Until Page Does Not Contain    Loading...
    ${newCount}     Get Element Count   class:card
    Should Be True                      ${count} < ${newCount}

    Sleep   3s

*** Keywords ***
Open App
    Open browser    ${HOME URL}    ${BROWSER}
    Maximize Browser Window

Projects Page Should Be Open
    Location Should Be                  ${PROJECTS URL}
    Wait Until Page Contains Element    tag:h1 >> xpath://*[contains(text(), 'Projects')]
    Wait Until Page Contains Element    class:card

Detail Page Should Be Open
    Location Should Be                  ${DETAIL URL}
    Wait Until Page Contains Element    tag:h1 >> xpath://*[contains(text(), 'Project Detail')]
    Wait Until Page Contains Element    tag:h3 >> xpath://*[contains(text(), '${PROJECT NAME}')]

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

Input Valid Name
    Click Element                   name:name
    Input Text                      name:name   ${VALID NAME}

Input Valid Description 
    Wait Until Element Is Visible   tag:textarea
    Input Text                      tag:textarea   ${VALID DESC}

Input Valid Budget
    Click Element                   name:budget
    Input Text                      name:budget     ${VALID BUDGET}

Submit Changes
    Click Button                                 Save
    Wait Until Page Does Not Contain Element     Save

Check Changes
    Go To Projects Page
    Click Element                   //*[contains(text(), '${VALID NAME}')]
    Wait Until Page Contains        Project Detail
    Wait Until Page Contains        ${VALID NAME}
    Page Should Contain             ${VALID DESC}
    Page Should Contain             ${VALID BUDGET}
    Page Should Contain             active
    