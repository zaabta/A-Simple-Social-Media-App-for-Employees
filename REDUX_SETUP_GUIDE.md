# Redux Toolkit + Redux-Saga Architecture Guide

This project implements a scalable, production-grade Redux architecture with Redux Toolkit and Redux-Saga integration.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Redux Provider
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── providers.tsx            # Redux Provider wrapper
│   ├── login/                   # Login page (to be created)
│   ├── users/                   # Users listing page (to be created)
│   └── users/[id]/              # User details page (to be created)
│
├── redux/                       # Redux store setup
│   ├── store.ts                # Redux store configuration
│   ├── rootReducer.ts          # Combined reducers
│   ├── rootSaga.ts             # Combined sagas
│   ├── hooks.ts                # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── auth/                    # Authentication module
│   │   ├── authSlice.ts        # Redux slice
│   │   ├── authSaga.ts         # Side effects handler
│   │   ├── authActions.ts      # Action creators
│   │   ├── authTypes.ts        # TypeScript types
│   │   └── authService.ts      # API calls
│   │
│   └── users/                   # Users module
│       ├── usersSlice.ts       # Redux slice
│       ├── usersSaga.ts        # Side effects handler
│       ├── usersActions.ts     # Action creators
│       ├── usersTypes.ts       # TypeScript types
│       └── usersService.ts     # API calls
│
├── services/
│   └── apiClient.ts            # Axios instance with interceptors
│
├── types/
│   └── global.ts               # Global TypeScript types
│
└── utils/
    ├── constants.ts            # App constants
    └── helpers.ts              # Utility functions
```

## 🔧 Setup Instructions

### 1. Installation

All dependencies are already installed. To verify:

```bash
npm list @reduxjs/toolkit redux-saga react-redux
# or
pnpm list @reduxjs/toolkit redux-saga react-redux
```

### 2. Running the Application

```bash
# Development
npm run dev
# or
pnpm dev

# Build
npm run build
# or
pnpm build

# Production
npm start
# or
pnpm start
```

## 📚 Core Concepts

### Redux Store (`store.ts`)

- Configured with Redux Toolkit's `configureStore`
- Integrated Redux-Saga middleware
- Redux DevTools enabled for development
- Middleware includes default middlewares + saga

```typescript
import { store, AppDispatch, RootState } from '@/redux/store';
```

### Typed Hooks (`hooks.ts`)

Pre-typed dispatch and selector hooks to maintain type safety:

```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// In a component:
const dispatch = useAppDispatch();
const users = useAppSelector(selectUsers);
const loading = useAppSelector(selectUsersLoading);
```

### Selectors

Organized by feature with derived selectors:

```typescript
// Auth selectors
selectAuth, selectAuthUser, selectAuthToken, selectIsAuthenticated

// Users selectors
selectUsers, selectUsersPage, selectTotalPages, selectHasNextPage
```

## 🔄 Module Architecture

### Feature Module Structure

Each module (auth, users) contains:

1. **Types** (`*Types.ts`) - TypeScript interfaces
   - State interface
   - Action payloads
   - Response types

2. **Service** (`*Service.ts`) - API calls
   - Encapsulates HTTP requests
   - Returns typed responses
   - No Redux logic

3. **Slice** (`*Slice.ts`) - Redux Toolkit slice
   - State definition
   - Reducers (synchronous state updates)
   - Action creators

4. **Saga** (`*Saga.ts`) - Side effects handler
   - Handles async operations
   - Makes API calls
   - Dispatches actions
   - Error handling

5. **Actions** (`*Actions.ts`) - Action creators wrapper
   - Convenience layer
   - Helps with dispatch calls

## 🔐 Authentication Module

### State Shape

```typescript
{
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    gender: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

### Usage Example

```typescript
'use client';
import { useAppDispatch, useAppSelector, selectAuth } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectAuth);

  const handleLogin = (credentials: { username: string; password: string }) => {
    dispatch(authActions.login(credentials));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin({ username: 'user', password: 'pass' });
    }}>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      {/* Form fields */}
    </form>
  );
}
```

## 📱 Users Module

### State Shape

```typescript
{
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  isSearching: boolean;
}
```

### Key Features

- **Pagination**: Page and limit management
- **Search**: Debounced search (500ms) via Redux-Saga
- **User Details**: Fetch individual user data
- **Error Handling**: Comprehensive error states

### Usage Example

```typescript
'use client';
import { useAppDispatch, useAppSelector, selectUsers } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function UsersList() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const page = useAppSelector(selectUsersPage);
  const hasNextPage = useAppSelector(selectHasNextPage);

  React.useEffect(() => {
    dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
  }, [dispatch]);

  const handleSearch = (query: string) => {
    dispatch(usersActions.searchUsers({ query, limit: 10 }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(usersActions.setPage(newPage));
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.firstName} {user.lastName}</li>
        ))}
      </ul>
      <button onClick={() => handlePageChange(page + 1)} disabled={!hasNextPage}>
        Next Page
      </button>
    </div>
  );
}
```

## 🌊 Redux-Saga Features

### Debounced Search

Search requests are automatically debounced with 500ms delay:

```typescript
yield debounce(500, searchUsersRequest.type, searchUsersSaga);
```

### Error Handling

All sagas include try-catch blocks with user-friendly error messages:

```typescript
try {
  const response = yield call(authService.login, action.payload);
  yield put(loginSuccess(response));
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Login failed';
  yield put(loginFailure(errorMessage));
}
```

### Redirect on Success/Failure

Sagas can trigger navigation:

```typescript
yield put(loginSuccess(response));
if (typeof window !== 'undefined') {
  window.location.href = '/users';
}
```

## 🛠️ API Service Layer (`apiClient.ts`)

### Features

- Centralized Axios configuration
- Automatic token injection in headers
- Request/response interceptors
- Error handling middleware
- Session storage for tokens

### Usage

```typescript
import { apiClient } from '@/services/apiClient';

// GET request
const users = await apiClient.get<UsersResponse>('/users');

// POST request
const response = await apiClient.post('/auth/login', credentials);

// PUT/DELETE requests available as well
```

## 📊 State Management Flow

```
Component dispatches action
    ↓
Saga intercepts action
    ↓
Saga calls API service
    ↓
API Service makes HTTP request
    ↓
Response received
    ↓
Saga dispatches success/failure action
    ↓
Reducer updates state
    ↓
Component subscribes to state updates
    ↓
Component re-renders with new data
```

## 🧪 Best Practices Implemented

✅ **Type Safety**
- Typed hooks with full TypeScript support
- Feature state types for each module
- No `any` types in the codebase

✅ **Separation of Concerns**
- API logic isolated in services
- Side effects in sagas
- State management in slices
- UI components use typed hooks

✅ **Scalability**
- Feature-based module structure
- Easy to add new modules (copy module pattern)
- Centralized configuration
- Reusable patterns

✅ **Error Handling**
- Try-catch in sagas
- User-friendly error messages
- Error state in Redux
- API client error interceptor

✅ **Performance**
- Debounced search to reduce API calls
- Memoized selectors
- Efficient pagination

✅ **Developer Experience**
- Redux DevTools integration
- Clear action names
- Consistent naming conventions
- Comprehensive type definitions

## 🚀 Adding New Modules

To add a new feature module:

1. Create `src/redux/[feature]/[feature]Types.ts`
2. Create `src/redux/[feature]/[feature]Service.ts`
3. Create `src/redux/[feature]/[feature]Slice.ts`
4. Create `src/redux/[feature]/[feature]Saga.ts`
5. Create `src/redux/[feature]/[feature]Actions.ts`
6. Add reducer to `rootReducer.ts`
7. Add saga to `rootSaga.ts`
8. Export selectors from `hooks.ts`

## 📖 Testing

Redux modules are testable:

```typescript
// Test sagas with redux-saga-test-plan
// Test slices with Redux Toolkit utilities
// Test selectors as pure functions

// Example:
const initialState: UsersState = { /* ... */ };
const newState = usersSlice.reducer(initialState, fetchUsersSuccess(response));
```

## 🔗 Useful Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux-Saga Documentation](https://redux-saga.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Redux Guide](https://redux.js.org/usage/usage-with-typescript)

## 📝 API Configuration

The API client uses `https://dummyjson.com` as the default base URL.

To change it, set the environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
```

## ✨ Token Persistence

Auth tokens are stored in `sessionStorage`:
- Automatically saved on login
- Automatically removed on logout
- Automatically sent in API requests via interceptor
- Cleared on 401 responses

---

**Ready to build! Start by creating login and users pages in `src/app/`.**
