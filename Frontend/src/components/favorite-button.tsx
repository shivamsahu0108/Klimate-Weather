import type { WeatherData } from "@/Api/types";
import { useFavorite } from "@/Hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData;
}
const FavoriteButton = ({ data }: FavoriteButtonProps) => {
  if (!data.coord) return null;

  const { addToFavorite, removeFavorite, isFavorite } = useFavorite();
  const isCurrentlyFavortie = isFavorite(data.coord.lat, data.coord.lon);


  const handleToggleFavorite = ()=>{
    if(isCurrentlyFavortie){
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
      toast.error(`Removed ${data.name} from favorites`)
    }else{
      addToFavorite.mutate({
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      })
      toast.success(`Added ${data.name} to favorites`)
    }
  }
  return (
    <Button
      variant={isCurrentlyFavortie ? "default" : "outline"}
      size={"icon"} onClick={handleToggleFavorite}
      className={ isCurrentlyFavortie ? "text-yellow-500 hover:bg-yellow-600 " : ""
      }
    >
      <Star
        className={`h-4 w-4  ${isCurrentlyFavortie ? "fill-current" : ""}`}
      ></Star>
    </Button>
  );
};
export default FavoriteButton;
