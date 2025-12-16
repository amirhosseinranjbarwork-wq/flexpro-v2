import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { useRole } from '../useRole';

// Mock Supabase client first
vi.mock('../../lib/supabaseClient', () => ({
  supabase: null,
  isSupabaseEnabled: false,
}));

// Mock the useAuth hook
const mockUseAuth = vi.fn();

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  };
});

describe('useRole Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return coach role from profile', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'client' }, // Different from profile
      },
      profile: {
        role: 'coach',
        coach_code: 'COACH123',
      },
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('coach');
    expect(result.current.profile).toEqual({
      role: 'coach',
      coach_code: 'COACH123',
    });
    expect(result.current.loading).toBe(false);
  });

  it('should return client role from profile', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: {
        role: 'client',
      },
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('client');
    expect(result.current.profile).toEqual({
      role: 'client',
    });
  });

  it('should fallback to user metadata when profile role is invalid', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'coach' },
      },
      profile: {
        role: 'invalid_role',
      },
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('coach');
  });

  it('should fallback to user metadata when no profile', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'client' },
      },
      profile: null,
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('client');
  });

  it('should return null when no valid role found', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'invalid' },
      },
      profile: {
        role: 'also_invalid',
      },
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it('should return null when user metadata role is invalid', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'admin' }, // Invalid role
      },
      profile: null,
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
  });

  it('should handle loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: true,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle undefined profile', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'coach' },
      },
      profile: undefined,
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('coach');
    expect(result.current.profile).toBeNull();
  });

  it('should prioritize profile over user metadata', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 'client' },
      },
      profile: {
        role: 'coach',
      },
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe('coach');
  });

  it('should handle empty user metadata', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: {},
      },
      profile: null,
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
  });

  it('should handle non-string role in user metadata', () => {
    mockUseAuth.mockReturnValue({
      user: {
        user_metadata: { role: 123 }, // Number instead of string
      },
      profile: null,
      loading: false,
    });

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeNull();
  });
});




