"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema, CreateCommentInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";

export function CommentForm({
  projectId,
  taskId,
  initialContent = "",
  commentId,
  onSuccess,
  onCancel,
}: {
  projectId: string;
  taskId: string;
  initialContent?: string;
  commentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!commentId;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema) as any,
    defaultValues: { content: initialContent },
  });

  const onSubmit = async (data: CreateCommentInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = isEdit 
        ? `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
        : `/api/projects/${projectId}/tasks/${taskId}/comments`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Failed to save comment");
      } else {
        reset();
        onSuccess();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
      <div>
        <textarea
          {...register("content")}
          placeholder="Leave a comment..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          disabled={isLoading}
        />
        {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
