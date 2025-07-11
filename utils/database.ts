// Simple in-memory database for demo purposes
// In a real app, you'd use expo-sqlite or AsyncStorage

export interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  created_at: string;
}

export interface UserActivity {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

class InMemoryDatabase {
  private users: UserData[] = [];
  private activities: UserActivity[] = [];
  private nextUserId = 1;
  private nextActivityId = 1;
  private initialized = false;

  async initializeDatabase(): Promise<void> {
    if (this.initialized) return;
    
    // Add sample data
    const sampleUsers = [
      { name: 'Rajesh Patil', email: 'rajesh@example.com', age: 28, city: 'AB' },
      { name: 'Rakesh Patil', email: 'rakesh@example.com', age: 32, city: 'CD' },
    ];

    for (const user of sampleUsers) {
      this.users.push({
        id: this.nextUserId++,
        name: user.name,
        email: user.email,
        age: user.age,
        city: user.city,
        created_at: new Date().toISOString()
      });
    }

    this.initialized = true;
    console.log('Database initialized successfully');
  }

  async getAllUsers(): Promise<UserData[]> {
    return [...this.users].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async addUser(name: string, email: string, age: number, city: string): Promise<void> {
    const newUser: UserData = {
      id: this.nextUserId++,
      name,
      email,
      age,
      city,
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);
  }

  async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  async logUserActivity(action: string, details: string = ''): Promise<void> {
    const activity: UserActivity = {
      id: this.nextActivityId++,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    this.activities.push(activity);
  }

  async getUserActivities(): Promise<UserActivity[]> {
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }

  async getActivityStats(): Promise<{ action: string; count: number }[]> {
    const stats: { [key: string]: number } = {};
    
    this.activities.forEach(activity => {
      stats[activity.action] = (stats[activity.action] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);
  }
}

const dbInstance = new InMemoryDatabase();

export class DatabaseManager {
  static async initializeDatabase(): Promise<void> {
    await dbInstance.initializeDatabase();
  }

  static async getAllUsers(): Promise<UserData[]> {
    return await dbInstance.getAllUsers();
  }

  static async addUser(name: string, email: string, age: number, city: string): Promise<void> {
    await dbInstance.addUser(name, email, age, city);
  }

  static async deleteUser(id: number): Promise<void> {
    await dbInstance.deleteUser(id);
  }

  static async logUserActivity(action: string, details: string = ''): Promise<void> {
    await dbInstance.logUserActivity(action, details);
  }

  static async getUserActivities(): Promise<UserActivity[]> {
    return await dbInstance.getUserActivities();
  }

  static async getActivityStats(): Promise<{ action: string; count: number }[]> {
    return await dbInstance.getActivityStats();
  }
}
