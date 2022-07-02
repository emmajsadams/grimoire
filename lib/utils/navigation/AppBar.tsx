import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { AppProps } from '../../../pages/_app'
import { logout } from 'thin-backend'
import { useCurrentUser } from 'thin-backend-react'
import { createRecord } from 'thin-backend'
import { useRouter } from 'next/router'

// TODO: Add a query language in the search bar
// Commands should be wrapped in ``` character. EX: ```due:asc&&```
// Should support || (OR) or && (AND). OrderBy commands should only support && (AND)
// It should support commands like `due:exists`, `due:>2019-06-05` (including <, >=, <=, =, !=), `due:asc` (or desc)
// By default `due:asc&&status:!=done&&` should be set to get a filtered view.
//
// TODO: parse this in appBar when setting state instead
// function parseSearchQuery(searchQuery: string): string[] {
//   const queryParts = searchQuery.split(" ").trimSpace();

//   const newSearchQueryParts: string[] = [];
//   const tags: string[] = [];
//   const dueDates: Moment[] = [];
//   for (const queryPart in queryParts) {
//     if (queryPart.startsWith("tag:")) {
//       tags.push(queryPart.replaceAll("tag:", ""));
//     } else if (queryPart.startsWith("due:")) {
//       dueDates.push(
//         moment.tz(queryPart.replaceAll("due:", ""), "America/Los_Angeles").utc()
//       );
//     } else {
//       newSearchQueryParts.push(queryPart);
//     }
//   }
// }

const Search = styled('div')(({ theme }) => ({
  'position': 'relative',
  'borderRadius': theme.shape.borderRadius,
  'backgroundColor': alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  'marginRight': theme.spacing(2),
  'marginLeft': 0,
  'width': '100%',
  [theme.breakpoints.up('sm')]: {
    // marginLeft: theme.spacing(3),
    width: '100%',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  'color': 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

interface PrimaryAppBarProps extends AppProps {}

export function PrimaryAppBar({
  searchQuery,
  setSearchQuery,
}: PrimaryAppBarProps) {
  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>{useCurrentUser()?.email}</MenuItem>
      <MenuItem onClick={() => logout()}>Logout</MenuItem>
      <MenuItem
        onClick={() => {
          router.push(`/`) // TODO: DO not do this imperatively!! just link
        }}
      >
        Notes
      </MenuItem>
      <MenuItem>--</MenuItem>
      <MenuItem
        onClick={async () => {
          // TODO: Figure out why textSearch and error need to be set to null for new notes?
          const note = await createRecord('notes', {} as any)
          router.push(`/notes/${note.id}`)
        }}
      >
        Create New Note
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{useCurrentUser()?.email}</p>
      </MenuItem>
    </Menu>
  )

  // TODO: Figure out why search input does not take up full width of
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleProfileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ flexGrow: 1 }}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              // autoFocus={true} TODO: restore this after investigating accessibility concerns
              onChange={(event) => setSearchQuery(event.target.value)} // TODO: Convert this to an object that contains the parsed search components maybe?s
            />
          </Search>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}
