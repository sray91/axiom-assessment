'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '../../../lib/supabase';

export default function BenchmarksAdmin() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    low: '',
    med: '',
    high: ''
  });
  
  useEffect(() => {
    async function fetchBenchmarks() {
      try {
        setLoading(true);
        const supabase = createBrowserClient();
        
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client');
        }
        
        const { data, error } = await supabase
          .from('benchmarks')
          .select('*')
          .order('category');
        
        if (error) throw error;
        
        setBenchmarks(data || []);
      } catch (err) {
        console.error('Error fetching benchmarks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBenchmarks();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'category' ? value : parseFloat(value)
    });
  };
  
  const startEditing = (benchmark) => {
    setEditingId(benchmark.id);
    setFormData({
      category: benchmark.category,
      low: benchmark.low,
      med: benchmark.med,
      high: benchmark.high
    });
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      category: '',
      low: '',
      med: '',
      high: ''
    });
  };
  
  const saveChanges = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserClient();
      
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase
        .from('benchmarks')
        .update({
          category: formData.category,
          low: formData.low,
          med: formData.med,
          high: formData.high
        })
        .eq('id', editingId);
      
      if (error) throw error;
      
      // Refresh benchmarks
      const { data, error: fetchError } = await supabase
        .from('benchmarks')
        .select('*')
        .order('category');
      
      if (fetchError) throw fetchError;
      
      setBenchmarks(data || []);
      setEditingId(null);
      setFormData({
        category: '',
        low: '',
        med: '',
        high: ''
      });
    } catch (err) {
      console.error('Error updating benchmark:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const addBenchmark = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserClient();
      
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase
        .from('benchmarks')
        .insert({
          category: formData.category,
          low: formData.low,
          med: formData.med,
          high: formData.high
        });
      
      if (error) throw error;
      
      // Refresh benchmarks
      const { data, error: fetchError } = await supabase
        .from('benchmarks')
        .select('*')
        .order('category');
      
      if (fetchError) throw fetchError;
      
      setBenchmarks(data || []);
      setFormData({
        category: '',
        low: '',
        med: '',
        high: ''
      });
    } catch (err) {
      console.error('Error adding benchmark:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteBenchmark = async (id) => {
    if (!confirm('Are you sure you want to delete this benchmark?')) {
      return;
    }
    
    try {
      setLoading(true);
      const supabase = createBrowserClient();
      
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase
        .from('benchmarks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state to remove the deleted benchmark
      setBenchmarks(benchmarks.filter(benchmark => benchmark.id !== id));
    } catch (err) {
      console.error('Error deleting benchmark:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && benchmarks.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Benchmark Management</h1>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading benchmarks...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Benchmark Management</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Add/Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editingId ? 'Edit Benchmark' : 'Add New Benchmark'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Downtime"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low (%)
            </label>
            <input
              type="number"
              name="low"
              value={formData.low}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medium (%)
            </label>
            <input
              type="number"
              name="med"
              value={formData.med}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 15"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              High (%)
            </label>
            <input
              type="number"
              name="high"
              value={formData.high}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 30"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          {editingId ? (
            <>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={saveChanges}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={addBenchmark}
              disabled={!formData.category || !formData.low || !formData.med || !formData.high}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${!formData.category || !formData.low || !formData.med || !formData.high
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`
              }
            >
              Add Benchmark
            </button>
          )}
        </div>
      </div>
      
      {/* Benchmarks Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low (%)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medium (%)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High (%)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {benchmarks.map((benchmark) => (
              <tr key={benchmark.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {benchmark.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {benchmark.low}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {benchmark.med}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {benchmark.high}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => startEditing(benchmark)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBenchmark(benchmark.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {benchmarks.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No benchmarks found. Add your first benchmark above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 