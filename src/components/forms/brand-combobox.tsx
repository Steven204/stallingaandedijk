"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const brands = [
  // Caravans & Campers
  "Adria",
  "Airstream",
  "Autotrail",
  "Bailey",
  "Benimar",
  "Bessacarr",
  "Buccaneer",
  "Burstner",
  "Carado",
  "Carthago",
  "Challenger",
  "Chausson",
  "CI",
  "Coachman",
  "Compass",
  "Concorde",
  "Dethleffs",
  "Elddis",
  "Eriba",
  "Eura Mobil",
  "Fendt",
  "Fiat",
  "Ford",
  "Frankia",
  "Globecar",
  "Hobby",
  "Hymer",
  "Itineo",
  "Karmann",
  "Knaus",
  "La Strada",
  "Laika",
  "LMC",
  "Lunar",
  "Mercedes-Benz",
  "Morelo",
  "Niesmann+Bischoff",
  "Pilote",
  "Pössl",
  "Rapido",
  "Rimor",
  "Roller Team",
  "Sprite",
  "Sterckeman",
  "Sun Living",
  "Sunlight",
  "Swift",
  "Tabbert",
  "Trigano",
  "Volkswagen",
  "Weinsberg",
  // Auto's & Oldtimers
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "BMW",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daihatsu",
  "Dodge",
  "Ferrari",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rover",
  "Saab",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Triumph",
  "Volvo",
  // Boten
  "Bayliner",
  "Bavaria",
  "Beneteau",
  "Boston Whaler",
  "Hanse",
  "Jeanneau",
  "Quicksilver",
  "Sessa",
  "Wellcraft",
  "Overig",
];

interface BrandComboboxProps {
  name: string;
  defaultValue?: string;
}

export function BrandCombobox({ name, defaultValue }: BrandComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          />
        }>
          {value || "Selecteer merk..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Zoek merk..." />
            <CommandList>
              <CommandEmpty>Niet gevonden</CommandEmpty>
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand}
                    value={brand}
                    onSelect={(current) => {
                      setValue(current === value ? "" : current);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === brand ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {brand}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
