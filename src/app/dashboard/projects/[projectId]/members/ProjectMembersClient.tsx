"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectRole } from "@prisma/client";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProjectMemberSchema, AddProjectMemberInput } from "@/lib/validations";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/date-utils";

type Member = {
  id: string;
  role: ProjectRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function ProjectMembersClient({ 
  projectId, 
  initialMembers, 
  canManage 
}: { 
  projectId: string; 
  initialMembers: Member[]; 
  canManage: boolean;
}) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddProjectMemberInput>({
    resolver: zodResolver(addProjectMemberSchema) as Resolver<AddProjectMemberInput>,
    defaultValues: {
      role: ProjectRole.MEMBER,
    }
  });

  const handleAddMember = async (data: AddProjectMemberInput) => {
    setIsAdding(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to add member");
      } else {
        const result = await response.json();
        setMembers([...members, result.member]);
        reset();
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberToRemove}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers(members.filter(m => m.id !== memberToRemove));
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to remove member");
      }
    } catch {
      alert("Error removing member");
    } finally {
      setMemberToRemove(null);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const result = await response.json();
        setMembers(members.map(m => m.id === memberId ? result.member : m));
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to change role");
      }
    } catch {
      alert("Error changing role");
    }
  };

  return (
    <div className="space-y-8">
      {canManage && (
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Add Member</h3>
          <form onSubmit={handleSubmit(handleAddMember)} className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                {...register("email")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                placeholder="user@example.com"
                disabled={isAdding}
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="role">Role</label>
              <select 
                id="role" 
                {...register("role")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 min-w-[120px]"
                disabled={isAdding}
              >
                <option value={ProjectRole.MEMBER}>Member</option>
                <option value={ProjectRole.ADMIN}>Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>}
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </form>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      )}

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Member</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              {canManage && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{member.user.name}</div>
                  <div className="text-muted-foreground">{member.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  {canManage && member.role !== ProjectRole.OWNER ? (
                    <select 
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.id, e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option value={ProjectRole.MEMBER}>Member</option>
                      <option value={ProjectRole.ADMIN}>Admin</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {member.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                  {formatDate(member.joinedAt)}
                </td>
                {canManage && (
                  <td className="px-6 py-4 text-right">
                    {member.role !== ProjectRole.OWNER && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setMemberToRemove(member.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      
      <ConfirmDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title="Remove Member"
        description="Are you sure you want to remove this member from the project? They will lose access to all tasks and data within this project."
        confirmText="Remove Member"
        variant="destructive"
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
