import { useQuery } from '@tanstack/react-query';
import { getCompanyAccount, getAllTransactions, getFeeLogs, getDashboardStats } from '@/services/report.service';

export const useCompanyAccount = (enabled = true) => {
    return useQuery({ queryKey: ['companyAccount'], queryFn: getCompanyAccount, enabled });
};

export const useAllTransactions = (params) => {
    return useQuery({ queryKey: ['allTransactions', params], queryFn: () => getAllTransactions(params) });
};

export const useFeeLogs = (params) => {
    return useQuery({ queryKey: ['feeLogs', params], queryFn: () => getFeeLogs(params) });
};

export const useDashboardStats = (enabled = true) => {
    return useQuery({ queryKey: ['dashboardStats'], queryFn: getDashboardStats, enabled });
};

export const useSalesChart = (days = 7) => {
    return useQuery({ queryKey: ['salesChart', days], queryFn: () => getSalesChart(days) });
};