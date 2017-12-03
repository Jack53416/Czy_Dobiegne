import React from 'react';
import styles from '../../styles/sideBarMenu.scss';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem, Glyphicon} from 'react-bootstrap';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.items = props.items;
    }

    render() {
        return ( 
            <div id="sidebar-menu" className={styles.sideBarMenuContainer}>
            <Navbar fluid className={styles.sidebar} inverse >

                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Czy dobiegnę?</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Navbar.Text className={styles.userMenu}>
                        <Navbar.Link href="#"><Glyphicon glyph="home"/></Navbar.Link>
                       
                    </Navbar.Text>
                    <Nav>
                        <NavDropdown id="dropdown1" eventKey={1} title="Item 1">
                            <MenuItem eventKey={1.1} href="#">Item 1.1</MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={2}>Item 2</NavItem>
                        <NavItem eventKey={3}>Item 3</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem href="/register"><Glyphicon glyph="user"/> Zarejestruj się</NavItem>
                        <NavItem href="/login"><Glyphicon glyph="log-in"/> Zaloguj</NavItem>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        </div>
        );
    }
}

export default Menu;