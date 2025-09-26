import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductsByCategory, getProduct, addProduct, updateProduct, deleteProduct } from '@/lib/firebase';
import type { Product, InsertProduct, Category } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useProductsByCategory = (category: Category) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertProduct> }) =>
      updateProduct(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
