"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ProjectActions({ projectId, canEdit, canDelete }: { projectId: string, canEdit: boolean, canDelete: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/projects");
        router.refresh();
      } else {
        alert("Failed to delete project");
        setIsDeleting(false);
      }
    } catch (err) {
      alert("Error deleting project");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {canEdit && (
          <Link href={`/dashboard/projects/${projectId}/edit`}>
            <Button variant="outline">Edit Project</Button>
          </Link>
        )}
        {canDelete && (
          <Button variant="destructive" onClick={() => setShowConfirm(true)} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and all tasks, members, and data will be permanently removed."
        confirmText="Delete Project"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
