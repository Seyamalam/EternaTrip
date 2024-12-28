"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { addDays, differenceInDays } from "date-fns";

const calculatorSchema = z.object({
  destination: z.string().min(1, "Please select a destination"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  travelers: z.number().min(1, "At least one traveler is required").max(20, "Maximum 20 travelers allowed"),
  accommodation: z.object({
    type: z.string().min(1, "Please select accommodation type"),
    budget: z.number().min(0, "Budget must be a positive number"),
  }),
  transportation: z.object({
    type: z.string().min(1, "Please select transportation type"),
    budget: z.number().min(0, "Budget must be a positive number"),
  }),
  activities: z.array(z.object({
    name: z.string().min(1, "Activity name is required"),
    cost: z.number().min(0, "Cost must be a positive number"),
  })).optional(),
  food: z.object({
    dailyBudget: z.number().min(0, "Daily food budget must be a positive number"),
  }),
  miscellaneous: z.number().min(0, "Miscellaneous budget must be a positive number"),
});

const destinations = [
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Africa",
  "Australia",
];

const accommodationTypes = [
  "Hotel",
  "Resort",
  "Hostel",
  "Apartment",
  "Vacation Rental",
];

const transportationTypes = [
  "Flight",
  "Train",
  "Bus",
  "Car Rental",
  "Local Transport",
];

export function TravelBudgetCalculator() {
  const [totalBudget, setTotalBudget] = useState<number | null>(null);
  const [activities, setActivities] = useState<Array<{ name: string; cost: number }>>([]);

  const form = useForm<z.infer<typeof calculatorSchema>>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      travelers: 1,
      accommodation: {
        budget: 0,
      },
      transportation: {
        budget: 0,
      },
      food: {
        dailyBudget: 0,
      },
      miscellaneous: 0,
      activities: [],
    },
  });

  const addActivity = () => {
    setActivities([...activities, { name: "", cost: 0 }]);
  };

  const removeActivity = (index: number) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  const calculateTotalBudget = (data: z.infer<typeof calculatorSchema>) => {
    const numberOfDays = differenceInDays(data.endDate, data.startDate) + 1;
    const accommodationTotal = data.accommodation.budget * numberOfDays;
    const transportationTotal = data.transportation.budget;
    const foodTotal = data.food.dailyBudget * numberOfDays * data.travelers;
    const activitiesTotal = activities.reduce((sum, activity) => sum + activity.cost, 0);
    const miscellaneousTotal = data.miscellaneous;

    const total =
      accommodationTotal +
      transportationTotal +
      foodTotal +
      activitiesTotal +
      miscellaneousTotal;

    setTotalBudget(total);
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateTotalBudget)} className="space-y-6">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {destinations.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < form.getValues("startDate")
                    }
                    initialFocus
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="travelers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Travelers</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Accommodation</h3>
            <FormField
              control={form.control}
              name="accommodation.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accommodationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="accommodation.budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transportation</h3>
            <FormField
              control={form.control}
              name="transportation.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transportation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transportationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="transportation.budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Transportation Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Activities</h3>
              <Button type="button" variant="outline" onClick={addActivity}>
                Add Activity
              </Button>
            </div>
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  placeholder="Activity name"
                  value={activity.name}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].name = e.target.value;
                    setActivities(newActivities);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Cost"
                  value={activity.cost}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].cost = parseFloat(e.target.value) || 0;
                    setActivities(newActivities);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeActivity(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="food.dailyBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Food Budget (per person)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="miscellaneous"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miscellaneous Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Additional expenses like shopping, emergencies, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Calculate Total Budget</Button>
        </form>
      </Form>

      {totalBudget !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>
              Estimated total budget for your trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-2">
              This is an estimate based on your inputs. Actual costs may vary.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 