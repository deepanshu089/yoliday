import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

interface GetProjectsParams {
  page?: number;
  limit?: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  author: string;
  image_url?: string;
}

export const getProjects = async (params?: GetProjectsParams) => {
  try {
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error loading projects. Please try again later.');
    }
    throw new Error('Error loading projects. Please try again later.');
  }
};

export const createProject = async (data: ProjectFormData) => {
  try {
    console.log('Sending project data:', JSON.stringify(data, null, 2));
    const response = await api.post('/projects', data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    if (axios.isAxiosError(error)) {
      console.error('Server response:', error.response?.data);
      console.error('Validation errors:', error.response?.data?.error);
      throw new Error(
        Array.isArray(error.response?.data?.error) 
          ? error.response?.data?.error.map((e: any) => e.message).join(', ')
          : error.response?.data?.error || 'Error creating project. Please try again later.'
      );
    }
    throw new Error('Error creating project. Please try again later.');
  }
};

export const getCartItems = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error loading cart items. Please try again later.');
    }
    throw new Error('Error loading cart items. Please try again later.');
  }
};

export const addToCart = async (projectId: number) => {
  try {
    const response = await api.post('/cart', {
      project_id: projectId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error adding to cart. Please try again later.');
    }
    throw new Error('Error adding to cart. Please try again later.');
  }
};

export const removeFromCart = async (cartItemId: number) => {
  try {
    console.log('Sending delete request for cart item:', cartItemId);
    const response = await api.delete(`/cart/${cartItemId}`);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error removing from cart. Please try again later.');
    }
    throw new Error('Error removing from cart. Please try again later.');
  }
};