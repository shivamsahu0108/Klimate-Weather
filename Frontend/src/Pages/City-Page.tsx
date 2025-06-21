import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useWeatherQuery } from "@/Hooks/Use-Weather";
import { useParams, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import WeatherSkeleton from "@/components/loading-skeletion";

import WeatherDetails from "../components/Weather-Details";
import WeatherForecast from "../components/Weather-Forcast";
import CurrentWeather from "../components/current-weather";
import HourlyTemperature from "../components/hourly-temperature";
import FavoriteButton from "@/components/favorite-button";


const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  console.log(params);
  const Coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(Coordinates);
  const forecastQuery = useForecastQuery(Coordinates);
  return (
  <>
    {weatherQuery.error || forecastQuery.error ? (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          Failed to load weather data. Please try again later.
        </AlertDescription>
      </Alert>
    ) : null}

    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">
        {params.city}, {params.country}
      </h1>
      <FavoriteButton data={{ ...weatherQuery.data, name: params.city }} />
    </div>

    <div className="grid gap-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTemperature data={forecastQuery.data} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <WeatherDetails data={weatherQuery.data} />
        <WeatherForecast data={forecastQuery.data} />
      </div>
    </div>
  </>
);

};

export default CityPage;
