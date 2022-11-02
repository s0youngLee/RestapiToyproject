import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

function SideBar({isAdmin}) {

    return(
        <Sidebar>
            <Menu>
                <MenuItem routerLink={<Link to="/mypage/board" />}> My Articles </MenuItem>
                <MenuItem routerLink={<Link to="/mypage/comments" />}> My Comments </MenuItem>
                {isAdmin && <MenuItem routerLink={<Link to="/mypage/users" />}> Manage User </MenuItem>}
            </Menu>
        </Sidebar>
    )
}

export default SideBar;