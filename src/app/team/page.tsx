"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  Search,
  UserPlus,
  Activity,
  ClipboardList,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { fetchWorkspaces } from "../../features/workspaceSlice";
import { assets } from "../../assets/assets";

export default function TeamPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { organization, membership, memberships, invitations } = useOrganization({
    memberships: {
      infinite: true,
    },
    invitations: {
      infinite: true,
    },
  });

  const isAdmin = membership?.role === "org:admin";

  const [tasks, setTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const currentWorkspace = useSelector(
    (state: any) => state?.workspace?.currentWorkspace || null,
  );
  const projects = currentWorkspace?.projects || [];

  const filteredUsers = users.filter(
    (user: any) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Load workspaces on mount
  useEffect(() => {
    dispatch((fetchWorkspaces as any)({ getToken }));
  }, [dispatch, getToken]);

  // Synchronize users list using Clerk memberships and pending invitations
  useEffect(() => {
    const list: any[] = [];

    if (memberships?.data) {
      memberships.data.forEach((mem) => {
        const u = mem.publicUserData;
        list.push({
          id: mem.id,
          userId: u.userId,
          name: u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : u.identifier,
          email: u.identifier,
          image: u.imageUrl,
          role: mem.role === "org:admin" ? "ADMIN" : "MEMBER",
          isPending: false,
        });
      });
    }

    if (invitations?.data) {
      invitations.data.forEach((inv) => {
        if (inv.status === "pending") {
          list.push({
            id: inv.id,
            userId: null,
            name: inv.emailAddress.split("@")[0],
            email: inv.emailAddress,
            image: null,
            role: inv.role === "org:admin" ? "ADMIN" : "MEMBER",
            isPending: true,
          });
        }
      });
    }

    const listKey = JSON.stringify(list.map(u => ({ id: u.id, role: u.role, isPending: u.isPending })));
    const currentKey = JSON.stringify(users.map(u => ({ id: u.id, role: u.role, isPending: u.isPending })));
    if (listKey !== currentKey) {
      setUsers(list);
    }
  }, [memberships?.data, invitations?.data, users]);

  // Synchronize task counts
  useEffect(() => {
    setTasks(
      currentWorkspace?.projects?.reduce(
        (acc: any[], project: any) => [...acc, ...project.tasks],
        [],
      ) || [],
    );
  }, [currentWorkspace]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Team
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage team members and their contributions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Total Members */}
        <div className="max-sm:w-full bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Total Members
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/10 mt-4">
              <UsersIcon className="size-4 text-blue-500 dark:text-blue-200" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="max-sm:w-full bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Active Projects
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {
                  projects.filter(
                    (p: any) =>
                      p.status !== "CANCELLED" && p.status !== "COMPLETED",
                  ).length
                }
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 mt-4">
              <Activity className="size-4 text-emerald-500 dark:text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="max-sm:w-full bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between gap-8 md:gap-22">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Total Tasks
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {tasks.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/10 mt-4">
              <ClipboardList className="size-4 text-purple-500 dark:text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3" />
        <input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full text-sm rounded-md border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Team Members */}
      <div className="w-full">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <UsersIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {users.length === 0
                ? "No team members yet"
                : "No members match your search"}
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6">
              {users.length === 0
                ? "Invite team members to start collaborating"
                : "Try adjusting your search term"}
            </p>
          </div>
        ) : (
          <div className="max-w-4xl w-full">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-2.5 text-left font-medium text-sm">
                      Name
                    </th>
                    <th className="px-6 py-2.5 text-left font-medium text-sm">
                      Email
                    </th>
                    <th className="px-6 py-2.5 text-left font-medium text-sm">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {filteredUsers.map((user: any) => {
                    const userImg = user.image || assets.profile_img_a;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-6 py-2.5 whitespace-nowrap flex items-center gap-3">
                          {userImg && (
                            <img
                              src={userImg}
                              alt={user.name}
                              className="size-7 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse-once"
                            />
                          )}
                          <span className="text-sm font-semibold text-zinc-800 dark:text-white truncate">
                            {user.name}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-md font-semibold ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                                  : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                              }`}
                            >
                              {user.role}
                            </span>
                            {user.isPending && (
                              <span className="px-2 py-1 text-xs rounded-md font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {filteredUsers.map((user: any) => {
                const userImg = user.image || assets.profile_img_a;
                return (
                  <div
                    key={user.id}
                    className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {userImg && (
                        <img
                          src={userImg}
                          alt={user.name}
                          className="size-9 rounded-full bg-gray-200 dark:bg-zinc-800"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-md font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                            : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.isPending && (
                        <span className="px-2 py-1 text-xs rounded-md font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
