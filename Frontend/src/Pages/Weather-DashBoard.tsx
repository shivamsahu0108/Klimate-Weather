import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { useGeolocation } from "../Hooks/Use-Geolocation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherSkeleton from "../components/loading-skeletion";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/Hooks/Use-Weather";
import CurrentWeather from "@/components/current-weather";
import HourlyTemperature from "@/components/hourly-temperature";
import WeatherDetails from "@/components/Weather-Details";
import WeatherForecast from "@/components/Weather-Forcast";
import FavoritesCities from "@/components/favorites-cities";
const WeatherDashBoard = () => {
  const {
    Coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();
  const locationQuery = useReverseGeocodeQuery(Coordinates);
  const forecastQuery = useForecastQuery(Coordinates);
  const weatherQuery = useWeatherQuery(Coordinates);

  const handleRefresh = () => {
    getLocation();
    if (Coordinates) {
      locationQuery.refetch();
      forecastQuery.refetch();
      weatherQuery.refetch();
    }
  };
  const loactionName = locationQuery.data?.[0];

  return (
    <div className="mx-10">
      {/* Show loading state */}
      {locationLoading && <WeatherSkeleton />}

      {/* Show error alert if there's a location error */}
      {locationError && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>
            <p className="text-red-500">{locationError}</p>
            <Button
              onClick={getLocation}
              variant="outline"
              className="w-fit mt-2"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Enable Location
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* show if coordinates not available */}
      {!Coordinates && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle className="h-4 w-4" />
          <AlertDescription>
            <p className="text-red-500">
              Please enable location services to get weather information
            </p>
            <Button
              onClick={getLocation}
              variant="outline"
              className="w-fit mt-2"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Enable Location
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* show if weather data is not available */}
      {weatherQuery.error && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="h-4 w-4" />
          <AlertDescription>
            <p className="text-red-500">
              Failed to fetch weather data. Please try again later.
            </p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-fit mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* show loading state */}
      {(!weatherQuery.data || !forecastQuery.data) && <WeatherSkeleton />}
      {/* <h1>Favourite Cities</h1> */}
      <FavoritesCities />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex felx-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={loactionName} />
          <HourlyTemperature data={forecastQuery.data} />
          {/* current weather */}
          {/* houly temperature */}
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashBoard;
