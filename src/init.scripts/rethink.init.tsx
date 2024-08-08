import rt from "rethinkdb";
import { getRethinkDB } from "../db/rethink";
import { hash } from "bcrypt-ts";
import { NewUser } from "../services/user.services/interface";

// Replace this array with your actual data
const tableNames: string[] = ['chat', 'contracts', 'notifications', 'cardImage', 'users', 'songImage', 'cardPacks'];

const createDatabaseAndTables = async (): Promise<void> => {
  try {
    const connection: rt.Connection = await getRethinkDB();

    // Create the 'admin' database if it doesn't exist
    await rt.dbCreate('admin').run(connection).catch(err => {
      if (!err.message.includes("already exists")) {
        throw err;
      }
    });

    // Use the 'admin' database
    await rt.db('admin').wait().run(connection);

    // Define table options with primary key
    const tableOptions: rt.TableOptions = {
      primary_key: 'username', // Replace 'username' with the desired primary key
    };

    // Create tables inside the 'admin' database
    for (const tableName of tableNames) {
      await rt.db('admin').tableCreate(tableName, tableOptions).run(connection).catch(err => {
        if (!err.message.includes("already exists")) {
          throw err;
        }
      });
      console.log(`Table '${tableName}' created or already exists.`);
    }

    // Example of inserting a new user into the 'users' table
    const encryptedPassword: string = await hash('maryannpielago#666', 10);
    const newUser: NewUser = {
      access: '0',
      username: 'kaetaro13',
      email: 'hello@gmetarave.art',
      encryptedPassword,
      registeredAt: Date.now(),
      userId: '0000000'
    };

    await rt
      .db('admin')
      .table('users')
      .insert(newUser, { conflict: "replace" }) // Replace user if already exists based on primary key
      .run(connection)
      .catch(err => {
        if (!err.message.includes("Duplicate primary key")) {
          throw err;
        }
        console.log(`User '${newUser.username}' already exists.`);
      });

    console.log('Database and tables created or already exist.');

  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

// Run the function
createDatabaseAndTables();
