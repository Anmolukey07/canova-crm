export function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatActivityMessage(activity) {
  if (!activity.actorId) {
    return {
      message: activity.message,
      time: getRelativeTime(activity.createdAt),
    };
  }

  const actorName = activity.actorId.firstName || "Admin";
  const relativeTime = getRelativeTime(activity.createdAt);

  let formattedMessage = activity.message;

  switch (activity.type) {
    case "lead_assigned":
      if (activity.message.includes("unassigned") || activity.message.includes("could not be assigned")) {
        formattedMessage = `${actorName} could not assign a lead - no matching user`;
      } else if (activity.message.includes("CSV")) {
        formattedMessage = `${actorName} uploaded leads via CSV`;
      } else {
        formattedMessage = `${actorName} assigned a new lead`;
      }
      break;

    case "lead_updated":
      if (activity.message.includes("status to Closed")) {
        formattedMessage = `${actorName} closed a deal`;
      } else if (activity.message.includes("type")) {
        formattedMessage = `${actorName} updated lead type`;
      } else if (activity.message.includes("scheduled date")) {
        formattedMessage = `${actorName} scheduled a lead`;
      } else {
        formattedMessage = `${actorName} updated a lead`;
      }
      break;

    case "employee_created":
      formattedMessage = `${actorName} created employee`;
      break;

    case "employee_deleted":
      formattedMessage = `${actorName} deleted an employee`;
      break;

    case "settings_updated":
      formattedMessage = `${actorName} updated settings`;
      break;

    case "csv_uploaded":
      if (activity.message.includes("294")) {
        formattedMessage = `${actorName} uploaded 294 lead(s) via CSV`;
      } else {
        const match = activity.message.match(/(\d+) lead/);
        const count = match ? match[1] : "multiple";
        formattedMessage = `${actorName} uploaded ${count} lead(s) via CSV`;
      }
      break;

    default:
      formattedMessage = activity.message;
  }

  return {
    message: formattedMessage,
    time: relativeTime,
  };
}
