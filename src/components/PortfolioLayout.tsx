import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Filter, Plus, Search } from 'lucide-react';
import { cn } from '../utils/cn';
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createProject } from '../services/api';
import type { ProjectFormData } from '../services/api';

interface SearchFormData {
  query: string;
}

// Define the context type being passed down
interface PortfolioOutletContext {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
  createProjectMutation: UseMutationResult<any, Error, ProjectFormData, unknown>;
  searchQuery: string;
}

const PortfolioLayout: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  // Use useForm only for handling potential form submission if needed for other purposes,
  // but live search will use onChange.
  const { register: registerSearch, handleSubmit: handleSubmitSearch, formState: { errors: errorsSearch }, reset: resetSearch } = useForm<SearchFormData>();

  const navItems = [
    { label: 'Project', to: '/portfolio/projects' },
    { label: 'Saved', to: '/portfolio/saved' },
    { label: 'Shared', to: '/portfolio/shared' },
    { label: 'Achievement', to: '/portfolio/achievement' },
  ];

   // Prevent default form submission
   const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search query is already updated by onChange
    console.log('Search form submitted (prevented default)');
  };

   const handleFilterClick = () => {
    console.log('Filter button clicked');
    alert('Filter options would appear here!');
    // TODO: Implement filter functionality UI (e.g., modal or dropdown)
   };

  // NOTE: isFormOpen state and onSubmit are related to the New Project form
  // This state/logic might need to be lifted up or managed differently
  // if the New Project form is meant to be a modal or shared component.
  // For now, keeping it here, but it will only affect the Projects page
  // if the form is rendered within the Outlet.
  const [isFormOpen, setIsFormOpen] = useState(false);

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      // Assuming the form reset will be handled in the child component (Projects)
    },
     onError: (error) => {
      console.error('Error creating project:', error);
       // Optionally display an error message to the user
       alert('Failed to create project. Please try again.');
    }
  });

  const context: PortfolioOutletContext = {
    isFormOpen,
    setIsFormOpen,
    createProjectMutation,
    searchQuery,
  };

  return (
    <div>
      {/* Portfolio Header (remains horizontal) */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        {/* Assuming these are icons like bag and bell */}
        <div className="flex gap-4 items-center">
           {/* Placeholder for icons, replace with actual icon components */}
           <button aria-label="Cart">🛒</button> {/* Replace with actual cart icon */}
           <button aria-label="Notifications">🔔</button> {/* Replace with actual notification icon */}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex overflow-x-auto border-b mb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "px-4 py-2 border-b-2 font-medium whitespace-nowrap",
                location.pathname === item.to || (location.pathname === '/portfolio' && item.to === '/portfolio/projects') // Handle /portfolio active state
                  ? "border-[#E85C41] text-[#E85C41]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Search, Filter, and New Project Section - Stack vertically on mobile, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
           <div className="w-full sm:flex-1 sm:max-w-xs">
              <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search a project"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41] focus:border-transparent"
                    )}
                  />
                  {/* Remove validation errors for live search */}
                  {/*errorsSearch.query && (
                    <p className="mt-1 text-sm text-red-500">{errorsSearch.query.message}</p>
                  )*/}
              </form>
           </div>
           {/* Filter and New Project Buttons - Stack vertically on mobile next to search, horizontal on larger screens */}
            <div className="flex flex-row gap-4 w-full sm:w-auto">
              <button
                 onClick={handleFilterClick}
                className="flex-1 justify-center sm:flex-none flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                <span>Filter</span>
              </button>
              <button
                onClick={() => {
                  console.log('New Project button clicked. Toggling form visibility.');
                  setIsFormOpen(!isFormOpen);
                }}
                className="flex-1 justify-center sm:flex-none flex items-center gap-2 px-4 py-2 bg-[#E85C41] text-white rounded-lg hover:bg-[#d54c32]"
              >
                <Plus size={20} />
                <span>New Project</span>
              </button>
           </div>
      </div>

      {/* Renders nested routes (Projects, Saved, Shared, Achievement) */}
      <Outlet context={context} />
    </div>
  );
};

export default PortfolioLayout; 