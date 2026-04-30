# Redux Quick Reference Guide

A quick lookup guide for common Redux operations in this project.

---

## 🎯 Import Statements

### Hooks
```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
```

### Selectors
```typescript
import {
  selectAuth,
  selectAuthUser,
  selectIsAuthenticated,
  selectUsers,
  selectUsersPage,
  selectTotalPages,
} from '@/redux/hooks';
```

### Actions
```typescript
import { authActions } from '@/redux/auth/authActions';
import { usersActions } from '@/redux/users/usersActions';
```

### Types
```typescript
import type { AuthState, UsersState } from '@/redux';
import type { LoginPayload, SearchUsersPayload } from '@/redux';
```

### Utilities
```typescript
import { calculateSkip, debounce, formatUserName } from '@/utils/helpers';
import { DEFAULT_PAGE_SIZE, ROUTES } from '@/utils/constants';
```

---

## 🔑 Common Tasks

### Log In (Authentication)

```typescript
const dispatch = useAppDispatch();
const { loading, error } = useAppSelector(selectAuth);

dispatch(authActions.login({ username: 'user', password: 'pass' }));
```

### Log Out

```typescript
const dispatch = useAppDispatch();

dispatch(authActions.logout());
```

### Check If Authenticated

```typescript
const isAuthenticated = useAppSelector(selectIsAuthenticated);
const user = useAppSelector(selectAuthUser);

if (isAuthenticated) {
  console.log('Logged in as:', user?.firstName);
}
```

### Fetch Users (Paginated)

```typescript
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
}, [dispatch]);
```

### Fetch Next Page

```typescript
const dispatch = useAppDispatch();
const page = useAppSelector(selectUsersPage);
const hasNextPage = useAppSelector(selectHasNextPage);

const handleNextPage = () => {
  if (hasNextPage) {
    dispatch(usersActions.setPage(page + 1));
  }
};
```

### Search Users (Auto-Debounced)

```typescript
const dispatch = useAppDispatch();

const handleSearch = (query: string) => {
  dispatch(usersActions.searchUsers({ query, limit: 10 }));
  // Automatically debounced in saga (500ms)
};
```

### Get Single User

```typescript
const dispatch = useAppDispatch();
const user = useAppSelector(selectSelectedUser);

useEffect(() => {
  dispatch(usersActions.fetchUserById({ id: 123 }));
}, [dispatch]);
```

### Display Loading State

```typescript
const loading = useAppSelector(selectUsersLoading);

if (loading) return <div>Loading...</div>;
```

### Display Error

```typescript
const error = useAppSelector(selectUsersError);

if (error) return <div className="error">{error}</div>;
```

### Clear Error

```typescript
const dispatch = useAppDispatch();

dispatch(usersActions.clearError());
```

---

## 🏗️ Component Template

```typescript
'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUsers, selectUsersLoading, selectUsersError } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  useEffect(() => {
    dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.firstName} {user.lastName}</li>
      ))}
    </ul>
  );
}
```

---

## 📊 State Structure Reference

### Auth State
```typescript
{
  user: {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    image: string,
    gender: string
  } | null,
  token: string | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

### Users State
```typescript
{
  users: User[],
  selectedUser: User | null,
  loading: boolean,
  error: string | null,
  total: number,
  page: number,
  limit: number,
  searchQuery: string,
  isSearching: boolean
}
```

---

## 🎯 Available Selectors

### Auth Selectors
| Selector | Returns | Usage |
|----------|---------|-------|
| `selectAuth` | AuthState | Entire auth state |
| `selectAuthUser` | User \\| null | Current user object |
| `selectAuthToken` | string \\| null | Auth token |
| `selectIsAuthenticated` | boolean | Auth status |
| `selectAuthLoading` | boolean | Loading state |
| `selectAuthError` | string \\| null | Error message |

### Users Selectors
| Selector | Returns | Usage |
|----------|---------|-------|
| `selectUsers` | User[] | Array of users |
| `selectSelectedUser` | User \\| null | Single user |
| `selectUsersLoading` | boolean | Loading state |
| `selectUsersError` | string \\| null | Error message |
| `selectUsersTotal` | number | Total user count |
| `selectUsersPage` | number | Current page |
| `selectUsersLimit` | number | Items per page |
| `selectSearchQuery` | string | Current search |
| `selectIsSearching` | boolean | Search loading |
| `selectTotalPages` | number | Total pages |
| `selectHasNextPage` | boolean | Has next page |
| `selectHasPrevPage` | boolean | Has previous page |

---

## ⚡ Quick Constants

```typescript
// Page sizes
DEFAULT_PAGE_SIZE = 10
PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

// Routes
ROUTES.HOME = '/'
ROUTES.LOGIN = '/login'
ROUTES.USERS = '/users'
ROUTES.USER_DETAIL(id) = `/users/${id}`

// Storage keys
STORAGE_KEYS.AUTH_TOKEN = 'authToken'
STORAGE_KEYS.USER = 'user'
STORAGE_KEYS.REFRESH_TOKEN = 'refreshToken'
```

---

## 🛠️ Common Patterns

### Protected Route
```typescript
'use client';
import { useAppSelector, selectIsAuthenticated } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Protected() {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) router.push('/login');
  }, [isAuth, router]);

  return isAuth ? <YourContent /> : null;
}
```

### Pagination Hook
```typescript
const page = useAppSelector(selectUsersPage);
const totalPages = useAppSelector(selectTotalPages);
const hasNextPage = useAppSelector(selectHasNextPage);
const hasPrevPage = useAppSelector(selectHasPrevPage);

const skip = calculateSkip(page, 10);
```

### Search with Debounce
```typescript
const [query, setQuery] = useState('');

const handleSearch = (value: string) => {
  setQuery(value);
  if (value.trim()) {
    dispatch(usersActions.searchUsers({ query: value }));
  } else {
    dispatch(usersActions.resetSearch());
  }
};

return (
  <input
    value={query}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Search..."
  />
);
```

### Error Handling
```typescript
const error = useAppSelector(selectUsersError);
const dispatch = useAppDispatch();

useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      dispatch(usersActions.clearError());
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [error, dispatch]);

return error ? <ErrorAlert message={error} /> : null;
```

---

## 🚀 Performance Tips

1. **Use Memoization**
   ```typescript
   const users = useAppSelector(
     (state) => selectUsers(state)
   ); // Memoized by Redux
   ```

2. **Avoid Inline Selectors**
   ```typescript
   // ✅ GOOD - Defined outside
   const user = useAppSelector(selectAuthUser);

   // ❌ BAD - Created inline
   const user = useAppSelector(state => state.auth.user);
   ```

3. **Use Derived Selectors**
   ```typescript
   // ✅ Use pre-calculated selector
   const totalPages = useAppSelector(selectTotalPages);

   // ❌ Don't calculate in component
   const totalPages = Math.ceil(total / limit);
   ```

---

## 📚 File Locations

| Item | Location |
|------|----------|
| Store | `src/redux/store.ts` |
| Root Reducer | `src/redux/rootReducer.ts` |
| Root Saga | `src/redux/rootSaga.ts` |
| Hooks | `src/redux/hooks.ts` |
| Auth Slice | `src/redux/auth/authSlice.ts` |
| Auth Saga | `src/redux/auth/authSaga.ts` |
| Auth Actions | `src/redux/auth/authActions.ts` |
| Users Slice | `src/redux/users/usersSlice.ts` |
| Users Saga | `src/redux/users/usersSaga.ts` |
| Users Actions | `src/redux/users/usersActions.ts` |
| API Client | `src/services/apiClient.ts` |
| Helpers | `src/utils/helpers.ts` |
| Constants | `src/utils/constants.ts` |

---

## 🔍 Debugging

### Redux DevTools
- Install Redux DevTools browser extension
- Open DevTools to inspect state
- Time-travel through actions
- Dispatch actions manually

### Console Logging
```typescript
// Log action dispatch
import { useAppDispatch } from '@/redux/hooks';
const dispatch = useAppDispatch();
console.log('dispatching:', action);
dispatch(action);
```

### Check Redux State
```typescript
// In browser console with Redux DevTools
$r.__reactFiber$['__readyState'].memoizedState[0].memoizedState; // Redux value
```

---

## ❓ FAQ

**Q: How do I add a new Redux module?**  
A: Create a new folder in `src/redux/`, add slice, saga, actions, types, and service. Register in rootReducer and rootSaga.

**Q: How do I persist state?**  
A: Change `sessionStorage` to `localStorage` in `authService.ts`.

**Q: How do I make tokens persist across browser restarts?**  
A: Use `localStorage` instead of `sessionStorage`.

**Q: Can I modify the debounce time for search?**  
A: Yes, edit `src/redux/users/usersSaga.ts` line with `debounce(500, ...)`.

**Q: How do I test Redux?**  
A: Use Redux Toolkit's `@reduxjs/toolkit/query/react` or `redux-saga-test-plan`.

---

**For more details, see:**
- [REDUX_SETUP_GUIDE.md](./REDUX_SETUP_GUIDE.md)
- [REDUX_USAGE_EXAMPLES.md](./REDUX_USAGE_EXAMPLES.md)
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
