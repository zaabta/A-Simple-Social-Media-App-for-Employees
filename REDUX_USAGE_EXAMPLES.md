# Redux Usage Examples

This document provides practical examples of how to use the Redux setup in your application.

## Table of Contents

1. [Dispatching Actions](#dispatching-actions)
2. [Using Selectors](#using-selectors)
3. [Authentication Flow](#authentication-flow)
4. [Users Module](#users-module)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Dispatching Actions

### Basic Action Dispatch

```typescript
'use client';
import { useAppDispatch } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function MyComponent() {
  const dispatch = useAppDispatch();

  const handleFetchUsers = () => {
    dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
  };

  return <button onClick={handleFetchUsers}>Fetch Users</button>;
}
```

### Dispatching with Async Data

```typescript
const handleSearch = (query: string) => {
  // Search is debounced automatically (500ms)
  dispatch(usersActions.searchUsers({ query, limit: 10 }));
};
```

---

## Using Selectors

### Basic Selector Usage

```typescript
'use client';
import { useAppSelector } from '@/redux/hooks';
import { selectUsers, selectUsersLoading, selectUsersError } from '@/redux/hooks';

export function UsersList() {
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

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

### Derived Selectors

```typescript
import {
  selectTotalPages,
  selectHasNextPage,
  selectHasPrevPage,
} from '@/redux/hooks';

export function Pagination() {
  const totalPages = useAppSelector(selectTotalPages);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const hasPrevPage = useAppSelector(selectHasPrevPage);

  return (
    <div>
      <p>Total pages: {totalPages}</p>
      <button disabled={!hasPrevPage}>Previous</button>
      <button disabled={!hasNextPage}>Next</button>
    </div>
  );
}
```

---

## Authentication Flow

### Login Flow

```typescript
'use client';
import { useAppDispatch, useAppSelector, selectAuth } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authActions.login({ username, password }));
    // Redux-Saga handles:
    // - API call
    // - Token storage
    // - Redirect on success
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Logout Flow

```typescript
'use client';
import { useAppDispatch } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
    // Redux-Saga handles:
    // - State cleanup
    // - Token removal
    // - Redirect to login
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Protected Route Example

```typescript
'use client';
import { useAppSelector, selectIsAuthenticated } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : null;
}
```

---

## Users Module

### Fetching Users with Pagination

```typescript
'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectUsers,
  selectUsersPage,
  selectTotalPages,
} from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';
import { calculateSkip } from '@/utils/helpers';

export function UsersPaginatedList() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const page = useAppSelector(selectUsersPage);
  const totalPages = useAppSelector(selectTotalPages);

  useEffect(() => {
    const skip = calculateSkip(page, 10);
    dispatch(usersActions.fetchUsers({ skip, limit: 10 }));
  }, [dispatch, page]);

  const handlePageChange = (newPage: number) => {
    dispatch(usersActions.setPage(newPage));
  };

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        ))}
      </ul>
      <p>Page {page} of {totalPages}</p>
      <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
```

### Searching Users (with Debounce)

```typescript
'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUsers, selectIsSearching } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function UserSearch() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const isSearching = useAppSelector(selectIsSearching);
  const [query, setQuery] = useState('');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      // Automatically debounced in the saga (500ms)
      dispatch(usersActions.searchUsers({ query: searchQuery, limit: 10 }));
    } else {
      dispatch(usersActions.resetSearch());
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
      />
      {isSearching && <p>Searching...</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetching Single User

```typescript
'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectSelectedUser, selectUsersLoading } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function UserDetail({ userId }: { userId: number }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSelectedUser);
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(usersActions.fetchUserById({ id: userId }));
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      {user.address && (
        <p>Address: {user.address.address}, {user.address.city}</p>
      )}
    </div>
  );
}
```

---

## Error Handling

### Displaying Errors

```typescript
'use client';
import { useAppSelector, selectUsersError, selectAuthError } from '@/redux/hooks';

export function ErrorDisplay() {
  const usersError = useAppSelector(selectUsersError);
  const authError = useAppSelector(selectAuthError);

  return (
    <>
      {usersError && (
        <div className="error-banner">
          Users Error: {usersError}
        </div>
      )}
      {authError && (
        <div className="error-banner">
          Auth Error: {authError}
        </div>
      )}
    </>
  );
}
```

### Clearing Errors

```typescript
'use client';
import { useAppDispatch } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';
import { authActions } from '@/redux/auth/authActions';

export function ClearErrors() {
  const dispatch = useAppDispatch();

  return (
    <>
      <button onClick={() => dispatch(usersActions.clearError())}>
        Clear Users Error
      </button>
      <button onClick={() => dispatch(authActions.clearError())}>
        Clear Auth Error
      </button>
    </>
  );
}
```

---

## Best Practices

### 1. Always Use Typed Hooks

```typescript
// ✅ GOOD - Typed
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// ❌ AVOID - Untyped
import { useDispatch, useSelector } from 'react-redux';
```

### 2. Use Feature Actions Directly

```typescript
// ✅ GOOD - Using pre-built actions
import { usersActions } from '@/redux/users/usersActions';
dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));

// ❌ AVOID - Manually creating actions
import { fetchUsersRequest } from '@/redux/users/usersSlice';
dispatch(fetchUsersRequest({ skip: 0, limit: 10 }));
```

### 3. Use Selectors for Derived State

```typescript
// ✅ GOOD - Memoized derived selector
const totalPages = useAppSelector(selectTotalPages);

// ❌ AVOID - Calculating in component
const totalPages = Math.ceil(total / limit); // Recalculates on every render
```

### 4. Handle Loading States Properly

```typescript
// ✅ GOOD - Clear state management
const { loading, error, data } = useAppSelector(selectState);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;

// ❌ AVOID - Multiple loading booleans
const [loading, setLoading] = useState(false);
const [apiLoading, setApiLoading] = useState(false);
```

### 5. Side Effects in Sagas, Not Components

```typescript
// ✅ GOOD - Saga handles side effects
function* loginSaga(action) {
  try {
    const response = yield call(authService.login, action.payload);
    yield put(loginSuccess(response));
    yield call(() => { window.location.href = '/users'; }); // Redirect in saga
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

// ❌ AVOID - Component handling side effects
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('/api/login', { body: credentials });
    dispatch(loginSuccess(response));
    router.push('/users');
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};
```

### 6. Keep Components Focused on UI

```typescript
// ✅ GOOD - Component only handles UI logic
export function UsersList() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  const handleItemClick = (userId: number) => {
    // Navigate or dispatch action
  };

  return <ul>{users.map(/* ... */)}</ul>;
}

// ❌ AVOID - Component handling business logic
export function UsersList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  // ...
}
```

### 7. Use Constants for Magic Values

```typescript
// ✅ GOOD
import { DEFAULT_PAGE_SIZE, ROUTES } from '@/utils/constants';

dispatch(usersActions.fetchUsers({ skip: 0, limit: DEFAULT_PAGE_SIZE }));
navigate(ROUTES.USERS);

// ❌ AVOID - Magic numbers
dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
navigate('/users');
```

### 8. Test Selectors as Pure Functions

```typescript
// ✅ TESTABLE - Selectors are pure functions
const state: RootState = { /* ... */ };
const users = selectUsers(state);
expect(users).toEqual([...]);

// Selectors can be tested without Redux setup
```

---

## Redux DevTools

When running in development, Redux DevTools browser extension will automatically connect to your store.

### Features

- Time-traveling debugging
- Action replay
- State diff viewer
- Dispatch actions manually

### Disable in Production

Automatically handled - Redux DevTools only enabled when `NODE_ENV !== 'production'`

---

## Performance Tips

1. **Memoize Selectors** - Already done in `hooks.ts`
2. **Debounce Search** - Already done in `usersSaga.ts` (500ms)
3. **Batch Updates** - Redux Toolkit automatically batches updates
4. **Use createSelector** - For complex derived selectors

---

## Troubleshooting

### Issue: Component doesn't update after dispatch

- Ensure you're using `useAppSelector` with correct selector
- Check that reducer is properly returning new state (never mutate)
- Redux Toolkit uses Immer for immutability

### Issue: Action not being dispatched

- Verify saga is watching for the action in `rootSaga.ts`
- Check action type name matches in slice and saga
- Check that selector is returning expected state

### Issue: Token not persisting

- Tokens are stored in `sessionStorage`
- Cleared on page refresh with session
- To persist across sessions, use `localStorage` in `authService.ts`

---

For more information, see [REDUX_SETUP_GUIDE.md](./REDUX_SETUP_GUIDE.md)
