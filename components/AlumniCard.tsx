import { AlumniRecord } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Mail,
  MapPin,
  Briefcase,
  Building2,
} from "lucide-react";

interface AlumniCardProps {
  alumni: AlumniRecord;
  onEdit?: (alumni: AlumniRecord) => void;
  onDelete?: (alumniId: string) => void;
}

export default function AlumniCard({
  alumni,
  onEdit,
  onDelete,
}: AlumniCardProps) {
  const fallbackInitial = alumni.name
    ? alumni.name.charAt(0).toUpperCase()
    : "A";

  return (
    <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200 rounded-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-500 to-slate-500" />

      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-20 w-20 border border-blue-200 shrink-0 mx-auto sm:mx-0">
            <AvatarImage
              src={alumni.image || "/placeholder-avatar.jpg"}
              alt={alumni.name}
            />
            <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {alumni.name}
            </h3>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
              {alumni.faculty && (
                <Badge variant="secondary" className="text-[11px] font-medium">
                  {alumni.faculty}
                </Badge>
              )}
              {alumni.session && (
                <Badge variant="outline" className="text-[11px] font-medium">
                  {alumni.session}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-0 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-base font-medium text-slate-800 dark:text-slate-100">
              {alumni.email || "N/A"}
            </span>
          </div>

          <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
              <span>
                {[alumni.village, alumni.upazilla].filter(Boolean).join(", ") ||
                  "Location N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-500 shrink-0" />
              <span>
                {alumni.profession || "N/A"}{" "}
                {alumni.job_rank ? `(${alumni.job_rank})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{alumni.company || "N/A"}</span>
            </div>
          </div>
        </CardContent>

        {(onEdit || onDelete) && (
          <CardFooter className="flex flex-row flex-wrap justify-end gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-slate-800"
                onClick={() => onEdit(alumni)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(alumni.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
