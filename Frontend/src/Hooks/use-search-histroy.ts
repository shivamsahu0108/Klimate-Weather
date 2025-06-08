import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface SearchHistoryItem {
  id: string;
  query: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
  searchedAt: number;
}
export function useSearchHistory() {
  const [histroy, setHistory]= useLocalStorage<SearchHistoryItem[]>("search-history", []);
  const QueryClient = useQueryClient();
  const histroyQuery =useQuery({
    queryKey: ["search-history"],
    queryFn: () => histroy,
    initialData: histroy,
  })
  const addToHistory = useMutation({
    mutationFn: async (search:Omit<SearchHistoryItem, "id" | "searchedAt">)=>{
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      }
      const filteredHistory = histroy.filter(
        (item) => !(item.lat === search.lat && item.lon === newSearch.lon))
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      setHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      QueryClient.setQueryData(["search-history"], newHistory);}
  });
  const clearHistory = useMutation({
    mutationFn: async() => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      QueryClient.setQueryData(["search-history"], []);}
  })
  return {
    histroy: histroyQuery.data??[],
    addToHistory,
    clearHistory,
  }
}
