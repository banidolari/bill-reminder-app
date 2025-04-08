'use client';

import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';

// Mock data for categories
const initialCategories = [
  { id: 'cat_default_utilities', name: 'Utilities', color: '#3B82F6', icon: 'bolt' },
  { id: 'cat_default_rent', name: 'Rent/Mortgage', color: '#10B981', icon: 'home' },
  { id: 'cat_default_subscription', name: 'Subscriptions', color: '#F59E0B', icon: 'repeat' },
  { id: 'cat_default_insurance', name: 'Insurance', color: '#8B5CF6', icon: 'shield' },
  { id: 'cat_default_credit', name: 'Credit Cards', color: '#EF4444', icon: 'credit-card' },
  { id: 'cat_default_other', name: 'Other', color: '#6B7280', icon: 'tag' },
];

export default function CategoriesManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6', icon: 'tag' });
  const [error, setError] = useState('');

  const colorOptions = [
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#EF4444', name: 'Red' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#6B7280', name: 'Gray' },
  ];

  const iconOptions = [
    { value: 'tag', name: 'Tag' },
    { value: 'bolt', name: 'Utilities' },
    { value: 'home', name: 'Home' },
    { value: 'repeat', name: 'Subscription' },
    { value: 'shield', name: 'Insurance' },
    { value: 'credit-card', name: 'Credit Card' },
    { value: 'shopping-bag', name: 'Shopping' },
    { value: 'car', name: 'Transportation' },
    { value: 'heart', name: 'Health' },
    { value: 'book', name: 'Education' },
    { value: 'coffee', name: 'Food & Drink' },
    { value: 'gift', name: 'Gift' },
  ];

  const handleAddCategory = () => {
    setError('');
    
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    const id = `cat_${Date.now()}`;
    setCategories([...categories, { ...newCategory, id }]);
    setNewCategory({ name: '', color: '#3B82F6', icon: 'tag' });
    setIsAddingCategory(false);
  };

  const handleUpdateCategory = () => {
    setError('');
    
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategoryId ? { ...cat, ...newCategory } : cat
      )
    );
    setNewCategory({ name: '', color: '#3B82F6', icon: 'tag' });
    setEditingCategoryId(null);
  };

  const handleEditCategory = (category) => {
    setNewCategory({ ...category });
    setEditingCategoryId(category.id);
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setNewCategory({ name: '', color: '#3B82F6', icon: 'tag' });
    setEditingCategoryId(null);
    setIsAddingCategory(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Categories
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => {
              setIsAddingCategory(true);
              setEditingCategoryId(null);
              setNewCategory({ name: '', color: '#3B82F6', icon: 'tag' });
            }}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Category Form */}
      {(isAddingCategory || editingCategoryId) && (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {editingCategoryId
                  ? 'Update the details of your category.'
                  : 'Create a new category to organize your bills.'}
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Utilities, Rent, Subscriptions"
                    />
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="category-color" className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <select
                    id="category-color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="category-icon" className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <select
                    id="category-icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingCategoryId ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div
                        className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <FiTag className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">Icon: {category.icon}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              No categories found. Add a category to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
