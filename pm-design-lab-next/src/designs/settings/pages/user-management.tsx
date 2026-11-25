"use client";

import { useCallback, useState } from "react";
import { Plus, Trash2, UserRoundX } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";
import { ConfirmDialog } from "@/designs/settings/ui/confirm-dialog";
import { Avatar, Chip, TableCard, th, tr } from "@/designs/settings/ui/data-display";
import { InviteMembersModal } from "@/designs/settings/screens/invite-members-modal";
import { Toast } from "@/designs/settings/ui/toast";
import { users as initialUsers, type TeamUser } from "@/designs/settings/data/users";

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [inviting, setInviting] = useState(false);
  /** The person whose bin icon was clicked, waiting for confirmation. */
  const [removing, setRemoving] = useState<TeamUser | null>(null);
  // Someone who hasn't accepted yet (no "member since") has a pending invitation to cancel instead.
  const isPending = (user: TeamUser) => user.memberSince === null;

  const confirmRemove = () => {
    if (!removing) return;
    setUsers((all) => all.filter((u) => u.id !== removing.id));
    setToast(
      isPending(removing)
        ? `Invitation to ${removing.email} has been cancelled.`
        : `${removing.name} has been removed.`,
    );
    setRemoving(null);
  };
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  /** Invited people show at the top as "Invitation sent" until they accept; their name is the email's first part for now. */
  const invite = (emails: string[]) => {
    const invited: TeamUser[] = emails.map((email) => ({
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      lastLogin: null,
      memberSince: null,
    }));
    setUsers((all) => [...invited, ...all]);
    setToast(emails.length === 1 ? `Invitation sent to ${emails[0]}.` : `Invitations sent to ${emails.length} people.`);
  };

  const q = query.trim().toLowerCase();
  const visible = q
    ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    : users;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <label className="w-full max-w-[320px]">
          <span className="sr-only">Search with name or email</span>
          <input
            type="search"
            placeholder="Search with name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14.5px] outline-none placeholder:text-[#98a2b3] focus:border-[#98a2b3]"
          />
        </label>
        <Button onClick={() => setInviting(true)}>
          <Plus className="size-4" strokeWidth={1.8} />
          Add members
        </Button>
      </div>

      {inviting && (
        <InviteMembersModal
          existingEmails={users.map((u) => u.email)}
          onClose={() => setInviting(false)}
          onInvite={invite}
        />
      )}
      <Toast message={toast} onDismiss={dismissToast} />
      <ConfirmDialog
        open={removing !== null}
        onCancel={() => setRemoving(null)}
        onConfirm={confirmRemove}
        icon={<UserRoundX className="size-6" strokeWidth={1.6} />}
        title={removing && isPending(removing) ? "Cancel invitation?" : "Remove agent?"}
        confirmLabel={removing && isPending(removing) ? "Yes! Cancel" : "Yes! Remove"}
      >
        {removing && isPending(removing) ? (
          "Do you really want to cancel invitation?"
        ) : (
          <>
            Do you really want to remove <strong className="font-semibold text-gray-900">{removing?.name}</strong>?
          </>
        )}
      </ConfirmDialog>

      <TableCard>
        <table className="w-full min-w-[760px] text-left text-[15px]">
          <thead>
            <tr>
              <th className={`${th} w-[23%]`}>Name</th>
              <th className={`${th} w-[23%]`}>Email</th>
              <th className={`${th} w-[23%]`}>Last log in</th>
              <th className={th}>Member since</th>
              <th className={`${th} w-16`}>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user.id} className={tr}>
                <td className="px-5">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={user.name} src={user.photo} className="size-7" />
                    {user.name}
                  </span>
                </td>
                <td className="px-5">{user.email}</td>
                <td className="px-5">{user.lastLogin ?? "--"}</td>
                <td className="px-5">{user.memberSince ?? <Chip>Invitation sent</Chip>}</td>
                <td className="px-5 text-right">
                  <button
                    type="button"
                    aria-label={isPending(user) ? `Cancel invitation for ${user.name}` : `Remove ${user.name}`}
                    onClick={() => setRemoving(user)}
                    className="rounded p-1 text-gray-900 hover:bg-gray-50"
                  >
                    <Trash2 className="size-[18px]" strokeWidth={1.6} />
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr className={tr}>
                <td colSpan={5} className="px-5 text-center text-gray-500">
                  No users match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
