import React from 'react';
import BaseComponent from './base/BaseComponent';
import styles from '../../styles/sideBarMenu.scss';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';



class Menu extends BaseComponent {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.state = {
            isUserLoggedIn: BaseComponent.isUserLoggedIn
          };

          console.log(BaseComponent.isLoggedIn);
    }


    handleLogout(event) {
        BaseComponent.logOut();
        window.location.reload();
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
                            <Navbar.Link href="#"><Glyphicon glyph="home" /></Navbar.Link>

                        </Navbar.Text>
                        <Nav>
                            <NavDropdown id="dropdown1" eventKey={1} title="Lokalizacje">
                                <   MenuItem eventKey={1.1} href="location">Lista</MenuItem>
                                <MenuItem eventKey={1.1} href="locationadd">Dodaj nową</MenuItem>
                            </NavDropdown>
                            <NavItem eventKey={2}>Item 2</NavItem>
                            <NavItem eventKey={3}>Item 3</NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem href="/register" style={{ display: BaseComponent.isLoggedIn == 'true' ? 'none' : 'inline' }}><Glyphicon glyph="user" /> Zarejestruj się</NavItem>
                            <NavItem href="/login" style={{ display: BaseComponent.isLoggedIn == 'true' ? 'none' : 'inline' }}><Glyphicon glyph="log-in" /> Zaloguj</NavItem>
                            <NavDropdown id="userData" eventKey={1} title="Hello" style={{ display: BaseComponent.isLoggedIn == 'true' ? 'inline' : 'none' }}>
                                <MenuItem eventKey={1.1} href="user">Edytuj dane</MenuItem>
                                <MenuItem eventKey={1.1} onClick={this.handleLogout.bind(this)} type="submit">Wyloguj</MenuItem>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>
            </div>
        );
    }
}

export default Menu;