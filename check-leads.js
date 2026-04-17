import mongoose from 'mongoose';
import Lead from './server/models/Lead.js';
import User from './server/models/User.js';

async function checkLeads() {
  await mongoose.connect('mongodb://127.0.0.1:27017/crm-system');
  
  const leads = await Lead.find().populate('assignedTo');
  console.log(`📋 Total leads: ${leads.length}`);
  
  if (leads.length > 0) {
    console.log('\nFirst 10 leads:');
    leads.slice(0, 10).forEach((lead, i) => {
      const assignedName = lead.assignedTo 
        ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
        : 'UNASSIGNED';
      console.log(`${i+1}. ${lead.name} (${lead.language}) → ${assignedName}`);
    });
    
    console.log('\n📊 Lead counts by assignee:');
    const byAssignee = {};
    leads.forEach((lead) => {
      const key = lead.assignedTo 
        ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
        : 'UNASSIGNED';
      byAssignee[key] = (byAssignee[key] || 0) + 1;
    });
    Object.entries(byAssignee).sort((a,b) => b[1] - a[1]).forEach(([name, count]) => {
      console.log(`  ${name}: ${count} leads`);
    });
  }
  
  await mongoose.disconnect();
}

checkLeads();
