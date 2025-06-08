import type { WeatherData, GeocodingResponse } from "@/Api/types";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  if (!data) return null;
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  return (
    <Card className="overflow-hidden mt-5 ">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold tracking-tighter">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    , {locationName?.state}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {locationName?.country}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter">
                {temp.toFixed(0)}°
              </p>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Feels like {feels_like.toFixed(0)}°
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <p className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {temp_min.toFixed(0)}°
                  </p>
                  <p className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {temp_max.toFixed(0)}°
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gao-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm font-muted-foreground">
                    {humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm font-muted-foreground">
                    {speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`} alt="" />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
