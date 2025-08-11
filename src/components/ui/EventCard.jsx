import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, onRegister }) {
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary">{event.category}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-background/80">
              {event.price > 0 ? formatCurrency(event.price) : "Free"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {event.attendees || 0} attending
            </div>
            <div>Capacity: {event.capacity ?? "N/A"}</div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              className="flex-1"
              disabled={event.capacity <= event.attendees}
              onClick={() => {
                if (onRegister) {
                  onRegister(event.id);
                }
              }}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
