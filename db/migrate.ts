import { db, client } from './index.ts';
import { activities, members, financialReports, cooperative, staff } from './schema.ts';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('Starting migration...');

    // Read JSON data
    // const activitiesData = JSON.parse(
    //   fs.readFileSync(path.join(process.cwd(), 'data', 'activities.json'), 'utf8')
    // );
    // const membersData = JSON.parse(
    //   fs.readFileSync(path.join(process.cwd(), 'data', 'members.json'), 'utf8')
    // );
    // const financialData = JSON.parse(
    //   fs.readFileSync(path.join(process.cwd(), 'data', 'financial.json'), 'utf8')
    // );
    // const cooperativeData = JSON.parse(
    //   fs.readFileSync(path.join(process.cwd(), 'data', 'cooperative.json'), 'utf8')
    // );

    // // Create tables
    // console.log('Creating tables...');
    // await client.execute(`
    //   CREATE TABLE IF NOT EXISTS activities (
    //     id INTEGER PRIMARY KEY,
    //     title TEXT NOT NULL,
    //     description TEXT NOT NULL,
    //     date TEXT NOT NULL
    //   )
    // `);

    // await client.execute(`
    //   CREATE TABLE IF NOT EXISTS members (
    //     id INTEGER PRIMARY KEY,
    //     name TEXT NOT NULL,
    //     address TEXT NOT NULL,
    //     joinDate TEXT NOT NULL
    //   )
    // `);

    // await client.execute(`
    //   CREATE TABLE IF NOT EXISTS financial (
    //     id INTEGER PRIMARY KEY,
    //     date TEXT NOT NULL,
    //     category TEXT NOT NULL,
    //     amount INTEGER NOT NULL,
    //     description TEXT NOT NULL
    //   )
    // `);

    // await client.execute(`
    //   CREATE TABLE IF NOT EXISTS cooperative (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     name TEXT NOT NULL,
    //     address TEXT NOT NULL,
    //     phone TEXT NOT NULL,
    //     email TEXT NOT NULL
    //   )
    // `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        category TEXT NOT NULL,
        imageUrl TEXT
      )
    `);

    // // Migrate activities
    // console.log('Migrating activities...');
    // for (const activity of activitiesData) {
    //   await db.insert(activities).values(activity);
    // }

    // // Migrate members
    // console.log('Migrating members...');
    // for (const member of membersData) {
    //   await db.insert(members).values(member);
    // }

    // // Migrate financial
    // console.log('Migrating financial data...');
    // for (const entry of financialData) {
    //   await db.insert(financial).values(entry);
    // }

    // // Migrate cooperative
    // console.log('Migrating cooperative info...');
    // await db.insert(cooperative).values(cooperativeData);

    // Migrate staff
    console.log('Migrating staff data...');
    const staffData = [
      // Pengurus
      { name: "Fahrozi", position: "Ketua", category: "pengurus" },
      { name: "Afrizal", position: "Wakil Ketua", category: "pengurus" },
      { name: "Hambali", position: "Wakil Ketua 2", category: "pengurus" },
      { name: "Zulfikar", position: "Sekretaris", category: "pengurus" },
      { name: "Yoga Bagus Pribadi", position: "Wakil Sekretaris", category: "pengurus" },
      { name: "Jauhari", position: "Bendahara", category: "pengurus" },
      { name: "Fathurozi", position: "Wakil Bendahara", category: "pengurus" },
      { name: "Melsy Gustiva", position: "Staf Bendahara", category: "pengurus" },
      { name: "Ahyat", position: "Pengawas Lapangan", category: "pengurus" },
      { name: "Afrizal C", position: "Pengawas Lapangan", category: "pengurus" },
      { name: "Masni", position: "Pengawas Lapangan", category: "pengurus" },
      { name: "Arjun Rinaldi", position: "Petugas Lapangan", category: "pengurus" },
      { name: "Amron", position: "Petugas Lapangan", category: "pengurus" },
      { name: "Martunis", position: "Petugas Lapangan", category: "pengurus" },
      { name: "Ori", position: "Petugas Lapangan", category: "pengurus" },
      { name: "Ari", position: "Petugas Lapangan", category: "pengurus" },
      // Dewan Pengawas
      { name: "Subhan", position: "Koordinator", category: "dewan_pengawas" },
      { name: "Fathoni", position: "Anggota", category: "dewan_pengawas" },
      { name: "Solihin", position: "Anggota", category: "dewan_pengawas" },
      { name: "Hamdani", position: "Anggota", category: "dewan_pengawas" },
      { name: "Hasbullah", position: "Anggota", category: "dewan_pengawas" },
      { name: "Mifadol", position: "Anggota", category: "dewan_pengawas" },
    ];

    for (const member of staffData) {
      await db.insert(staff).values(member);
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
