'use client';

// Mock Supabase client using localStorage for local MVP testing
class MockSupabase {
  auth = {
    signInWithPassword: async ({ email, password }: any) => {
      if (email === 'admin@admin.com' && password === 'admin') {
        sessionStorage.setItem('supabase.auth.token', 'mock-token');
        return { data: { session: { user: { email } } }, error: null };
      }
      return { data: null, error: { message: 'Invalid credentials. Use admin@admin.com / admin' } };
    },
    getSession: async () => {
      if (typeof window === 'undefined') return { data: { session: null } };
      const token = sessionStorage.getItem('supabase.auth.token');
      return { data: { session: token ? { user: {} } : null } };
    },
    onAuthStateChange: (callback: any) => {
      return { subscription: { unsubscribe: () => {} } };
    },
    signOut: async () => {
      sessionStorage.removeItem('supabase.auth.token');
      window.location.href = '/admin/login';
    }
  };

  from(table: string) {
    const getTable = () => {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(`mock_db_${table}`);
      return data ? JSON.parse(data) : [];
    };
    const saveTable = (data: any[]) => {
      localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));
    };

    return {
      select: (query = '*') => {
        let data = getTable();
        let chain = {
          eq: (field: string, val: any) => {
            data = data.filter((item: any) => item[field] === val);
            return chain;
          },
          order: (field: string, { ascending }: { ascending: boolean }) => {
            data.sort((a: any, b: any) => {
              if (a[field] < b[field]) return ascending ? -1 : 1;
              if (a[field] > b[field]) return ascending ? 1 : -1;
              return 0;
            });
            return chain;
          },
          limit: (n: number) => {
            data = data.slice(0, n);
            return chain;
          },
          single: async () => {
            return { data: data[0] || null, error: data.length > 0 ? null : { message: 'Not found' } };
          },
          then: (resolve: any) => resolve({ data, count: data.length, error: null }),
        };
        // For await ... select()
        (chain as any).then = (resolve: any) => resolve({ data, count: data.length, error: null });
        return chain;
      },
      insert: (items: any[]) => {
        const tableData = getTable();
        const newItems = items.map(item => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString()
        }));
        saveTable([...tableData, ...newItems]);
        
        let chain = {
          select: () => {
            let selectChain = {
              single: async () => {
                return { data: newItems[0], error: null };
              },
              then: (resolve: any) => resolve({ data: newItems, error: null })
            };
            return selectChain;
          },
          then: (resolve: any) => resolve({ data: newItems, error: null })
        };
        return chain;
      },
      update: (updates: any) => {
        let tableData = getTable();
        let eqField: string, eqVal: any;
        let chain = {
          eq: (field: string, val: any) => {
            eqField = field;
            eqVal = val;
            return chain;
          },
          then: (resolve: any) => {
            tableData = tableData.map((item: any) => item[eqField] === eqVal ? { ...item, ...updates } : item);
            saveTable(tableData);
            resolve({ error: null });
          }
        };
        return chain;
      }
    };
  }
}

export const supabase = typeof window !== 'undefined' ? new MockSupabase() : {} as any;
