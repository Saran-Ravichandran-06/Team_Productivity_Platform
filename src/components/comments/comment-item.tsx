"use client";

import { useState } from "react";
import Image from "next/image";
import { CommentForm } from "./comment-form";

export interface CommentItemData {
  id: string;
  authorId: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  author: {
    name?: string | null;
    avatarUrl?: string | null;
  };
}

export function CommentItem({ 
  comment, 
  projectId, 
  taskId, 
  canEdit, 
  canDelete,
  onUpdate 
}: { 
  comment: CommentItemData; 
  projectId: string; 
  taskId: string; 
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onUpdate();
      } else {
        alert("Failed to delete comment");
        setIsDeleting(false);
      }
    } catch {
      alert("Error deleting comment");
      setIsDeleting(false);
    }
  };

  const isEdited = comment.createdAt !== comment.updatedAt;

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-muted/30">
        <CommentForm 
          projectId={projectId} 
          taskId={taskId} 
          commentId={comment.id}
          initialContent={comment.content}
          onSuccess={() => {
            setIsEditing(false);
            onUpdate();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-4 group">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
        {comment.author.avatarUrl ? (
          <Image
            src={comment.author.avatarUrl}
            alt={comment.author.name || "User avatar"}
            width={32}
            height={32}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-primary">{comment.author.name?.charAt(0) || 'U'}</span>
        )}
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString(undefined, {
                month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
              })}
            </span>
            {isEdited && <span className="text-xs text-muted-foreground italic">(edited)</span>}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            {canEdit && (
              <button onClick={() => setIsEditing(true)} className="text-xs text-muted-foreground hover:text-foreground">
                Edit
              </button>
            )}
            {canDelete && (
              <button onClick={handleDelete} disabled={isDeleting} className="text-xs text-destructive hover:text-destructive/80">
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-foreground whitespace-pre-wrap">
          {comment.content}
        </div>
      </div>
    </div>
  );
}
