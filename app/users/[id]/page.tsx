'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectSelectedUser,
  selectUsersLoading,
  selectUsersError,
} from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';
import { authActions } from '@/redux/auth/authActions';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const [userId, setUserId] = React.useState<number | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSelectedUser);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  useEffect(() => {
    params.then((resolvedParams) => {
      const id = parseInt(resolvedParams.id, 10);
      setUserId(id);
      dispatch(usersActions.fetchUserById({ id }));
    });
  }, [dispatch, params]);

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/users"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                ← Back to Users
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">User Details</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading user details...</div>
          </div>
        ) : !user ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">No user found</div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              {/* User Avatar and Name */}
              <div className="flex items-center mb-8">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full mr-6 object-cover"
                  />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">{user.phone || 'N/A'}</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-gray-900 capitalize">{user.gender || 'N/A'}</p>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Age
                  </label>
                  <p className="text-gray-900">{user.age || 'N/A'}</p>
                </div>

                {/* Address */}
                {user.address && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Address
                      </label>
                      <p className="text-gray-900">{user.address.address}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        City / State
                      </label>
                      <p className="text-gray-900">
                        {user.address.city}
                        {user.address.state && `, ${user.address.state}`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Country
                      </label>
                      <p className="text-gray-900">{user.address.country || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <p className="text-gray-900">{user.address.zip || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
