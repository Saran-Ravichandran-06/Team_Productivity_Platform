export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatRelativeTime(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return formatDate(date);
}

export function formatDeadline(deadlineInput: Date | string | null | undefined, isCompleted: boolean = false): { text: string; isOverdue: boolean; isWarning: boolean } {
  if (!deadlineInput) return { text: "No deadline", isOverdue: false, isWarning: false };
  
  if (isCompleted) {
    return { text: "Completed", isOverdue: false, isWarning: false };
  }
  
  const deadline = new Date(deadlineInput);
  const now = new Date();
  
  // Set time to 00:00:00 for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const diffInDays = Math.floor((deadlineDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    const overdueText = diffInDays === -1 ? "Overdue by 1 day" : `Overdue by ${Math.abs(diffInDays)} days`;
    return { text: overdueText, isOverdue: true, isWarning: false };
  }
  
  if (diffInDays === 0) return { text: "Due today", isOverdue: false, isWarning: true };
  if (diffInDays === 1) return { text: "Due tomorrow", isOverdue: false, isWarning: true };
  
  return { text: formatDate(deadline), isOverdue: false, isWarning: false };
}
