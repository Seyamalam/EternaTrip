'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxPeople: number;
  location: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    maxPeople: '',
    location: '',
    featured: false,
  });

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (editingTour) {
      setFormData({
        title: editingTour.title,
        description: editingTour.description,
        price: editingTour.price.toString(),
        duration: editingTour.duration.toString(),
        maxPeople: editingTour.maxPeople.toString(),
        location: editingTour.location || '',
        featured: editingTour.featured,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        maxPeople: '',
        location: '',
        featured: false,
      });
    }
  }, [editingTour]);

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/tours');
      if (!res.ok) throw new Error('Failed to fetch tours');
      const data = await res.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tours',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingTour ? 'PUT' : 'POST';
      const url = editingTour 
        ? `/api/tours/${editingTour.id}`
        : '/api/tours';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          maxPeople: parseInt(formData.maxPeople),
        }),
      });

      if (!res.ok) throw new Error('Failed to save tour');

      toast({
        title: 'Success',
        description: `Tour ${editingTour ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingTour(null);
      fetchTours();
      router.refresh();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingTour ? 'update' : 'create'} tour`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      const res = await fetch(`/api/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete tour');

      toast({
        title: 'Success',
        description: 'Tour deleted successfully',
      });

      fetchTours();
      router.refresh();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tour',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Tour Management</h1>
            <p className="text-muted-foreground">Create and manage tours</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTour(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTour ? 'Edit Tour' : 'Create New Tour'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPeople">Max People</Label>
                    <Input
                      id="maxPeople"
                      type="number"
                      min="1"
                      value={formData.maxPeople}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxPeople: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featured">Featured</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured">Show on homepage</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTour ? 'Update Tour' : 'Create Tour'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Max People</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.title}</TableCell>
                  <TableCell>{tour.location}</TableCell>
                  <TableCell>${tour.price.toFixed(2)}</TableCell>
                  <TableCell>{tour.duration} days</TableCell>
                  <TableCell>{tour.maxPeople}</TableCell>
                  <TableCell>{tour.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTour(tour);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit tour</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tour.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete tour</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tours.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No tours found. Create your first tour to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
} 