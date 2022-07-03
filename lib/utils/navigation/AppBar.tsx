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
import moment, { Moment } from 'moment-timezone'
import {
  TITLE_PROPERTY,
  DUE_PROPERTY,
  STATUS_PROPERTY,
  TAG_PROPERTY,
  STATUSES_TYPE,
  TAGS_TYPE,
  TAGS,
  STATUSES,
  Properties,
} from '../../models/notes/parseNote'

const Operations = ['==', '!=', '>', '<', '>=', '<=']
export type Operation = '==' | '!=' | '>' | '<' | '>=' | '<='

interface TitleQueryPart {
  operation: Operation
  value: string
}

interface DueQueryPart {
  operation: Operation
  value: Moment
}

interface StatusQueryPart {
  operation: Operation
  value: STATUSES_TYPE
}

interface TagQueryPart {
  operation: Operation
  value: TAGS_TYPE
}

export interface Query {
  [TITLE_PROPERTY]: TitleQueryPart[]
  [DUE_PROPERTY]: DueQueryPart[]
  [STATUS_PROPERTY]: StatusQueryPart[]
  [TAG_PROPERTY]: TagQueryPart[]
  errors: string[]
  rawQuery: string
}

export function createDefaultQuery(): Query {
  return {
    [TITLE_PROPERTY]: [
      {
        operation: '==',
        value: '',
      },
    ],
    [DUE_PROPERTY]: [],
    [STATUS_PROPERTY]: [],
    [TAG_PROPERTY]: [],
    errors: [],
    rawQuery: '',
  }
}

// TODO: Add a query language in the search bar
// Commands should be wrapped in ``` character. EX: ```due:asc&&```
// Should support || (OR) or && (AND). OrderBy commands should only support && (AND)
// It should support commands like `due:exists`, `due:>2019-06-05` (including <, >=, <=, =, !=), `due:asc` (or desc)
// By default `due:asc&&status:!=done&&` should be set to get a filtered view.
//
// TODO: parse this in appBar when setting state instead
export function parseSearchQuery(searchQuery: string): Query {
  const stringQueryParts = searchQuery.trim().split(' ')
  const queryParts = createDefaultQuery()
  queryParts.rawQuery = searchQuery

  for (const stringQueryPart of stringQueryParts) {
    const parsedTag = parseQueryPart(
      queryParts,
      stringQueryPart,
      TAG_PROPERTY,
      TAGS,
      (value) => value,
    )
    if (parsedTag) {
      continue
    }

    const parsedDue = parseQueryPart(
      queryParts,
      stringQueryPart,
      DUE_PROPERTY,
      null,
      (value) => moment.tz(value, 'America/Los_Angeles').utc(),
    )
    if (parsedDue) {
      continue
    }

    const parsedStatus = parseQueryPart(
      queryParts,
      stringQueryPart,
      STATUS_PROPERTY,
      STATUSES,
      (value) => value,
    )
    if (parsedStatus) {
      continue
    }

    // if could not parse it as a query part than it is part of title
    queryParts[TITLE_PROPERTY][0].value += stringQueryPart + ' '
  }

  return queryParts
}

// Returns true if the query part contained the property (errors and results will be set on query directly)
function parseQueryPart(
  query: Query,
  stringQueryPart: string,
  property: string,
  expectedValues: string[] | null,
  parse: (stringQueryPart: string) => any,
): boolean {
  if (!stringQueryPart.startsWith(`${property}:`)) {
    return false
  }

  const [_, operation, rawValue] = stringQueryPart.split(':')

  if (!Operations.includes(operation)) {
    query.errors.push(`Unknown operation: ${operation}`)
    return true
  }

  if (!rawValue) {
    query.errors.push(
      `Value not defined ${
        expectedValues ? `(${expectedValues.join(', ')})` : ''
      }`,
    )
    return true
  }

  const value = parse(rawValue.trim())
  if (expectedValues && !expectedValues.includes(value)) {
    query.errors.push(
      `Value is not allowed (${expectedValues.join(', ')}): ${rawValue}`,
    )
    return true
  }

  ;(query as any)[property].push({
    operation: operation.trim(),
    value: value,
  })

  return true
}

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
      <MenuItem>--</MenuItem>
      <MenuItem
        onClick={() => {
          router.push(`/`) // TODO: DO not do this imperatively!! just link
        }}
      >
        Notes
      </MenuItem>
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
              value={searchQuery.rawQuery}
              // autoFocus={true} TODO: restore this after investigating accessibility concerns
              onChange={(event) =>
                setSearchQuery(parseSearchQuery(event.target.value))
              } // TODO: Convert this to an object that contains the parsed search components maybe?s
            />
          </Search>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}
