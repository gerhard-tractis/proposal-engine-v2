'use client';

import { Client } from "@repo/shared";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Stat {
  value: string;
  label: string;
}

/**
 * Calculate relative luminance of a hex color (WCAG formula)
 * Returns a value between 0 (black) and 1 (white)
 */
function getLuminance(hex: string): number {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const linearize = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLinear = linearize(r);
  const gLinear = linearize(g);
  const bLinear = linearize(b);

  // Calculate relative luminance (WCAG formula)
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determine if text should be light or dark based on background gradient
 * Returns true if background is dark (needs light text)
 */
function shouldUseLightText(primaryColor: string, accentColor: string): boolean {
  const primaryLuminance = getLuminance(primaryColor);
  const accentLuminance = getLuminance(accentColor);

  // Average luminance of the gradient
  const avgLuminance = (primaryLuminance + accentLuminance) / 2;

  // WCAG threshold: 0.5 is roughly middle gray
  // If background is darker than middle gray, use light text
  return avgLuminance < 0.5;
}

export function HeroGradient({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const tagline = (data.tagline as string) || "";
  const stats = Array.isArray(data.stats) ? (data.stats as Stat[]) : [];

  if (!title) {
    return null;
  }

  // Determine text color based on background brightness
  const useLightText = shouldUseLightText(
    client.colors.primary,
    client.colors.accent
  );

  // Use solid colors - no opacity on text (looks washed out)
  const textColor = useLightText ? '#ffffff' : '#1a1a1a';
  const borderColor = useLightText
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(26, 26, 26, 0.2)';

  return (
    <section
      className="relative py-20 px-4 sm:px-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`,
      }}
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: textColor }}>
            {title}
          </h1>

          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: textColor }}>
              {subtitle}
            </h2>
          )}

          {tagline && (
            <p className="text-lg md:text-xl italic max-w-2xl mx-auto" style={{ color: textColor }}>
              {tagline}
            </p>
          )}
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-3 gap-6 md:gap-12 mt-12 pt-12 border-t"
            style={{ borderColor }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: textColor }}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base uppercase tracking-wide" style={{ color: textColor }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
