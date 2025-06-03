import React from 'react';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { getProjects, addToCart, createProject } from '../services/api';
import type { Project } from '../types';
import { cn } from '../utils/cn';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  author: string;
  image_url?: string;
}

// Define the context type expected from the Outlet
interface PortfolioOutletContext {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
  createProjectMutation: UseMutationResult<any, Error, ProjectFormData, unknown>;
  searchQuery: string;
}

const Projects: React.FC = () => {
  const { isFormOpen, setIsFormOpen, createProjectMutation, searchQuery } = useOutletContext<PortfolioOutletContext>();
  console.log('Projects component rendered. isFormOpen:', isFormOpen, 'searchQuery:', searchQuery);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>();

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart.');
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Remove empty image_url from data
      const projectData = {
        ...data,
        image_url: data.image_url?.trim() || undefined
      };
      await createProjectMutation.mutateAsync(projectData);
      reset();
    } catch (error) {
      console.error('Error creating project via mutateAsync:', error);
    }
  };

   // Filter projects based on searchQuery
  const filteredProjects = data?.projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.author.toLowerCase().includes(searchQuery.toLowerCase())
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
        Error loading projects. Please try again later.
      </div>
    );
  }

  return (
    <div>
      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41]",
                  errors.title ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                {...register('category', { required: 'Category is required' })}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41]",
                  errors.category ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                {...register('author', { required: 'Author is required' })}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41]",
                  errors.author ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
              <input
                {...register('image_url', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL'
                  }
                })}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41]",
                  errors.image_url ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85C41]",
                  errors.description ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                reset();
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="px-4 py-2 bg-[#E85C41] text-white rounded-lg hover:bg-[#d54c32] disabled:opacity-50"
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
          {createProjectMutation.isError && <p className="mt-2 text-sm text-red-500">Error: {createProjectMutation.error.message}</p>}
          {createProjectMutation.isSuccess && <p className="mt-2 text-sm text-green-600">Project created successfully!</p>}
        </form>
      )}

      <div className="space-y-4">
        {filteredProjects.map((project: Project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex p-3 items-center gap-4">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.category}</p>
                <p className="text-gray-500 text-xs">Oleh: {project.author}</p>
              </div>
              <button 
                onClick={() => addToCartMutation.mutate(project.id)}
                className="px-4 py-1 bg-[#E85C41] text-white rounded-lg text-sm"
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? 'Adding...' : 'Add'}
              </button>
            </div>
            {addToCartMutation.isError && <p className="ml-auto text-sm text-red-500">Failed to add.</p>}
            {addToCartMutation.isSuccess && <p className="ml-auto text-sm text-green-600">Added!</p>}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => queryClient.prefetchQuery({
                queryKey: ['projects', page],
                queryFn: () => getProjects({ page, limit: data.pagination.limit })
              })}
              className={`px-3 py-1 rounded ${
                page === data.pagination.page
                  ? 'bg-[#E85C41] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;