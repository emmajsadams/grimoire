import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { AppProps } from '../../../pages/_app'
import { logout } from 'thin-backend'
import { useCurrentUser } from 'thin-backend-react'
import { createRecord } from 'thin-backend'
import { useRouter } from 'next/router'
import { parseSearchQuery } from '../../search'
import Link from 'next/link'

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
  '& .MuiInputBase-root': {
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

  const handleMenuClose = () => {
    setAnchorEl(null)
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
      <MenuItem>--</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose()
        }}
      >
        <Link href="/">Notes</Link>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          // TODO: Create a url that is `/notes/new` that does this by default so anywhere can link to it without all this code
          // TODO: Figure out why textSearch and error need to be set to null for new notes?
          const note = await createRecord('notes', {} as any)
          handleMenuClose()
          router.push(`/notes/${note.id}`)
        }}
      >
        Create New Note
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary">
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
              value={searchQuery.rawQuery}
              // autoFocus={true} TODO: restore this after investigating accessibility concerns
              onChange={(event) =>
                setSearchQuery(parseSearchQuery(event.target.value))
              } // TODO: Convert this to an object that contains the parsed search components maybe?s
            />
          </Search>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <br />
      <br />
      <br />
      <br />
    </Box>
  )
}

// TODO: I should not need <br> at the end to avoid he search bar covering scrolling notes
