/**
 * Supabase Connection Test Utility
 * Tests all connections and API endpoints
 */

import { supabase, isSupabaseEnabled, checkSupabaseHealth } from '../lib/supabaseClient';
import {
  fetchClientsByCoach,
  fetchClientById,
  fetchWorkoutPlansByClient,
  fetchRequestsByCoach,
  fetchRequestsByClient,
  getOrCreateCoachCode
} from '../lib/supabaseApi';

interface TestResult {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export class SupabaseTester {
  private results: TestResult[] = [];

  private addResult(result: TestResult) {
    this.results.push(result);
    console.log(`${result.status.toUpperCase()}: ${result.name} - ${result.message}`);
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🔍 Starting Supabase Connection Tests...\n');

    this.results = [];

    // Basic connection tests
    await this.testBasicConnection();
    await this.testHealthCheck();

    // API endpoint tests (if user is logged in)
    if (supabase?.auth.getUser()) {
      await this.testAuthStatus();
      await this.testAPIEndpoints();
    } else {
      this.addResult({
        name: 'Authentication',
        status: 'warning',
        message: 'No user logged in - skipping authenticated tests'
      });
    }

    console.log(`\n✅ Tests completed. ${this.results.filter(r => r.status === 'success').length} passed, ${this.results.filter(r => r.status === 'warning').length} warnings, ${this.results.filter(r => r.status === 'error').length} errors.`);

    return this.results;
  }

  private async testBasicConnection(): Promise<void> {
    const startTime = Date.now();

    try {
      if (!isSupabaseEnabled) {
        this.addResult({
          name: 'Basic Connection',
          status: 'error',
          message: 'Supabase is not enabled - check environment variables',
          duration: Date.now() - startTime
        });
        return;
      }

      if (!supabase) {
        this.addResult({
          name: 'Basic Connection',
          status: 'error',
          message: 'Supabase client not initialized',
          duration: Date.now() - startTime
        });
        return;
      }

      this.addResult({
        name: 'Basic Connection',
        status: 'success',
        message: 'Supabase client initialized successfully',
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.addResult({
        name: 'Basic Connection',
        status: 'error',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testHealthCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      const isHealthy = await checkSupabaseHealth();

      this.addResult({
        name: 'Health Check',
        status: isHealthy ? 'success' : 'error',
        message: isHealthy ? 'Database connection healthy' : 'Database connection failed',
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.addResult({
        name: 'Health Check',
        status: 'error',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testAuthStatus(): Promise<void> {
    const startTime = Date.now();

    try {
      const { data, error } = await supabase!.auth.getUser();

      if (error) {
        this.addResult({
          name: 'Authentication Status',
          status: 'error',
          message: `Auth check failed: ${error.message}`,
          duration: Date.now() - startTime
        });
      } else if (data.user) {
        this.addResult({
          name: 'Authentication Status',
          status: 'success',
          message: `User authenticated: ${data.user.email}`,
          duration: Date.now() - startTime
        });
      } else {
        this.addResult({
          name: 'Authentication Status',
          status: 'warning',
          message: 'No authenticated user',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        name: 'Authentication Status',
        status: 'error',
        message: `Auth check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testAPIEndpoints(): Promise<void> {
    try {
      const { data: user } = await supabase!.auth.getUser();
      if (!user.user) return;

      // Test coach code generation
      await this.testEndpoint('Coach Code Generation', () => getOrCreateCoachCode(user.user!.id));

      // Test client fetching (will likely return empty for new users)
      await this.testEndpoint('Fetch Clients', () => fetchClientsByCoach(user.user!.id));

      // Test workout plans fetching
      await this.testEndpoint('Fetch Workout Plans', () => fetchWorkoutPlansByClient(user.user!.id));

      // Test requests fetching
      await this.testEndpoint('Fetch Requests (Coach)', () => fetchRequestsByCoach(user.user!.id));
      await this.testEndpoint('Fetch Requests (Client)', () => fetchRequestsByClient(user.user!.id));

      // Test client profile fetching
      await this.testEndpoint('Fetch Client Profile', () => fetchClientById(user.user!.id));

    } catch (error) {
      this.addResult({
        name: 'API Endpoints',
        status: 'error',
        message: `API tests failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async testEndpoint(name: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();

    try {
      const result = await testFn();

      // Check if result has error property
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        this.addResult({
          name,
          status: 'warning',
          message: `API returned error: ${result.error.message || 'Unknown error'}`,
          duration: Date.now() - startTime
        });
      } else {
        this.addResult({
          name,
          status: 'success',
          message: 'API call successful',
          duration: Date.now() - startTime
        });
      }
    } catch (error) {
      this.addResult({
        name,
        status: 'error',
        message: `API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      });
    }
  }
}

// Export singleton instance
export const supabaseTester = new SupabaseTester();

// Convenience function for quick testing
export const testSupabaseConnection = () => supabaseTester.runAllTests();
