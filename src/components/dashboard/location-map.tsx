"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, X, Car, User, Phone, MapPin } from "lucide-react";
import { SectionActions } from "@/components/dashboard/section-actions";
import { LocationItemActions } from "@/components/dashboard/location-item-actions";

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  brand: string | null;
  model: string | null;
  customerName: string;
  customerPhone: string | null;
}

interface Location {
  id: string;
  code: string;
  label: string;
  section: string;
  isIndoor: boolean;
  isOccupied: boolean;
  vehicle: Vehicle | null;
}

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

interface LocationMapProps {
  locations: Location[];
  isAdmin: boolean;
}

export function LocationMap({ locations, isAdmin }: LocationMapProps) {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const searchLower = search.toLowerCase().trim();

  const matchedLocationIds = useMemo(() => {
    if (!searchLower) return null;
    return new Set(
      locations
        .filter((l) => {
          if (l.code.toLowerCase().includes(searchLower)) return true;
          if (!l.vehicle) return false;
          if (l.vehicle.licensePlate.toLowerCase().includes(searchLower)) return true;
          if (l.vehicle.customerName.toLowerCase().includes(searchLower)) return true;
          if (l.vehicle.brand?.toLowerCase().includes(searchLower)) return true;
          if (l.vehicle.model?.toLowerCase().includes(searchLower)) return true;
          return false;
        })
        .map((l) => l.id)
    );
  }, [locations, searchLower]);

  const searchResults = useMemo(() => {
    if (!matchedLocationIds) return [];
    return locations.filter((l) => matchedLocationIds.has(l.id));
  }, [locations, matchedLocationIds]);

  const sections = useMemo(() => {
    return [...new Set(locations.map((l) => l.section))];
  }, [locations]);

  const stats = useMemo(() => {
    const total = locations.length;
    const occupied = locations.filter((l) => l.isOccupied).length;
    return { total, occupied, free: total - occupied };
  }, [locations]);

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg border bg-white p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Totaal</p>
        </div>
        <div className="rounded-lg border bg-green-50 border-green-200 p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.free}</p>
          <p className="text-xs text-green-600">Vrij</p>
        </div>
        <div className="rounded-lg border bg-red-50 border-red-200 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.occupied}</p>
          <p className="text-xs text-red-600">Bezet</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek op kenteken, klantnaam, merk of locatie..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedLocation(null);
          }}
          className="pl-10 pr-10 h-11 text-base"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedLocation(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search results */}
      {searchLower && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {searchResults.length} resultaat{searchResults.length !== 1 ? "en" : ""} voor &ldquo;{search}&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Geen resultaten gevonden</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors hover:bg-muted ${
                      selectedLocation?.id === loc.id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${loc.isOccupied ? "bg-red-500" : "bg-green-500"}`} />
                        <span className="font-mono font-bold">{loc.code}</span>
                        {loc.vehicle && (
                          <>
                            <span className="text-muted-foreground">—</span>
                            <span className="font-mono">{loc.vehicle.licensePlate}</span>
                            <span className="text-muted-foreground text-sm">{loc.vehicle.customerName}</span>
                          </>
                        )}
                      </div>
                      <Badge variant={loc.isIndoor ? "outline" : "secondary"} className="text-xs">
                        {loc.isIndoor ? "Binnen" : "Buiten"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected location detail */}
      {selectedLocation?.vehicle && (
        <Card className="mb-4 border-primary">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-bold text-lg">{selectedLocation.code}</span>
                  <Badge variant={selectedLocation.isIndoor ? "outline" : "secondary"} className="text-xs">
                    {selectedLocation.isIndoor ? "Binnen" : "Buiten"}
                  </Badge>
                  <Badge className="text-xs">Sectie {selectedLocation.section}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-bold">{selectedLocation.vehicle.licensePlate}</span>
                  <span className="text-sm text-muted-foreground">
                    {vehicleTypeLabels[selectedLocation.vehicle.type]}
                    {selectedLocation.vehicle.brand && ` — ${selectedLocation.vehicle.brand}`}
                    {selectedLocation.vehicle.model && ` ${selectedLocation.vehicle.model}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedLocation.vehicle.customerName}</span>
                </div>
                {selectedLocation.vehicle.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedLocation.vehicle.customerPhone}`} className="text-primary hover:underline">
                      {selectedLocation.vehicle.customerPhone}
                    </a>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          Vrij
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          Bezet
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Binnen</Badge>
          <Badge variant="secondary">Buiten</Badge>
        </div>
      </div>

      {/* Map grid */}
      {sections.map((section) => {
        const sectionLocations = locations.filter((l) => l.section === section);
        const occupiedCount = sectionLocations.filter((l) => l.isOccupied).length;

        return (
          <Card key={section} className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sectie {section}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {occupiedCount}/{sectionLocations.length} bezet
                </p>
              </div>
              {isAdmin && (
                <SectionActions
                  sectionName={section}
                  locationCount={sectionLocations.length}
                  occupiedCount={occupiedCount}
                />
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {sectionLocations.map((location) => {
                  const isOccupied = location.isOccupied;
                  const isHighlighted = matchedLocationIds?.has(location.id);
                  const isDimmed = matchedLocationIds !== null && !isHighlighted;
                  const isSelected = selectedLocation?.id === location.id;

                  return (
                    <div
                      key={location.id}
                      onClick={() => {
                        if (location.vehicle) setSelectedLocation(location);
                      }}
                      className={`relative group rounded-lg border-2 p-3 text-center transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : isHighlighted
                            ? "border-yellow-400 ring-2 ring-yellow-300 scale-105"
                            : isOccupied
                              ? "border-red-300 bg-red-50"
                              : "border-green-300 bg-green-50"
                      } ${isDimmed ? "opacity-30" : ""} ${
                        location.vehicle ? "cursor-pointer hover:scale-105" : ""
                      }`}
                    >
                      {isAdmin && !isOccupied && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LocationItemActions
                            locationId={location.id}
                            locationCode={location.code}
                            section={location.section}
                            isIndoor={location.isIndoor}
                          />
                        </div>
                      )}
                      <div className="font-mono font-bold text-lg">
                        {location.code}
                      </div>
                      <Badge
                        variant={location.isIndoor ? "outline" : "secondary"}
                        className="mt-1 text-xs"
                      >
                        {location.isIndoor ? "Binnen" : "Buiten"}
                      </Badge>
                      {isOccupied && location.vehicle && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="font-mono font-medium">
                            {location.vehicle.licensePlate}
                          </div>
                          <div>{location.vehicle.customerName}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
