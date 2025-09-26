import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getUserOrders, createOrder, updateOrderStatus } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { InsertOrder } from '@/types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
};

export const useUserOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', 'user', user?.id],
    queryFn: () => user ? getUserOrders(user.id) : Promise.resolve([]),
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
