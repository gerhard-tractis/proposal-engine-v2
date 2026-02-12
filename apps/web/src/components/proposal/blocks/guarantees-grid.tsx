import { Client } from '@repo/shared';
import { ShieldCheck, Award, Zap, Target, Users, Lock, Clock, CheckCircle } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Guarantee {
  title: string;
  commitment: string;
  remedy: string;
  icon?: string;
}

export function GuaranteesGrid({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const guarantees = Array.isArray(data.guarantees) ? (data.guarantees as Guarantee[]) : [];

  if (guarantees.length === 0) {
    return null;
  }

  const iconMap: Record<string, typeof ShieldCheck> = {
    ShieldCheck,
    Award,
    Zap,
    Target,
    Users,
    Lock,
    Clock,
    CheckCircle,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return ShieldCheck;
    return iconMap[iconName] || ShieldCheck;
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guarantees.map((guarantee, index) => {
          const Icon = getIcon(guarantee.icon);

          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${client.colors.primary}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: client.colors.primary }} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {guarantee.title}
              </h3>

              {/* Commitment */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {guarantee.commitment}
              </p>

              {/* Remedy Callout */}
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: `${client.colors.accent}10`,
                  borderColor: `${client.colors.accent}40`,
                }}
              >
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  If We Miss This
                </div>
                <div className="text-sm text-gray-800 font-medium">
                  {guarantee.remedy}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          All guarantees are backed by our commitment to excellence and customer satisfaction
        </p>
      </div>
    </div>
  );
}
