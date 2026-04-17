import mongoose from 'mongoose';
import Lead from './server/models/Lead.js';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function reassignLeads() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const leads = await Lead.find({ assignedTo: null });
  console.log(`Found ${leads.length} unassigned leads`);
  
  let assigned = 0;
  for (const lead of leads) {
    // Find active users with matching language
    const matchingUsers = await User.find({
      status: 'Active',
      language: lead.language,
      role: 'User',
    });
    
    if (matchingUsers.length === 0) {
      console.log(`⚠ No user found for ${lead.name} (${lead.language})`);
      continue;
    }
    
    // Apply round-robin: find user with least open leads
    const userLeadCounts = {};
    for (const user of matchingUsers) {
      const count = await Lead.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Closed' },
      });
      userLeadCounts[user._id.toString()] = count;
    }
    
    const THRESHOLD = 3;
    const belowThreshold = matchingUsers.filter(
      (user) => (userLeadCounts[user._id.toString()] || 0) < THRESHOLD
    );
    
    const candidates = belowThreshold.length > 0 ? belowThreshold : matchingUsers;
    const selectedUser = candidates.sort((a, b) => {
      return (userLeadCounts[a._id.toString()] || 0) - (userLeadCounts[b._id.toString()] || 0);
    })[0];
    
    lead.assignedTo = selectedUser._id;
    lead.assignedAt = new Date();
    await lead.save();
    
    console.log(`✓ ${lead.name} → ${selectedUser.firstName} ${selectedUser.lastName}`);
    assigned++;
  }
  
  console.log(`\nReassigned ${assigned} leads`);
  await mongoose.disconnect();
}

reassignLeads();
