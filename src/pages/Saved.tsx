import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { getCartItems, removeFromCart } from '../services/api';
import type { CartItem } from '../types';
import { useOutletContext } from 'react-router-dom';

// Define the context type expected from the Outlet
interface PortfolioOutletContext {
  searchQuery: string;
}

const Saved: React.FC = () => {
  const { searchQuery } = useOutletContext<PortfolioOutletContext>();
  console.log('Saved component rendered. searchQuery:', searchQuery);
  const queryClient = useQueryClient();
  const { data: savedItems, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItems,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      console.log('Item removed successfully');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing item:', error);
      alert('Failed to remove item.');
    }
  });

  const handleRemove = (id: number) => {
    console.log('Removing item with ID:', id);
    removeFromCartMutation.mutate(id);
  };

  // Filter saved items based on searchQuery
  const filteredSavedItems = savedItems?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E85C41]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading saved items. Please try again later.
      </div>
    );
  }

  console.log('Saved items:', filteredSavedItems);

  return (
    <div>
      {/* Filter is part of PortfolioLayout now, remove from here */}
      {/*
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>
      */}

      <div className="space-y-4">
        {filteredSavedItems?.map((item: CartItem) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex p-3 items-center gap-4">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.category}</p>
                <p className="text-gray-500 text-xs">Oleh: {item.author}</p>
              </div>
              <button 
                onClick={() => handleRemove(item.id)}
                className="px-4 py-1 bg-red-500 text-white rounded-lg text-sm"
                disabled={removeFromCartMutation.isPending}
              >
                {removeFromCartMutation.isPending ? 'Removing...' : 'Remove'}
              </button>
            </div>
            {removeFromCartMutation.isError && <p className="ml-auto text-sm text-red-500">Failed to remove.</p>}
            {removeFromCartMutation.isSuccess && <p className="ml-auto text-sm text-green-600">Removed!</p>}
          </div>
        ))}
        {filteredSavedItems?.length === 0 && (
           <div className="text-center text-gray-500 py-8">No saved projects yet.</div>
        )}
      </div>
    </div>
  );
};

export default Saved;