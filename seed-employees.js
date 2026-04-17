import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Clear existing users except admin
  await User.deleteMany({ role: 'User' });
  
  const employees = [
    {
      firstName: 'Tanner',
      lastName: 'Finsha',
      email: 'tanner.finsha@company.com',
      password: 'password123',
      role: 'User',
      language: 'Kannada',
      location: 'Bangalore',
      status: 'Active',
    },
    {
      firstName: 'Emeto',
      lastName: 'Winner',
      email: 'emeto.winner@company.com',
      password: 'password123',
      role: 'User',
      language: 'Marathi',
      location: 'Mumbai',
      status: 'Active',
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@company.com',
      password: 'password123',
      role: 'User',
      language: 'Hindi',
      location: 'Delhi',
      status: 'Active',
    },
    {
      firstName: 'Kavya',
      lastName: 'Rao',
      email: 'kavya.rao@company.com',
      password: 'password123',
      role: 'User',
      language: 'English',
      location: 'Bangalore',
      status: 'Active',
    },
    {
      firstName: 'Rahul',
      lastName: 'Desai',
      email: 'rahul.desai@company.com',
      password: 'password123',
      role: 'User',
      language: 'Bengali',
      location: 'Kolkata',
      status: 'Active',
    },
  ];
  
  await User.insertMany(employees);
  console.log('✓ Created 5 employees');
  
  const users = await User.find({ role: 'User' });
  console.log('\nEmployees:');
  users.forEach(u => {
    console.log(`- ${u.firstName} ${u.lastName} (${u.language}) - ${u.email}`);
  });
  
  await mongoose.disconnect();
}

seedUsers();
