require("dotenv").config();
const mongoose = require("mongoose");
const Person = require("./models/Person");
const User = require("./models/User");
const Customer = require("./models/Customer");
const e = require("cors");

async function migrate() {
  // 1. Connect first and wait for it
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connected to MongoDB");

  const users = await mongoose.connection.db.collection('users').find().toArray();
  const customers = await mongoose.connection.db.collection('customers').find().toArray();
  console.log('Customer doc:', customers[0]);

  console.log(`Found ${users.length} users, ${customers.length} customers`);

  // 2. Map of userId -> user doc for easy lookup
    const customerMap = new Map(customers.map(c => [c.user.toString(), c]));

    const person = [
        ...users.map(u => {
          const customer = customerMap.get(u._id.toString());
          
          // If user has a customer profile, use that name
          if (customer) {
            return {
              FirstName: customer.FirstName,
              LastName: customer.LastName,
              email: u.email,
              passwordHash: u.password,
              role: 'customer',
              PhoneNumber: customer.PhoneNumber,
              ConsentForMarketing: customer.ConsentForMarketing || false,
              CreatedAt: customer.CreatedAt || u.createdAt || new Date()
            };
          }
          
          // Admin user with no customer profile - use fallback
          return {
            FirstName: u.role === 'admin' ? 'Admin' : 'Unknown',
            LastName: u.role === 'admin' ? 'User' : 'User',
            email: u.email,
            passwordHash: u.password,
            role: u.role,
            PhoneNumber: null,
            ConsentForMarketing: false,
            CreatedAt: u.createdAt || new Date()
          };
        })
      ];
  
    //chexks for bad docs
    person.forEach((p, index) => {
        if (!p.FirstName || !p.LastName || !p.email) {
            console.warn(` Bad Doc at index ${index} `, p);
        }
    }
    );



  // Remove docs without email
  const validPeople = person.filter(p => p.email && p.email.trim()!== '');
  console.log(`Skipped ${person.length - validPeople.length} docs with missing email`);
  await Person.insertMany(validPeople);

  // Remove duplicates by email
  const seen = new Set();
  const uniquePeople = validPeople.filter(p => {
    const email = p.email.toLowerCase();
    if (seen.has(email)) return false;
    seen.add(email);
    return true;
  });
  console.log(`Inserting ${uniquePeople.length} unique docs`);

  if (uniquePeople.length > 0) {
    await Person.insertMany(uniquePeople);
    console.log(`Successfully migrated ${uniquePeople.length} docs to Person collection`);
    
    const count = await Person.countDocuments();
    console.log(`Person collection now has: ${count} docs`);
  } else {
    console.log('No docs to insert');
  }

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});