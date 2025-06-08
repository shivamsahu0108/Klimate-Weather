import { useState } from "react";

import {
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandDialog,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "../Hooks/Use-Weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/Hooks/use-search-histroy";
import { format } from 'date-fns';
import { useFavorite } from "@/Hooks/use-favorite";
import { Button } from '@/components/ui/button';

const citySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: locations, isLoading } = useLocationSearch(query);
  const { histroy, clearHistory, addToHistory } = useSearchHistory();
  const navigate = useNavigate();
  const {favorites} = useFavorite();
  const handleSelect = (cityDate: string) => {
    const [lat, lon, name, country] = cityDate.split("|");
    addToHistory.mutate({
      query,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
    });
    setOpen(false);
    navigate(`/city/${name}??lat=${lat}&lon=${lon}`);
  };
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
         {favorites.length > 0 && (
            <>
              <CommandGroup heading="Favorites">
                {favorites.map((location) => {
                  return (
                  <CommandItem
                    key={location.id}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    {location.country && (
                      <span className="text-sm text-muted-foreground">
                        , {location.country}
                      </span>
                    )}
                  </CommandItem>
                )})}

              </CommandGroup>
            </>
          )}

          {histroy.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup >
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-sm text-muted-foreground">Recent Searches</p>
                  <Button variant="ghost" size="sm" onClick={() => clearHistory.mutate()}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                {histroy.map((search) => (
                  <CommandItem key={`${search.lat}-${search.lon}`}
                  value={`${search.lat}|${search.lon}|${search.name}|${search.country}`}
                  onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground"/>
                    <span>{search.name}</span>
                    {search.state && (
                      <span className="text-sm text-muted-foreground">
                        , {search.state}
                      </span>
                    )}
                   <span className="text-sm text-muted-foreground">
                    {format(search.searchedAt, "MMM d, h:mm a")}
                   </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map(
                (location) => (
                  (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          ,{location.state}
                        </span>
                      )}
                      {location.country && (
                        <span className="text-sm text-muted-foreground">
                          ,{location.country}
                        </span>
                      )}
                    </CommandItem>
                  )
                )
              )}
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default citySearch;
