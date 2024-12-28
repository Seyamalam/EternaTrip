"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const preferencesSchema = z.object({
  preferredDestinations: z.array(z.string()).min(1, "Select at least one destination"),
  dietaryRestrictions: z.array(z.string()),
  accommodationType: z.array(z.string()).min(1, "Select at least one accommodation type"),
  budgetRange: z.string().min(1, "Select a budget range"),
  travelStyle: z.array(z.string()).min(1, "Select at least one travel style"),
});

const destinations = [
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Africa",
  "Australia",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "None",
];

const accommodationTypes = [
  "Hotel",
  "Resort",
  "Villa",
  "Apartment",
  "Hostel",
];

const budgetRanges = [
  "Economy ($)",
  "Moderate ($$)",
  "Luxury ($$$)",
  "Ultra-Luxury ($$$$)",
];

const travelStyles = [
  "Adventure",
  "Relaxation",
  "Cultural",
  "Family",
  "Romance",
  "Business",
];

export function UserPreferencesForm({ initialData, onSubmit }: any) {
  const form = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: initialData || {
      preferredDestinations: [],
      dietaryRestrictions: [],
      accommodationType: [],
      budgetRange: "",
      travelStyle: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="preferredDestinations"
          render={() => (
            <FormItem>
              <FormLabel>Preferred Destinations</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {destinations.map((destination) => (
                  <FormField
                    key={destination}
                    control={form.control}
                    name="preferredDestinations"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(destination)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              return checked
                                ? field.onChange([...value, destination])
                                : field.onChange(value.filter((v: string) => v !== destination));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{destination}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="travelStyle"
          render={() => (
            <FormItem>
              <FormLabel>Travel Style</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {travelStyles.map((style) => (
                  <FormField
                    key={style}
                    control={form.control}
                    name="travelStyle"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(style)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              return checked
                                ? field.onChange([...value, style])
                                : field.onChange(value.filter((v: string) => v !== style));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{style}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Preferences</Button>
      </form>
    </Form>
  );
} 