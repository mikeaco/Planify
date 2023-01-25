import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import styled from 'styled-components';

const NavTitle = styled.h1`
font-style: normal;
font-weight: 400;
font-size: 36px;
line-height: 42px;

color: #BCB1B1;
margin-left: 5%;
`;


function NavBar() {
    return (
            <Sidebar backgroundColor="#332E2E;"
                rootStyles={{
                    position: 'absolute',
                    height: '100%',
                }} >
                <NavTitle> Planify </NavTitle>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => {
                            // only apply styles on first level elements of the tree
                            if (level === 0)
                                return {
                                    color: disabled ? '#f5d9ff' : '#ffffff',
                                    backgroundColor: active ? '#eecef9' : undefined,
                                    
                                };
                        },
                    }}
                >
                    <MenuItem> Home </MenuItem>
                    <MenuItem> My Account </MenuItem>
                    <MenuItem> Log Out</MenuItem>
                </Menu>
            </Sidebar>


    );
}

export default NavBar;
