import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface Favoritecity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
  addedAt: number;
}
export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<Favoritecity[]>(
    "favorites",
    []
  );
  const QueryClient = useQueryClient();
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });
  const addToFavorite = useMutation({
    mutationFn: async (city: Omit<Favoritecity, "id" | "addedAt">) => {
      const newFavorite: Favoritecity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };
      const exites = favorites.some((fav) => fav.id === newFavorite.id);
      if (exites) return favorites;
      const newFavorites = [...favorites, newFavorite].slice(0, 10);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((city) => city.id !== cityId);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
  return {
    favorites: favoritesQuery.data ?? [],
    addToFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some((city) => city.lat === lat && city.lon === lon),
  };
}
