/**
 * Local Authentication System
 * سیستم احراز هویت محلی برای استفاده در حالت افلاین
 */

export interface LocalUser {
  id: string;
  email?: string;
  username: string;
  password: string; // Hashed password
  fullName: string;
  role: 'coach' | 'client';
  createdAt: string;
  updatedAt: string;
}

export interface LocalSession {
  userId: string;
  token: string;
  expiresAt: number;
}

const STORAGE_KEY_USERS = 'flexpro_local_users';
const STORAGE_KEY_SESSION = 'flexpro_local_session';

/**
 * Hash password using simple hash (for local use only)
 */
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Get all users from localStorage
 */
export function getLocalUsers(): LocalUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save users to localStorage
 */
function saveLocalUsers(users: LocalUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
    throw new Error('خطا در ذخیره اطلاعات کاربران');
  }
}

/**
 * Find user by identifier (email or username)
 */
export function findLocalUser(identifier: string): LocalUser | null {
  const users = getLocalUsers();
  return users.find(u => 
    u.email === identifier || 
    u.username.toLowerCase() === identifier.toLowerCase()
  ) || null;
}

/**
 * Create a new local user
 */
export function createLocalUser(params: {
  email?: string;
  username: string;
  password: string;
  fullName: string;
  role: 'coach' | 'client';
}): LocalUser {
  const users = getLocalUsers();
  
  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === params.username.toLowerCase())) {
    throw new Error('نام کاربری تکراری است. لطفا نام کاربری دیگری انتخاب کنید');
  }
  
  // Check if email already exists (if provided)
  if (params.email && users.some(u => u.email === params.email)) {
    throw new Error('این ایمیل قبلا ثبت شده است');
  }
  
  const newUser: LocalUser = {
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: params.email,
    username: params.username,
    password: hashPassword(params.password),
    fullName: params.fullName,
    role: params.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveLocalUsers(users);
  
  return newUser;
}

/**
 * Verify password for a user
 */
export function verifyLocalPassword(user: LocalUser, password: string): boolean {
  return user.password === hashPassword(password);
}

/**
 * Create a session
 */
export function createLocalSession(userId: string): LocalSession {
  const session: LocalSession = {
    userId,
    token: `local_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  return session;
}

/**
 * Get current session
 */
export function getLocalSession(): LocalSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!stored) return null;
    
    const session: LocalSession = JSON.parse(stored);
    
    // Check if session expired
    if (session.expiresAt < Date.now()) {
      clearLocalSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Clear session
 */
export function clearLocalSession(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION);
}

/**
 * Get user by ID
 */
export function getLocalUserById(userId: string): LocalUser | null {
  const users = getLocalUsers();
  return users.find(u => u.id === userId) || null;
}

/**
 * Update user
 */
export function updateLocalUser(userId: string, updates: Partial<Omit<LocalUser, 'id' | 'password'>>): LocalUser | null {
  const users = getLocalUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveLocalUsers(users);
  return users[index];
}



