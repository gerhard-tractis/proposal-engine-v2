import { Client } from "@repo/shared";
import { Award } from "lucide-react";
import Image from "next/image";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  credentials?: string[];
  image?: string;
}

export function TrustCredentials({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const team = Array.isArray(data.team) ? (data.team as TeamMember[]) : [];

  if (team.length === 0) {
    return null;
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-12">
      {sectionTitle && (
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => {
          const credentials = Array.isArray(member.credentials)
            ? (member.credentials as string[])
            : [];

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center mb-4">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                    style={{ backgroundColor: client.colors.primary }}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p
                  className="text-sm font-medium"
                  style={{ color: client.colors.accent }}
                >
                  {member.role}
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-4 text-center">
                {member.bio}
              </p>

              {credentials.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {credentials.map((credential, credIndex) => (
                    <span
                      key={credIndex}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: client.colors.accent }}
                    >
                      <Award className="w-3 h-3" />
                      {credential}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
