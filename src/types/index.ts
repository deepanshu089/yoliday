export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  image_url?: string;
}

export interface CartItem extends Project {
  quantity: number;
}