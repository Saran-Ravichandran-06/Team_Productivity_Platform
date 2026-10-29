"use client";

import { useState, useEffect, useCallback } from "react";
import { CommentItem, CommentItemData } from "./comment-item";
import { CommentForm } from "./comment-form";

export function CommentList({
  projectId,
  taskId,
  currentUserRole,
  currentUserId,
}: {
  projectId: string;
  taskId: string;
  currentUserRole: string;
  currentUserId: string;
}) {
  const [comments, setComments] = useState<CommentItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadComments = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/comments`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      ignore = true;
    };
  }, [projectId, taskId]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, taskId]);

  const canEdit = (authorId: string) => {
    if (currentUserRole === "OWNER" || currentUserRole === "ADMIN") return true;
    return currentUserId === authorId;
  };

  const canDelete = (authorId: string) => {
    if (currentUserRole === "OWNER" || currentUserRole === "ADMIN") return true;
    return currentUserId === authorId;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg border-b pb-2">Comments</h3>
      
      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted-foreground italic">No comments yet.</div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              projectId={projectId}
              taskId={taskId}
              canEdit={canEdit(comment.authorId)}
              canDelete={canDelete(comment.authorId)}
              onUpdate={fetchComments}
            />
          ))}
        </div>
      )}

      <div className="pt-4 mt-6 border-t">
        <CommentForm 
          projectId={projectId} 
          taskId={taskId} 
          onSuccess={fetchComments} 
        />
      </div>
    </div>
  );
}
