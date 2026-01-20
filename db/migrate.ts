import { db, client } from './index.ts';
import { activities, members, financial, cooperative } from './schema.ts';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('Starting migration...');

    // Read JSON data
    const activitiesData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'activities.json'), 'utf8')
    );
    const membersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'members.json'), 'utf8')
    );
    const financialData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'financial.json'), 'utf8')
    );
    const cooperativeData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'cooperative.json'), 'utf8')
    );

    // Create tables
    console.log('Creating tables...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        joinDate TEXT NOT NULL
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS financial (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT NOT NULL
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS cooperative (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL
      )
    `);

    // Migrate activities
    console.log('Migrating activities...');
    for (const activity of activitiesData) {
      await db.insert(activities).values(activity);
    }

    // Migrate members
    console.log('Migrating members...');
    for (const member of membersData) {
      await db.insert(members).values(member);
    }

    // Migrate financial
    console.log('Migrating financial data...');
    for (const entry of financialData) {
      await db.insert(financial).values(entry);
    }

    // Migrate cooperative
    console.log('Migrating cooperative info...');
    await db.insert(cooperative).values(cooperativeData);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
