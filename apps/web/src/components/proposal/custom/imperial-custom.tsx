'use client';

import type { Proposal } from '@repo/shared';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Shield, Layers, TrendingUp, Check, ArrowRight, ArrowDown } from 'lucide-react';

interface ImperialCustomProps {
  proposal: Proposal;
}

/**
 * Imperial - Aureon Connect
 * Modern proposal with Framer Motion animations
 */
export default function ImperialCustomProposal({ proposal }: ImperialCustomProps) {
  const { client, proposal: content } = proposal;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
          {/* Tractis Badge - Bottom-left corner - Subtle branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-3 left-2 sm:bottom-6 sm:left-6 bg-white/20 backdrop-blur-md px-2 py-1 sm:px-5 sm:py-3 rounded-md sm:rounded-xl border border-white/30 sm:border-2 shadow-lg"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[8px] sm:text-xs text-white font-semibold">Powered by</span>
              <Image
                src="/logos/tractis-white.svg"
                alt="Tractis"
                width={100}
                height={32}
                className="h-3 sm:h-6 w-auto"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center pt-6 sm:pt-8 px-2"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
              Aureon Connect
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium max-w-4xl mx-auto" style={{ color: '#ffffff' }}>
              Integrador Universal de Última Milla
            </p>
            <p className="text-sm sm:text-base md:text-lg mt-3 sm:mt-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Para Ecommerce y Operadores Logísticos
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto px-4"
          >
            {[
              { value: '48h', label: 'Integración' },
              { value: '100%', label: 'Agnóstico' },
              { value: '0', label: 'Vendor Lock-in' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24 md:space-y-32">

        {/* Problem Section */}
        <motion.section
          {...fadeIn}
          className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary}08 0%, ${client.colors.accent}08 100%)`
          }}
        >
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-2 sm:p-3 rounded-full mb-3 sm:mb-4"
              style={{ backgroundColor: `${client.colors.primary}20` }}
            >
              <Zap size={28} className="sm:w-8 sm:h-8" style={{ color: client.colors.primary }} />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-4" style={{ color: client.colors.primary }}>
              El Problema
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: '#374151' }}>
              Dependencia crítica de un solo proveedor TMS limita su red de transportes
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {content.needs.map((need, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-white"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  {index + 1}
                </div>
                <p className="leading-relaxed" style={{ color: '#374151' }}>{need}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Solution Section */}
        <motion.section
          {...fadeIn}
          className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.accent}08 0%, ${client.colors.primary}08 100%)`
          }}
        >
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-2 sm:p-3 rounded-full mb-3 sm:mb-4"
              style={{ backgroundColor: `${client.colors.accent}20` }}
            >
              <Layers size={28} className="sm:w-8 sm:h-8" style={{ color: client.colors.accent }} />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-4" style={{ color: client.colors.primary }}>
              La Solución
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: '#374151' }}>
              Middleware agnóstico que traduce automáticamente entre cualquier TMS
            </p>
          </div>

          {/* Visual Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-12 md:mb-16 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 max-w-5xl mx-auto">

              {/* Left: Multiple TMS Systems */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 text-center"
              >
                <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                  Sistemas de Transportes
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                  {[
                    { name: 'Beetrack', color: '#FF6B35', icon: '🚚' },
                    { name: 'Driv.in', color: '#4A90E2', icon: '🛣️' },
                    { name: 'Simpliroute', color: '#00C48C', icon: '📍' },
                    { name: 'Excel', color: '#217346', icon: '📊' }
                  ].map((system, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 rounded-lg bg-white border-2 flex items-center justify-center gap-2 h-14 hover:shadow-md transition-shadow"
                      style={{ borderColor: system.color }}
                    >
                      <span className="text-xl">{system.icon}</span>
                      <span className="text-sm font-bold" style={{ color: system.color }}>
                        {system.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Arrow - Down on mobile, Right on desktop */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0"
              >
                <ArrowDown size={40} className="md:hidden" style={{ color: client.colors.primary }} />
                <ArrowRight size={40} className="hidden md:block" style={{ color: client.colors.primary }} />
              </motion.div>

              {/* Center: Aureon Connect */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex-1 text-center"
              >
                <div
                  className="px-6 py-8 rounded-xl border-2 shadow-lg relative"
                  style={{
                    borderColor: client.colors.primary,
                    background: `linear-gradient(135deg, ${client.colors.primary}10 0%, ${client.colors.accent}10 100%)`
                  }}
                >
                  <Layers size={40} className="mx-auto mb-2" style={{ color: client.colors.primary }} />
                  <div className="text-xl font-bold" style={{ color: client.colors.primary }}>
                    Aureon Connect
                  </div>
                  <div className="text-xs mt-1 mb-3" style={{ color: '#6B7280' }}>
                    Traducción Automática
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>by</span>
                    <Image
                      src="/logos/tractis-color.svg"
                      alt="Tractis"
                      width={50}
                      height={16}
                      className="h-3 w-auto opacity-60"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Arrow - Down on mobile, Right on desktop */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex-shrink-0"
              >
                <ArrowDown size={40} className="md:hidden" style={{ color: client.colors.primary }} />
                <ArrowRight size={40} className="hidden md:block" style={{ color: client.colors.primary }} />
              </motion.div>

              {/* Right: Client TMS */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="flex-1 text-center"
              >
                <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                  Tu TMS
                </div>
                <div
                  className="px-6 py-6 rounded-xl shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
                  }}
                >
                  <div className="text-white font-bold text-lg">Vista Unificada</div>
                  <div className="text-white/80 text-xs mt-2">
                    Todos los transportes en un solo lugar
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Immediate Benefits */}
          <div className="space-y-6 mb-12">
            {[
              {
                icon: <Zap size={28} />,
                title: 'Eliminar Fricción para Agregar Transportes',
                points: [
                  '¿Encontraste un transportista que usa Beetrack? Lo agregamos en 48 horas',
                  '¿Necesitas capacidad urgente y el transporte usa Excel? Lo configuramos igual',
                  'Sin capacitación, sin integración técnica compleja'
                ]
              },
              {
                icon: <Shield size={28} />,
                title: 'Reducir Riesgo Operativo Crítico',
                points: [
                  'Tu continuidad operativa ya no depende de un solo proveedor',
                  'Puedes migrar de TMS sin perder tu red de transportes',
                  'Mantén flexibilidad tecnológica sin sacrificar operación'
                ]
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Escalar Sin Límites Tecnológicos',
                points: [
                  'Cada nuevo transporte que encuentres puede integrarse',
                  'La calidad del servicio es el único criterio de selección',
                  'Tu red crece según necesidades del negocio, no limitaciones técnicas'
                ]
              },
              {
                icon: <Layers size={28} />,
                title: 'Visibilidad Unificada',
                points: [
                  'Todos los transportes visibles en tu TMS actual',
                  'Formato estándar independiente del sistema origen',
                  'Trazabilidad completa sin importar heterogeneidad de proveedores'
                ]
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border-l-4 hover:shadow-lg transition-shadow"
                style={{ borderLeftColor: client.colors.primary }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 p-2 sm:p-3 rounded-lg"
                    style={{ backgroundColor: `${client.colors.primary}15`, color: client.colors.primary }}
                  >
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: client.colors.primary }}>
                      {benefit.title}
                    </h3>
                    <ul className="space-y-2">
                      {benefit.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={18} className="flex-shrink-0 mt-0.5" style={{ color: client.colors.primary }} />
                          <span className="text-sm" style={{ color: '#374151' }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Badge with Tractis Branding */}
          {content.techStack && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image
                  src="/logos/tractis-color.svg"
                  alt="Tractis"
                  width={80}
                  height={24}
                  className="h-5 w-auto opacity-70"
                />
              </div>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Tecnología empresarial probada y escalable
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          {...fadeIn}
          className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary}05 0%, ${client.colors.accent}05 100%)`
          }}
        >
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-4" style={{ color: client.colors.primary }}>
              Inversión
            </h2>
            <p className="text-base sm:text-lg md:text-xl px-4" style={{ color: '#374151' }}>
              Modelos flexibles para tu operación
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.pricing.tiers?.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className={`relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 ${
                  tier.recommended ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{
                  borderColor: tier.recommended ? client.colors.primary : '#e5e7eb',
                  backgroundColor: tier.recommended ? `${client.colors.primary}05` : 'white'
                }}
              >
                {tier.recommended && (
                  <div
                    className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold text-white"
                    style={{ backgroundColor: client.colors.primary }}
                  >
                    RECOMENDADO
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: client.colors.accent }}>
                  {tier.name}
                </h3>

                <div className="mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: client.colors.primary }}>
                    {tier.price}
                  </div>
                  {tier.period && (
                    <div className="text-sm mt-1" style={{ color: '#4B5563' }}>{tier.period}</div>
                  )}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3" style={{ color: '#374151' }}>
                      <Check size={20} style={{ color: client.colors.primary }} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
          }}
        >
          <div className="relative z-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 px-4" style={{ color: '#ffffff' }}>
              ¿Listo para eliminar el vendor lock-in?
            </h2>
            <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 text-white/90 px-4 max-w-3xl mx-auto leading-snug sm:leading-relaxed">
              Agenda una reunión de 30 minutos. Te mostraremos cómo Aureon Connect integra tu red de transportes en 48 horas.
            </p>

            <p className="text-base sm:text-xl md:text-2xl font-bold mb-4 sm:mb-8 text-white px-4">
              Contáctanos hoy
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <a
                href={`mailto:${content.contact.email}?subject=Consulta sobre Aureon Connect&body=Hola ${content.contact.name},%0D%0A%0D%0AMe interesa conocer más sobre Aureon Connect.%0D%0A%0D%0ASaludos,`}
                className="transition-colors"
                style={{ color: '#ffffff' }}
              >
                📧 {content.contact.email}
              </a>
              <a
                href={`https://wa.me/${content.contact.phone.replace(/[^0-9]/g, '')}?text=Hola, me interesa conocer más sobre Aureon Connect`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#ffffff' }}
              >
                📱 {content.contact.phone}
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </motion.section>
      </div>

      {/* Footer with Tractis Branding */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-gray-500">Powered by</span>
            <a
              href="https://tractis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/logos/tractis-color.svg"
                alt="Tractis AI"
                width={90}
                height={28}
                className="h-6 w-auto"
              />
            </a>
            <span className="text-xs text-gray-400">• {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
