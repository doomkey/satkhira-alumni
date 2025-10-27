import { AlumniRecord } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  Trash2,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Phone,
  Globe,
  BookUser,
  Calendar,
} from "lucide-react";

interface AlumniCardProps {
  alumni: AlumniRecord;
  onEdit?: (alumni: AlumniRecord) => void;
  onDelete?: (alumniId: string) => void;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  href?: string;
}) => {
  if (!value) return null;

  const content = (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-zinc-500 shrink-0 mt-1" />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-medium text-slate-800 dark:text-slate-100 break-all">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="p-2 -ml-2">{content}</div>;
};

export default function AlumniCard({
  alumni,
  onEdit,
  onDelete,
}: AlumniCardProps) {
  const fallbackInitial = alumni.name
    ? alumni.name.charAt(0).toUpperCase()
    : "A";

  const address =
    [alumni.village, alumni.upazilla].filter(Boolean).join(", ") || null;

  return (
    <Card className="relative overflow-hidden ">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-20 w-20 border border-blue-200 shrink-0 mx-auto sm:mx-0 overflow-hidden">
            <AvatarImage
              src={alumni.image || "/placeholder-avatar.jpg"}
              alt={alumni.name}
              className="object-cover object-center h-full w-full"
            />
            <AvatarFallback className="bg-primary text-white text-lg font-semibold">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {alumni.name}
            </h3>
            <p className="text-base text-primary font-medium">
              {alumni.profession === "Student"
                ? "Student"
                : `${alumni.job_rank} at ${alumni.company}`}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <InfoRow icon={BookUser} label="Faculty" value={alumni.faculty} />
            <InfoRow icon={Calendar} label="Session" value={alumni.session} />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={address}
              href={
                address
                  ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
                  : undefined
              }
            />
          </div>
          <div>
            <InfoRow
              icon={Mail}
              label="Email"
              value={alumni.email}
              href={`mailto:${alumni.email}`}
            />
            <InfoRow
              icon={Phone}
              label="WhatsApp"
              value={alumni.whatsapp}
              href={`https://wa.me/${alumni.whatsapp}`}
            />
            <InfoRow
              icon={Globe}
              label="Facebook"
              value={alumni.facebook_link}
              href={alumni.facebook_link}
            />
          </div>
        </div>

        {(onEdit || onDelete) && (
          <CardFooter className="flex flex-row flex-wrap justify-end gap-2 p-0 pt-4">
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
