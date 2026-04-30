# 🚀 Getting Started With Redux

Welcome! This guide will help you quickly understand and use the Redux setup.

---

## 📍 First Time? Start Here

### Step 1: Understand the Structure (5 minutes)
Read the folder structure in your IDE's file explorer:
- `src/redux/` - All Redux code
- `src/redux/auth/` - Authentication module
- `src/redux/users/` - Users module
- `src/redux/hooks.ts` - Your connection to Redux
- `src/app/` - Next.js pages (with examples)

### Step 2: Start the Dev Server (1 minute)
```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000`

### Step 3: Test the Login Flow (5 minutes)
1. Navigate to `http://localhost:3000/login`
2. Use test credentials from [DummyJSON](https://dummyjson.com/docs/users)
   - Example: **emilys** / **emilyspass**
3. Click "Login"
4. You'll be redirected to `/users`

### Step 4: Explore the Users Page (5 minutes)
- See Redux in action
- Try pagination (Next/Previous buttons)
- Try searching (auto-debounced in Redux)
- Click on a user to see details

### Step 5: Open Redux DevTools (3 minutes)
1. Install Redux DevTools browser extension (if not installed)
2. Open browser DevTools
3. Find "Redux" tab
4. Inspect state, actions, and time-travel through actions

**Total: ~20 minutes to get familiar with the setup!**

---

## 📚 Documentation Map

```
├─ README_REDUX.md (THIS FILE)
│  └─ Executive summary and quick guide
│
├─ REDUX_SETUP_GUIDE.md
│  └─ Detailed architecture explanation
│
├─ REDUX_USAGE_EXAMPLES.md
│  └─ 50+ code examples for every scenario
│
├─ REDUX_QUICK_REFERENCE.md
│  └─ Quick lookup table for common tasks
│
└─ IMPLEMENTATION_COMPLETE.md
   └─ Feature checklist and what was implemented
```

---

## 🎯 Common Tasks

### Task: Use Redux in a Component

```typescript
'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUsers } from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  const handleFetch = () => {
    dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
  };

  return (
    <div>
      <button onClick={handleFetch}>Fetch Users</button>
      <ul>
        {users.map(user => <li key={user.id}>{user.firstName}</li>)}
      </ul>
    </div>
  );
}
```

### Task: Check If User is Logged In

```typescript
import { useAppSelector, selectIsAuthenticated } from '@/redux/hooks';

export function ProtectedContent() {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);

  if (!isLoggedIn) return <div>Please log in</div>;
  return <div>Welcome!</div>;
}
```

### Task: Log Out

```typescript
import { useAppDispatch } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(authActions.logout())}>
      Logout
    </button>
  );
}
```

### Task: Handle Loading and Errors

```typescript
import { useAppSelector } from '@/redux/hooks';
import { selectUsersLoading, selectUsersError } from '@/redux/hooks';

export function UsersList() {
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  // ... rest of component

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  return <div>Your content</div>;
}
```

---

## 📖 How Redux Works Here

### The Flow:

1. **Component dispatches action**
   ```typescript
   dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }))
   ```

2. **Redux-Saga intercepts the action**
   - Waits for `fetchUsersRequest` action
   - Calls the API service
   - Handles errors

3. **Saga dispatches success/failure action**
   - On success: `fetchUsersSuccess(response)`
   - On failure: `fetchUsersFailure(error)`

4. **Reducer updates state**
   - Redux Toolkit handles immutable updates
   - State is serialized and stored

5. **Component re-renders with new data**
   - Selector hook detects state change
   - Component re-renders automatically

---

## 🗂️ File Organization

### Redux Files (Read First)
- `src/redux/hooks.ts` - **Start here** for connecting to Redux
- `src/redux/store.ts` - Redux store config
- `src/redux/rootReducer.ts` - Combines all reducers
- `src/redux/rootSaga.ts` - Combines all sagas

### Auth Module
- `src/redux/auth/authSlice.ts` - State + reducers
- `src/redux/auth/authSaga.ts` - Login/logout logic
- `src/redux/auth/authService.ts` - API calls

### Users Module
- `src/redux/users/usersSlice.ts` - State + reducers
- `src/redux/users/usersSaga.ts` - Fetch/search logic
- `src/redux/users/usersService.ts` - API calls

### App Pages (Examples)
- `src/app/login/page.tsx` - **Pattern for form + Redux**
- `src/app/users/page.tsx` - **Pattern for list + pagination**
- `src/app/users/[id]/page.tsx` - **Pattern for detail page**

---

## 💡 Key Concepts

### 1. Hooks
Pre-typed Redux hooks that work in your components:
- `useAppDispatch()` - To dispatch actions
- `useAppSelector(selectUsers)` - To read state

### 2. Selectors
Functions that extract data from Redux state:
- `selectUsers` - Get all users
- `selectUsersPage` - Get current page number
- `selectTotalPages` - Get total pages (calculated)

### 3. Actions
Functions that trigger Redux operations:
- `authActions.login()` - Triggers login flow
- `usersActions.fetchUsers()` - Triggers fetch
- `usersActions.searchUsers()` - Triggers search

### 4. Async Handling
Redux-Saga automatically handles:
- API calls
- Debounced search
- Error handling
- Side effects (like redirects)

---

## 🔧 Customization

### Change API URL
Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Change Search Debounce Time
Edit `src/redux/users/usersSaga.ts`:
```typescript
yield debounce(1000, searchUsersRequest.type, searchUsersSaga); // 1 second
```

### Add New Feature Module
1. Copy `src/redux/users/` folder
2. Rename files to your feature
3. Update state and logic
4. Add reducer to `rootReducer.ts`
5. Add saga to `rootSaga.ts`

### Use localStorage Instead of sessionStorage
Edit `src/redux/auth/authService.ts`:
```typescript
// Change from sessionStorage to localStorage
localStorage.setItem('authToken', token);
```

---

## 🐛 Debugging

### Open Redux DevTools
1. Install Redux DevTools browser extension
2. Open DevTools (F12)
3. Click "Redux" tab
4. See all actions and state changes

### Check Component State
```typescript
const state = useAppSelector(state => state);
console.log(state); // See entire Redux state
```

### Test in Console
```javascript
// In browser console with Redux DevTools open:
// Dispatch action manually
$r.__data.__reactFiber.debug_owner?.memoizedState

// View current state
$store.getState()
```

---

## 📋 Checklist: Understanding Redux

- [ ] I can start the dev server
- [ ] I understand the folder structure
- [ ] I can log in with test credentials
- [ ] I can see the users list
- [ ] Redux DevTools is open and working
- [ ] I can inspect state changes in DevTools
- [ ] I understand hooks: `useAppDispatch` and `useAppSelector`
- [ ] I understand actions: `authActions`, `usersActions`
- [ ] I understand selectors: `selectUsers`, `selectUsersPage`, etc.
- [ ] I can read the example pages

---

## 📝 Quick Reference

### Import Hooks
```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
```

### Import Selectors
```typescript
import { selectUsers, selectUsersLoading } from '@/redux/hooks';
```

### Import Actions
```typescript
import { authActions } from '@/redux/auth/authActions';
import { usersActions } from '@/redux/users/usersActions';
```

### Dispatch Action
```typescript
const dispatch = useAppDispatch();
dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
```

### Read State
```typescript
const users = useAppSelector(selectUsers);
const loading = useAppSelector(selectUsersLoading);
```

---

## 🎓 Learning Resources

Inside this project:
- [REDUX_QUICK_REFERENCE.md](./REDUX_QUICK_REFERENCE.md) - Quick lookup
- [REDUX_USAGE_EXAMPLES.md](./REDUX_USAGE_EXAMPLES.md) - 50+ examples
- Example pages - See working implementations

External:
- [Redux Documentation](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux-Saga](https://redux-saga.js.org/)

---

## ❓ FAQ

**Q: Where do I add API calls?**  
A: In `src/redux/[feature]/[feature]Service.ts`

**Q: How do I handle loading?**  
A: Use `selectUsersLoading`, `selectAuthLoading` selectors

**Q: How do I show errors?**  
A: Use `selectUsersError`, `selectAuthError` selectors

**Q: Where is the authentication token stored?**  
A: In `sessionStorage` under key `authToken`

**Q: Can I use Redux outside Next.js?**  
A: Yes, same code works in React apps

**Q: How do I test Redux?**  
A: See example test patterns in REDUX_USAGE_EXAMPLES.md

---

## 🚀 Next Steps

1. **Explore Example Pages**
   - Read `src/app/login/page.tsx`
   - Read `src/app/users/page.tsx`
   - Read `src/app/users/[id]/page.tsx`

2. **Create Your First Component**
   - Copy the component template
   - Use Redux hooks
   - Connect to Redux state

3. **Add a New Feature**
   - Follow the module pattern
   - Update rootReducer and rootSaga
   - Create pages for your feature

4. **Deploy**
   - Build: `npm run build`
   - Start: `npm start`
   - Deploy to your platform

---

## 📞 Support

### Still confused?
- Check REDUX_USAGE_EXAMPLES.md for your use case
- Look at example pages for patterns
- Read REDUX_SETUP_GUIDE.md for deep dive

### Want to add features?
- Copy the auth or users module pattern
- Follow file naming conventions
- Update root reducer and saga

### Have issues?
- Check Redux DevTools for state changes
- Look at console for errors
- Verify TypeScript types match

---

## ✨ You've Got This!

The Redux setup is ready. All you need to do is:
1. Understand the pattern
2. Follow the examples
3. Build with confidence

**Happy coding! 🎉**

---

*Last updated: April 29, 2026*  
*Redux Toolkit v2.11.2 | Redux-Saga v1.4.2*
