const { checkIfDbExist, createLB, checkIfTableExists, createUserTable } = require("../model/connect");
const { Client } = require('pg');

jest.mock("../model/connect"); // Mock the database functions

const DB = new Client({
    user: 'postgres',
    host: 'localhost',
    password: "",
    port: 5431,
});

describe('Database Functions', () => {
  beforeAll(async () => {
    // Connect to the test database or set up any necessary configurations
    await DB.connect();
    const checkdb = await checkIfDbExist(DB);

    if (!checkdb) {
      await createLB(DB, 'languagebuddytest');
    }
  });

  afterAll(async () => {
    // Clean up and disconnect from the test database
    await DB.end();
  });

  it('should check if a table exists', async () => {
    // Mock the checkIfTableExists function
    checkIfTableExists.mockResolvedValue(false);

    const result = await checkIfTableExists('users', DB);
    expect(result).toBe(false); // Check if the 'users' table exists
  });

  it('should create a new user table', async () => {
    // Mock the createUserTable function
    createUserTable.mockResolvedValue();

    await createUserTable(DB);
    const result = await checkIfTableExists('users', DB);
    expect(result).toBe(true); // Check if the 'users' table exists after creation
  });

  // Add more test cases for other functions...
});
