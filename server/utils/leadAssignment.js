const THRESHOLD = 3;

function sortUsersByLoad(users, userLeadCounts) {
  return [...users].sort((left, right) => {
    const leftCount = userLeadCounts[left._id.toString()] || 0;
    const rightCount = userLeadCounts[right._id.toString()] || 0;

    if (leftCount !== rightCount) {
      return leftCount - rightCount;
    }

    const leftName = `${left.firstName} ${left.lastName}`.trim().toLowerCase();
    const rightName = `${right.firstName} ${right.lastName}`.trim().toLowerCase();

    if (leftName !== rightName) {
      return leftName.localeCompare(rightName);
    }

    return left._id.toString().localeCompare(right._id.toString());
  });
}

function selectUserForLanguage(language, usersByLanguage, userLeadCounts) {
  const activeUsers = usersByLanguage.get(language) || [];

  if (activeUsers.length === 0) {
    return null;
  }

  const belowThreshold = activeUsers.filter(
    (user) => (userLeadCounts[user._id.toString()] || 0) < THRESHOLD
  );
  const candidateUsers = belowThreshold.length > 0 ? belowThreshold : activeUsers;

  return sortUsersByLoad(candidateUsers, userLeadCounts)[0] || null;
}

async function buildAssignmentContext(languages, User, Lead) {
  const uniqueLanguages = [...new Set(languages.filter(Boolean))];

  if (uniqueLanguages.length === 0) {
    return { usersByLanguage: new Map(), userLeadCounts: {} };
  }

  const activeUsers = await User.find({
    status: "Active",
    role: "User",
    language: { $in: uniqueLanguages },
  }).sort({ createdAt: 1, _id: 1 });

  const userLeadCounts = {};

  await Promise.all(
    activeUsers.map(async (user) => {
      userLeadCounts[user._id.toString()] = await Lead.countDocuments({
        assignedTo: user._id,
        status: { $ne: "Closed" },
      });
    })
  );

  const usersByLanguage = activeUsers.reduce((accumulator, user) => {
    const languageUsers = accumulator.get(user.language) || [];
    languageUsers.push(user);
    accumulator.set(user.language, languageUsers);
    return accumulator;
  }, new Map());

  return { usersByLanguage, userLeadCounts };
}

export async function assignLead(leadData, User, Lead) {
  const { language } = leadData;
  const { usersByLanguage, userLeadCounts } = await buildAssignmentContext(
    [language],
    User,
    Lead
  );

  const selectedUser = selectUserForLanguage(language, usersByLanguage, userLeadCounts);

  if (!selectedUser) {
    return { assignedTo: null, assignedAt: null };
  }

  return {
    assignedTo: selectedUser._id,
    assignedAt: new Date(),
  };
}

export async function bulkAssignLeads(leads, User, Lead) {
  const { usersByLanguage, userLeadCounts } = await buildAssignmentContext(
    leads.map((lead) => lead.language),
    User,
    Lead
  );

  return leads.map((lead) => {
    const selectedUser = selectUserForLanguage(lead.language, usersByLanguage, userLeadCounts);

    if (!selectedUser) {
      return {
        ...lead,
        assignedTo: null,
        assignedAt: null,
      };
    }

    const userKey = selectedUser._id.toString();
    userLeadCounts[userKey] = (userLeadCounts[userKey] || 0) + 1;

    return {
      ...lead,
      assignedTo: selectedUser._id,
      assignedAt: new Date(),
    };
  });
}
